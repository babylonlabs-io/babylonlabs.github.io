import React, { useState, useEffect } from 'react';
import styles from './CoStakingCalculator.module.css';

// Constants
const CO_STAKING_FACTOR = 20000; // R = 20,000
const CO_STAKING_PORTION = 0.0235; // 2.35% of inflation goes to co-staking
const SATOSHIS_PER_BTC = 100000000; // 1 BTC = 100,000,000 satoshis
const UBBN_PER_BABY = 1000000; // 1 BABY = 1,000,000 ubbn (micro BBN)

// API endpoints
const COSTAKING_REWARDS_API = 'https://babylon-archive.nodes.guru/babylon/costaking/v1/current_rewards';

const getAPIBaseURL = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'https://babylon-archive.nodes.guru'; // Default testnet API
  }
  // Use the same domain for production, or configure via environment
  return 'https://babylon-archive.nodes.guru';
};

export default function CoStakingCalculator() {
  const [btcAmount, setBtcAmount] = useState('');
  const [babyAmount, setBabyAmount] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [networkData, setNetworkData] = useState(null);

  // Fetch network data on component mount
  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiBase = getAPIBaseURL();

      // Fetch current rewards (includes total_score) from the specific RPC endpoint
      const rewardsResponse = await fetch(COSTAKING_REWARDS_API);
      if (!rewardsResponse.ok) {
        throw new Error('Failed to fetch co-staking rewards');
      }
      const rewardsData = await rewardsResponse.json();

      // Fetch annual provisions
      const provisionsResponse = await fetch(`${apiBase}/cosmos/mint/v1beta1/annual_provisions`);
      if (!provisionsResponse.ok) {
        throw new Error('Failed to fetch annual provisions');
      }
      const provisionsData = await provisionsResponse.json();

      // Fetch incentive params to calculate co-staking portion
      const paramsResponse = await fetch(`${apiBase}/babylon/incentive/params`);
      let incentiveParams = null;
      if (paramsResponse.ok) {
        const paramsData = await paramsResponse.json();
        incentiveParams = paramsData.params;
      }

      // Fetch costaking params
      const costakingParamsResponse = await fetch(`${apiBase}/babylon/costaking/v1/params`);
      let costakingParams = null;
      if (costakingParamsResponse.ok) {
        const costakingParamsData = await costakingParamsResponse.json();
        costakingParams = costakingParamsData.params;
      }

      // Parse total_score (in satoshis) and convert to BTC
      const totalScoreSatoshis = BigInt(rewardsData.total_score || '0');
      const totalWeightBTC = Number(totalScoreSatoshis) / SATOSHIS_PER_BTC;

      // Parse annual provisions (in ubbn) and convert to BABY
      const annualProvisionsUbbn = parseFloat(provisionsData.annual_provisions || '0');
      const annualProvisionsBABY = annualProvisionsUbbn / UBBN_PER_BABY;

      // Calculate co-staking rewards
      let annualCoStakingRewards = 0;
      if (incentiveParams && costakingParams) {
        const btcPortion = parseFloat(incentiveParams.btc_staking_portion || '0');
        const fpPortion = parseFloat(incentiveParams.fp_portion || '0');
        const costakingPortion = parseFloat(costakingParams.costaking_portion || '0');
        const afterIncentives = 1.0 - btcPortion - fpPortion;
        annualCoStakingRewards = annualProvisionsBABY * afterIncentives * costakingPortion;
      } else {
        // Fallback: use fixed 5.5% inflation and 2.35% co-staking portion
        // Estimate total supply from annual provisions (assuming 5.5% inflation)
        const estimatedTotalSupply = annualProvisionsBABY / 0.055;
        annualCoStakingRewards = estimatedTotalSupply * 0.055 * CO_STAKING_PORTION;
      }

      setNetworkData({
        totalWeightBTC,
        annualCoStakingRewards,
        totalScoreSatoshis: totalScoreSatoshis.toString(),
      });
    } catch (err) {
      console.error('Error fetching network data:', err);
      setError('Failed to load network data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateRewards = () => {
    const btc = parseFloat(btcAmount) || 0;
    const baby = parseFloat(babyAmount) || 0;

    // Validate inputs
    if (btc <= 0 && baby <= 0) {
      alert('Please enter at least one stake amount (BTC or BABY)');
      return;
    }

    // Calculate user's weight
    const babyWeight = baby / CO_STAKING_FACTOR;
    const userWeight = Math.min(babyWeight, btc);

    // Calculate ratio and efficiency
    const ratio = btc > 0 ? baby / (btc * CO_STAKING_FACTOR) : 0;
    const efficiency = ratio >= 1 ? 100 : (ratio * 100).toFixed(2);
    const eligibleBTC = userWeight;
    const maxEligibleBTC = btc;

    // Build results object
    const calculationResults = {
      userWeight: userWeight.toFixed(4),
      eligibleBTC: eligibleBTC.toFixed(4),
      maxEligibleBTC: maxEligibleBTC.toFixed(4),
      efficiency: efficiency,
      needsMoreBaby: ratio < 1 && btc > 0 ? (btc * CO_STAKING_FACTOR) - baby : null,
      optimalBTC: ratio > 1 && baby > 0 ? baby / CO_STAKING_FACTOR : null,
      hasExcessBaby: ratio > 1 && baby > 0 && (baby / CO_STAKING_FACTOR) < btc,
    };

    // Calculate rewards using network data
    if (networkData && networkData.totalWeightBTC > 0 && userWeight > 0) {
      const userRewardShare = userWeight / networkData.totalWeightBTC;
      const annualReward = networkData.annualCoStakingRewards * userRewardShare;
      const dailyReward = annualReward / 365;
      const monthlyReward = annualReward / 12;

      calculationResults.rewards = {
        annual: annualReward,
        monthly: monthlyReward,
        daily: dailyReward,
        share: userRewardShare * 100,
        totalNetworkWeight: networkData.totalWeightBTC,
      };
    }

    setResults(calculationResults);
  };

  return (
    <div className={styles.calculatorContainer}>
      <h3>Calculate Your Co-Staking Rewards</h3>

      <div className={styles.inputGroup}>
        <label htmlFor="btc-amount">
          BTC Staked:
        </label>
        <input
          type="number"
          id="btc-amount"
          step="0.00000001"
          min="0"
          placeholder="e.g., 6.0"
          value={btcAmount}
          onChange={(e) => setBtcAmount(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="baby-amount">
          BABY Staked:
        </label>
        <input
          type="number"
          id="baby-amount"
          step="1"
          min="0"
          placeholder="e.g., 50000"
          value={babyAmount}
          onChange={(e) => setBabyAmount(e.target.value)}
          className={styles.input}
        />
      </div>

      {error && (
        <div className={`${styles.recommendationBox} ${styles.warningBox}`}>
          <strong>⚠️ Error:</strong> {error}
          <br />
          <button
            onClick={fetchNetworkData}
            style={{ marginTop: '10px', padding: '5px 10px', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className={styles.infoBox}>
          <strong>Loading network data...</strong>
        </div>
      )}

      <div className={styles.inputGroup}>
        <label htmlFor="total-weight">
          Total Network Co-Staking Weight <span className={styles.unitLabel}>(BTC)</span>:
        </label>
        <input
          type="text"
          id="total-weight"
          value={networkData ? networkData.totalWeightBTC.toFixed(4) : 'Loading...'}
          disabled
          className={styles.input}
        />
        <span className={styles.helperText}>
          Data source: <code>{COSTAKING_REWARDS_API}</code>
        </span>
      </div>

      <button
        onClick={calculateRewards}
        className={styles.calculateButton}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Calculate Rewards'}
      </button>

      {results && (
        <div className={styles.results}>
          <h4>Results:</h4>
          <div className={styles.resultsContent}>
            {/* Basic Info */}
            <div className={styles.infoBox}>
              <strong>Your Co-Staking Weight:</strong> {results.userWeight} BTC-equivalent<br />
              <strong>Eligible BTC:</strong> {results.eligibleBTC} / {results.maxEligibleBTC} BTC<br />
              <strong>Co-Staking Efficiency:</strong> {results.efficiency}% (100% = optimal ratio of 20,000 BABY per BTC)
              {parseFloat(results.userWeight) > 0 && (
                <div className={styles.weightNotification}>
                  ✅ <strong>You have co-staking weight!</strong> Even small amounts earn rewards proportionally.
                </div>
              )}
            </div>

            {/* Recommendations */}
            {results.needsMoreBaby && (
              <div className={`${styles.recommendationBox} ${styles.warningBox}`}>
                <strong>💡 Recommendation:</strong><br />
                To maximize rewards, stake {results.needsMoreBaby.toLocaleString()} more BABY tokens<br />
                (Target: {(parseFloat(btcAmount) * CO_STAKING_FACTOR).toLocaleString()} BABY for {btcAmount} BTC)
              </div>
            )}

            {results.hasExcessBaby && results.optimalBTC && (
              <div className={`${styles.recommendationBox} ${styles.infoBox}`}>
                <strong>💡 Note:</strong><br />
                You have excess BABY. Consider staking {results.optimalBTC.toFixed(4)} BTC to maximize efficiency<br />
                (Current: {btcAmount} BTC, Optimal: {results.optimalBTC.toFixed(4)} BTC)
              </div>
            )}

            {/* Reward Calculations */}
            {results.rewards ? (
              <>
                <div className={`${styles.recommendationBox} ${styles.successBox}`}>
                  <h4>Estimated Co-Staking Rewards (Annual):</h4>
                  <div className={styles.rewardAmount}>
                    {results.rewards.annual.toLocaleString(undefined, { maximumFractionDigits: 2 })} BABY/year
                  </div>
                  <div className={styles.rewardDetails}>
                    <strong>Monthly:</strong> {results.rewards.monthly.toLocaleString(undefined, { maximumFractionDigits: 2 })} BABY<br />
                    <strong>Daily:</strong> {results.rewards.daily.toLocaleString(undefined, { maximumFractionDigits: 2 })} BABY<br />
                    <strong>Your Share:</strong> {results.rewards.share.toFixed(4)}% of total co-staking pool<br />
                    <strong>Total Network Weight:</strong> {results.rewards.totalNetworkWeight.toFixed(4)} BTC-equivalent
                  </div>
                </div>

                <div className={styles.noteBox}>
                  <strong>Note:</strong> These are estimates based on current network data. Actual rewards vary based on:<br />
                  • Total BABY supply<br />
                  • Number of active co-stakers<br />
                  • Network participation changes<br />
                  • Data is fetched from chain in real-time
                </div>
              </>
            ) : networkData && parseFloat(results.userWeight) > 0 ? (
              <div className={styles.noteBox}>
                <strong>Reward Calculation:</strong><br />
                Your weight: <strong>{results.userWeight}</strong> BTC-equivalent<br />
                Total network weight: <strong>{networkData.totalWeightBTC.toFixed(4)}</strong> BTC-equivalent<br />
                <em>Rewards will be calculated automatically when you have co-staking weight.</em>
              </div>
            ) : (
              <div className={styles.noteBox}>
                <strong>Reward Estimation:</strong><br />
                Enter your BTC and BABY stakes above to calculate your estimated rewards.<br />
                Network data is loaded automatically from the chain.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}