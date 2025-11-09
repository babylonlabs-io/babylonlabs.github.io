import React, { useState } from 'react';
import styles from './CoStakingCalculator.module.css';

// Constants
const CO_STAKING_FACTOR = 20000; // R = 20,000
const ANNUAL_INFLATION_RATE = 0.055; // 5.5% annual inflation
const CO_STAKING_PORTION = 0.0235; // 2.35% of inflation goes to co-staking

export default function CoStakingCalculator() {
  const [btcAmount, setBtcAmount] = useState('');
  const [babyAmount, setBabyAmount] = useState('');
  const [totalNetworkWeight, setTotalNetworkWeight] = useState('');
  const [results, setResults] = useState(null);

  const calculateRewards = () => {
    const btc = parseFloat(btcAmount) || 0;
    const baby = parseFloat(babyAmount) || 0;
    const totalWeight = parseFloat(totalNetworkWeight) || null;

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
      ratio: (baby / (btc || 1)).toLocaleString(),
      efficiency: efficiency,
      needsMoreBaby: ratio < 1 && btc > 0 ? (btc * CO_STAKING_FACTOR) - baby : null,
      optimalBTC: ratio > 1 && baby > 0 ? baby / CO_STAKING_FACTOR : null,
      hasExcessBaby: ratio > 1 && baby > 0 && (baby / CO_STAKING_FACTOR) < btc,
      totalNetworkWeight: totalWeight,
    };

    // Calculate rewards if total network weight is provided
    if (totalWeight && totalWeight > 0) {
      // Assuming 1B total supply for calculation (this should be adjusted based on actual supply)
      const ASSUMED_TOTAL_SUPPLY = 1000000000;
      const annualCoStakingRewards = ASSUMED_TOTAL_SUPPLY * ANNUAL_INFLATION_RATE * CO_STAKING_PORTION;
      const userRewardShare = userWeight / totalWeight;
      const annualReward = annualCoStakingRewards * userRewardShare;
      const dailyReward = annualReward / 365;
      const monthlyReward = annualReward / 12;

      calculationResults.rewards = {
        annual: annualReward,
        monthly: monthlyReward,
        daily: dailyReward,
        share: userRewardShare * 100,
      };
    }

    setResults(calculationResults);
  };

  return (
    <div className={styles.calculatorContainer}>
      <h3>Calculate Your Co-Staking Rewards</h3>

      <div className={styles.inputGroup}>
        <label htmlFor="btc-amount">
          BTC Staked (to active FPs):
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
          BABY Staked (to validators):
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

      <div className={styles.inputGroup}>
        <label htmlFor="total-co-stakers-weight">
          Total Network Co-Staking Weight (optional, for accurate calculation):
        </label>
        <input
          type="number"
          id="total-co-stakers-weight"
          step="0.01"
          min="0"
          placeholder="Leave empty for ratio calculation only"
          value={totalNetworkWeight}
          onChange={(e) => setTotalNetworkWeight(e.target.value)}
          className={styles.input}
        />
        <small className={styles.helperText}>
          If left empty, calculator will show your weight and ratio only
        </small>
      </div>

      <button onClick={calculateRewards} className={styles.calculateButton}>
        Calculate Rewards
      </button>

      {results && (
        <div className={styles.results}>
          <h4>Results:</h4>
          <div className={styles.resultsContent}>
            {/* Basic Info */}
            <div className={styles.infoBox}>
              <strong>Your Co-Staking Weight:</strong> {results.userWeight} BTC-equivalent<br />
              <strong>Eligible BTC:</strong> {results.eligibleBTC} / {results.maxEligibleBTC} BTC<br />
              <strong>BABY per BTC Ratio:</strong> {results.ratio} BABY/BTC<br />
              <strong>Efficiency:</strong> {results.efficiency}% (100% = optimal ratio of 20,000 BABY per BTC)
              {parseFloat(results.userWeight) > 0 && (
                <div style={{ marginTop: '10px', padding: '8px', background: '#d4edda', borderRadius: '4px', fontSize: '14px' }}>
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
                  <h4>Estimated Rewards (Annual):</h4>
                  <div className={styles.rewardAmount}>
                    {results.rewards.annual.toLocaleString(undefined, { maximumFractionDigits: 2 })} BABY/year
                  </div>
                  <div className={styles.rewardDetails}>
                    <strong>Monthly:</strong> {results.rewards.monthly.toLocaleString(undefined, { maximumFractionDigits: 2 })} BABY<br />
                    <strong>Daily:</strong> {results.rewards.daily.toLocaleString(undefined, { maximumFractionDigits: 2 })} BABY<br />
                    <strong>Your Share:</strong> {results.rewards.share.toFixed(4)}% of total co-staking pool
                  </div>
                </div>

                <div className={styles.noteBox}>
                  <strong>Note:</strong> These are estimates based on current network weight. Actual rewards vary based on:<br />
                  • Total BABY supply<br />
                  • Number of active co-stakers<br />
                  • Network participation changes
                </div>
              </>
            ) : (
              <div className={styles.noteBox}>
                <strong>Reward Estimation:</strong><br />
                To see estimated rewards, enter the total network co-staking weight.<br />
                Your weight: <strong>{results.userWeight}</strong> BTC-equivalent<br />
                Reward formula: <code>Total Co-Staking Pool × ({results.userWeight} / Total Network Weight)</code>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


