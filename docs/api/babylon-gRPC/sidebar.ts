/* import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/babylon-gRPC/babylon-grpc-api-docs",
    },
    {
      type: "category",
      label: "Babylon",
      items: [
        {
          type: "doc",
          id: "api/babylon-gRPC/btc-checkpoints-info",
          label: "BtcCheckpointsInfo returns checkpoint info for a range of epochs",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/btc-checkpoint-params",
          label: "Parameters queries the parameters of the module.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/btc-checkpoint-info",
          label: "BtcCheckpointInfo returns checkpoint info for a given epoch",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/epoch-submissions",
          label: "EpochSubmissions returns all submissions for a given epoch",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/base-header",
          label: "BaseHeader returns the base BTC header of the chain. This header is defined\non genesis.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/contains",
          label: "Contains checks whether a hash is maintained by the module.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/contains-bytes",
          label: "ContainsBytes is a temporary method that\nchecks whether a hash is maintained by the module.\nSee discussion at https://github.com/babylonlabs-io/babylon/pull/132\nfor more details.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/header-depth",
          label: "HeaderDepth returns the depth of the header in main chain or error if the\nblock is not found or it exists on fork",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/hashes",
          label: "Hashes retrieves the hashes maintained by the module.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/main-chain",
          label: "MainChain returns the canonical chain",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/btc-light-client-params",
          label: "Params queries the parameters of the module.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/tip",
          label: "Tip return best header on canonical chain",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/btc-delegation",
          label: "BTCDelegation retrieves delegation by corresponding staking tx hash",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/btc-delegations",
          label: "BTCDelegations queries all BTC delegations under a given status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-providers",
          label: "FinalityProviders queries all finality providers",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-provider-delegations",
          label: "FinalityProviderDelegations queries all BTC delegations of the given\nfinality provider",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-provider",
          label: "FinalityProvider info about one finality provider",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/largest-btc-re-org",
          label: "LargestBtcReOrg retrieves the largest BTC reorg",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/params",
          label: "Parameters queries the parameters of the module.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/params-by-btc-height",
          label: "ParamsByBTCHeight queries the parameters of the module for a specific BTC\nheight",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/params-by-version",
          label: "ParamsByVersion queries the parameters of the module for a specific version\nof past params.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/params-versions",
          label: "ParamsVersions queries all the parameters of the module with version.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/consumer-registry-list",
          label: "ConsumerRegistryList queries the list of consumers that are registered to Babylon",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/consumers-registry",
          label: "ConsumersRegistry queries the latest info for a given list of consumers in Babylon's view",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-provider-consumer",
          label: "FinalityProvider info about one finality provider",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-provider-consumer",
          label: "FinalityProviderConsumer info about one finality provider's consumer id",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-providers-consumer",
          label: "FinalityProviders queries all finality providers for a given consumer",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/btc-stk-consumer-params",
          label: "Parameters queries the parameters of the module.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/bls-public-key-list",
          label: "BlsPublicKeyList queries a list of bls public keys of the validators at a\ngiven epoch number.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/epoch-status",
          label: "EpochStatus queries the status of the checkpoint at a given epoch",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/recent-epoch-status-count",
          label: "RecentEpochStatusCount queries the number of epochs with each status in\nrecent epochs",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/last-checkpoint-with-status",
          label: "LastCheckpointWithStatus queries the last checkpoint with a given status or\na more matured status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/raw-checkpoint",
          label: "RawCheckpoint queries a checkpoints at a given epoch number.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/raw-checkpoints",
          label: "RawCheckpoints queries checkpoints for a epoch range specified in pagination params.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/raw-checkpoint-list",
          label: "RawCheckpointList queries all checkpoints that match the given status.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/current-epoch",
          label: "CurrentEpoch queries the current epoch",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/delegation-lifecycle",
          label: "DelegationLifecycle queries the lifecycle of a given delegation",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/epochs-info",
          label: "EpochsInfo queries the metadata of epochs in a given range, depending on\nthe parameters in the pagination request. Th main use case will be querying\nthe latest epochs in time order.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/epoch-info",
          label: "EpochInfo queries the information of a given epoch",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/epoch-msgs",
          label: "EpochMsgs queries the messages of a given epoch",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/epoch-val-set",
          label: "EpochValSet queries the validator set of a given epoch",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/latest-epoch-msgs",
          label: "LatestEpochMsgs queries the messages within a given number of most recent\nepochs",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/epoching-params",
          label: "Params queries the parameters of the module.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/validator-lifecycle",
          label: "ValidatorLifecycle queries the lifecycle of a given validator",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/activated-height",
          label: "ActivatedHeight queries the height when BTC staking protocol is activated, i.e., the first height when\nthere exists 1 finality provider with voting power",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/list-blocks",
          label: "ListBlocks is a range query for blocks at a given status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/block",
          label: "Block queries a block at a given height",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/list-evidences",
          label: "ListEvidences queries is a range query for evidences",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/evidence",
          label: "Evidence queries the first evidence which can be used for extracting the BTC SK",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-provider-current-power",
          label: "FinalityProviderCurrentPower queries the voting power of a finality provider at the current height",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-provider-power-at-height",
          label: "FinalityProviderPowerAtHeight queries the voting power of a finality provider at a given height",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/list-pub-rand-commit",
          label: "ListPubRandCommit is a range query for public randomness commitments of a given finality provider",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/list-public-randomness",
          label: "ListPublicRandomness is a range query for public randomness of a given finality provider\nNOTE: Babylon only has the knowledge of public randomness that is already revealed by\nfinality providers, i.e., the finality provider already provides a finality signature\nat the corresponding height",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/active-finality-providers-at-height",
          label: "ActiveFinalityProvidersAtHeight queries finality providers with non zero voting power at given height.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-params",
          label: "Parameters queries the parameters of the module.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/signing-infos",
          label: "SigningInfos queries the signing info of all the active finality providers",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/signing-info",
          label: "SigningInfo queries the signing info of given finality provider BTC public key",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/votes-at-height",
          label: "VotesAtHeight queries finality providers who have signed the block at given height.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/reward-gauges",
          label: "RewardGauge queries the reward gauge of a given stakeholder address",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/btc-staking-gauge",
          label: "btc_staking_gauge",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/delegator-withdraw-address",
          label: "DelegatorWithdrawAddress queries withdraw address of a delegator.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/delegation-rewards",
          label: "DelegationRewards queries the delegation rewards of given finality provider\nand delegator addresses",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/incentive-params",
          label: "Parameters queries the parameters of the module.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/reported-checkpoint-btc-height",
          label: "ReportedCheckpointBtcHeight returns the BTC light client height at which\nthe checkpoint with the given hash is reported back to Babylon",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/ended-epoch-btc-height",
          label: "EndedEpochBtcHeight returns the BTC light client height at provided epoch\nfinish",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/header",
          label: "Header queries the CZ header and fork headers at a given height.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/chain-list",
          label: "ChainList queries the list of chains that checkpoint to Babylon",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/chains-info",
          label: "ChainsInfo queries the latest info for a given list of chains in Babylon's view",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/epoch-chains-info",
          label: "EpochChainsInfo queries the latest info for a list of chains\nin a given epoch in Babylon's view",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finalized-chain-info-until-height",
          label: "FinalizedChainInfoUntilHeight queries the BTC-finalised info no later than\nthe provided CZ height, with proofs",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finalized-chains-info",
          label: "FinalizedChainsInfo queries the BTC-finalised info of chains with given IDs, with proofs",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/list-headers",
          label: "ListHeaders queries the headers of a chain in Babylon's view, with\npagination support",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/list-epoch-headers",
          label: "ListEpochHeaders queries the headers of a chain timestamped in a given\nepoch of Babylon, with pagination support",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/zone-concierge-params",
          label: "Params queries the parameters of the module.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/annual-provisions",
          label: "AnnualProvisions returns the current annual provisions.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/genesis-time",
          label: "GenesisTime returns the genesis time.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/inflation-rate",
          label: "InflationRate returns the current inflation rate.",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "CometBFT",
      items: [
        {
          type: "doc",
          id: "api/babylon-gRPC/broadcast-tx-sync",
          label: "Returns with the response from CheckTx. Does not wait for DeliverTx result.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/broadcast-tx-async",
          label: "Returns right away, with no response. Does not wait for CheckTx nor DeliverTx results.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/broadcast-tx-commit",
          label: "Returns with the responses from CheckTx and DeliverTx.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/check-tx",
          label: "Checks the transaction without executing it.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/health",
          label: "Node heartbeat",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/status",
          label: "Node Status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/net-info",
          label: "Network information",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/dial-seeds",
          label: "Dial Seeds (Unsafe)",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/dial-peers",
          label: "Add Peers/Persistent Peers (unsafe)",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/blockchain",
          label: "Get block headers (max: 20) for minHeight <= height <= maxHeight.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/header",
          label: "Get header at a specified height",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/header-by-hash",
          label: "Get header by hash",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/block",
          label: "Get block at a specified height",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/block-by-hash",
          label: "Get block by hash",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/block-results",
          label: "Get block results at a specified height",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/commit",
          label: "Get commit results at a specified height",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/validators",
          label: "Get validator set at a specified height",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/genesis",
          label: "Get Genesis",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/genesis-chunked",
          label: "Get Genesis in multiple chunks",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/dump-consensus-state",
          label: "Get consensus state",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/consensus-state",
          label: "Get consensus state",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/consensus-params",
          label: "Get consensus parameters",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/unconfirmed-txs",
          label: "Get the list of unconfirmed transactions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/num-unconfirmed-txs",
          label: "Get data about unconfirmed transactions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/tx-search",
          label: "Search for transactions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/block-search",
          label: "Search for blocks by FinalizeBlock events",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/tx",
          label: "Get transactions by hash",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/abci-info",
          label: "abci_info",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/abci-query",
          label: "Query the application for some information.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/broadcast-evidence",
          label: "Broadcast evidence of the misbehavior.",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
 */

import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/babylon-gRPC/babylon-grpc-api-docs", // Overview/Introduction
      label: "Overview",
    },
    {
      type: "category",
      label: "Babylon Modules",
      items: [
        // BTC Checkpoint Module
        {
          type: "category",
          label: "BTC Checkpoint",
          items: [
            { type: "doc", id: "api/babylon-gRPC/btc-checkpoint/btc-checkpoint-params", label: "Parameters" },
            { type: "doc", id: "api/babylon-gRPC/btc-checkpoint/btc-checkpoint-info", label: "Checkpoint Info (Single Epoch)" },
            { type: "doc", id: "api/babylon-gRPC/btc-checkpoint/btc-checkpoints-info", label: "Checkpoint Info (Epoch Range)" },
            { type: "doc", id: "api/babylon-gRPC/epoch-submissions", label: "Epoch Submissions" },
            { type: "doc", id: "api/babylon-gRPC/reported-checkpoint-btc-height", label: "Reported Checkpoint BTC Height" },
            { type: "doc", id: "api/babylon-gRPC/ended-epoch-btc-height", label: "Ended Epoch BTC Height" },
          ],
        },
        // BTC Light Client Module
        {
          type: "category",
          label: "BTC Light Client",
          items: [
            { type: "doc", id: "api/babylon-gRPC/btc-light-client-params", label: "Parameters" },
            { type: "doc", id: "api/babylon-gRPC/base-header", label: "Base Header" },
            { type: "doc", id: "api/babylon-gRPC/tip", label: "Tip Header" },
            { type: "doc", id: "api/babylon-gRPC/contains", label: "Contains Hash" },
            { type: "doc", id: "api/babylon-gRPC/contains-bytes", label: "Contains Hash (Bytes)" },
            { type: "doc", id: "api/babylon-gRPC/header-depth", label: "Header Depth" },
            { type: "doc", id: "api/babylon-gRPC/hashes", label: "Stored Hashes" },
            { type: "doc", id: "api/babylon-gRPC/main-chain", label: "Main Chain Headers" },
          ],
        },
        // BTC Staking Module
        {
          type: "category",
          label: "BTC Staking",
          items: [
             // BTC Staking General Params/Queries
            { type: "doc", id: "api/babylon-gRPC/params", label: "Parameters (Current)" },
            { type: "doc", id: "api/babylon-gRPC/params-by-btc-height", label: "Parameters by BTC Height" },
            { type: "doc", id: "api/babylon-gRPC/params-by-version", label: "Parameters by Version" },
            { type: "doc", id: "api/babylon-gRPC/params-versions", label: "Parameters Versions List" },
            { type: "doc", id: "api/babylon-gRPC/largest-btc-re-org", label: "Largest BTC ReOrg" },
            { type: "doc", id: "api/babylon-gRPC/activated-height", label: "Activation Height" },
             // Delegations
            { type: "doc", id: "api/babylon-gRPC/btc-delegation", label: "Delegation Info" },
            { type: "doc", id: "api/babylon-gRPC/btc-delegations", label: "List Delegations by Status" },
            { type: "doc", id: "api/babylon-gRPC/finality-provider-delegations", label: "Provider Delegations List" },
            { type: "doc", id: "api/babylon-gRPC/delegation-lifecycle", label: "Delegation Lifecycle" },
             // Finality Providers
            { type: "doc", id: "api/babylon-gRPC/finality-provider", label: "Provider Info" },
            { type: "doc", id: "api/babylon-gRPC/finality-providers", label: "List Providers" },
          ],
        },
         // BTC Staking Consumer Module
        {
            type: "category",
            label: "BTC Staking Consumer",
            items: [
                { type: "doc", id: "api/babylon-gRPC/btc-stk-consumer-params", label: "Parameters" },
                { type: "doc", id: "api/babylon-gRPC/consumer-registry-list", label: "List Registered Consumers" },
                { type: "doc", id: "api/babylon-gRPC/consumers-registry", label: "Consumer Info" },
                { type: "doc", id: "api/babylon-gRPC/finality-provider-consumer", label: "Provider's Consumer Info" }, // Needs clarification or distinct ID if labels were identical
                { type: "doc", id: "api/babylon-gRPC/finality-providers-consumer", label: "List Providers for Consumer" },
            ]
        },
        // Checkpoint Module (General Checkpointing Logic)
        {
          type: "category",
          label: "Checkpointing",
          items: [
            { type: "doc", id: "api/babylon-gRPC/bls-public-key-list", label: "BLS Public Keys (Epoch)" },
            { type: "doc", id: "api/babylon-gRPC/raw-checkpoint", label: "Raw Checkpoint (Single Epoch)" },
            { type: "doc", id: "api/babylon-gRPC/raw-checkpoints", label: "Raw Checkpoints (Epoch Range)" },
            { type: "doc", id: "api/babylon-gRPC/raw-checkpoint-list", label: "Raw Checkpoints (by Status)" },
            { type: "doc", id: "api/babylon-gRPC/epoch-status", label: "Epoch Status" },
            { type: "doc", id: "api/babylon-gRPC/recent-epoch-status-count", label: "Recent Epoch Status Count" },
            { type: "doc", id: "api/babylon-gRPC/last-checkpoint-with-status", label: "Last Checkpoint by Status" },
          ],
        },
        // Epoching Module
        {
          type: "category",
          label: "Epoching",
          items: [
            { type: "doc", id: "api/babylon-gRPC/epoching-params", label: "Parameters" },
            { type: "doc", id: "api/babylon-gRPC/current-epoch", label: "Current Epoch" },
            { type: "doc", id: "api/babylon-gRPC/epoch-info", label: "Epoch Info (Single)" },
            { type: "doc", id: "api/babylon-gRPC/epochs-info", label: "Epoch Info (Range)" },
            { type: "doc", id: "api/babylon-gRPC/epoch-msgs", label: "Epoch Messages" },
            { type: "doc", id: "api/babylon-gRPC/epoch-val-set", label: "Epoch Validator Set" },
            { type: "doc", id: "api/babylon-gRPC/latest-epoch-msgs", label: "Latest Epoch Messages" },
            { type: "doc", id: "api/babylon-gRPC/validator-lifecycle", label: "Validator Lifecycle" },
          ],
        },
        // Finality Provider Module
        {
            type: "category",
            label: "Finality Provider",
            items: [
                { type: "doc", id: "api/babylon-gRPC/finality-params", label: "Parameters" },
                { type: "doc", id: "api/babylon-gRPC/list-blocks", label: "List Blocks by Status" },
                { type: "doc", id: "api/babylon-gRPC/block", label: "Block Info" }, // Finality block
                { type: "doc", id: "api/babylon-gRPC/list-evidences", label: "List Evidences" },
                { type: "doc", id: "api/babylon-gRPC/evidence", label: "Evidence Info" },
                { type: "doc", id: "api/babylon-gRPC/active-finality-providers-at-height", label: "Active Providers at Height" },
                { type: "doc", id: "api/babylon-gRPC/finality-provider-current-power", label: "Provider Current Power" },
                { type: "doc", id: "api/babylon-gRPC/finality-provider-power-at-height", label: "Provider Power at Height" },
                { type: "doc", id: "api/babylon-gRPC/list-pub-rand-commit", label: "List Public Randomness Commits" },
                { type: "doc", id: "api/babylon-gRPC/list-public-randomness", label: "List Revealed Public Randomness" },
                { type: "doc", id: "api/babylon-gRPC/signing-info", label: "Signing Info (Single Provider)" },
                { type: "doc", id: "api/babylon-gRPC/signing-infos", label: "Signing Infos (All Active)" },
                { type: "doc", id: "api/babylon-gRPC/votes-at-height", label: "Votes at Height" },
            ]
        },
        // Incentive Module
        {
          type: "category",
          label: "Incentives",
          items: [
            { type: "doc", id: "api/babylon-gRPC/incentive-params", label: "Parameters" },
            { type: "doc", id: "api/babylon-gRPC/reward-gauges", label: "Reward Gauges" },
            { type: "doc", id: "api/babylon-gRPC/btc-staking-gauge", label: "BTC Staking Gauge" },
            { type: "doc", id: "api/babylon-gRPC/delegator-withdraw-address", label: "Delegator Withdraw Address" },
            { type: "doc", id: "api/babylon-gRPC/delegation-rewards", label: "Delegation Rewards" },
          ],
        },
        // Zone Concierge Module
        {
          type: "category",
          label: "Zone Concierge",
          items: [
            { type: "doc", id: "api/babylon-gRPC/zone-concierge-params", label: "Parameters" },
            { type: "doc", id: "api/babylon-gRPC/chain-list", label: "List Checkpointed Chains" },
            { type: "doc", id: "api/babylon-gRPC/chains-info", label: "Chains Info" },
            { type: "doc", id: "api/babylon-gRPC/epoch-chains-info", label: "Epoch Chains Info" },
            { type: "doc", id: "api/babylon-gRPC/finalized-chain-info-until-height", label: "Finalized Chain Info (Until Height)" },
            { type: "doc", id: "api/babylon-gRPC/finalized-chains-info", label: "Finalized Chains Info (by ID)" },
            { type: "doc", id: "api/babylon-gRPC/header", label: "Chain Header" }, // ZoneConcierge header
            { type: "doc", id: "api/babylon-gRPC/list-headers", label: "List Chain Headers" },
            { type: "doc", id: "api/babylon-gRPC/list-epoch-headers", label: "List Chain Headers (Epoch)" },
          ],
        },
        // Mint Module (Inflation)
        {
            type: "category",
            label: "Mint",
            items: [
                { type: "doc", id: "api/babylon-gRPC/genesis-time", label: "Genesis Time" },
                { type: "doc", id: "api/babylon-gRPC/inflation-rate", label: "Inflation Rate" },
                { type: "doc", id: "api/babylon-gRPC/annual-provisions", label: "Annual Provisions" },
            ]
        }
      ],
    },
    {
      type: "category",
      label: "CometBFT RPC",
      items: [
         // Transaction RPC
        {
            type: "category",
            label: "Transactions",
            items: [
                { type: "doc", id: "api/babylon-gRPC/broadcast-tx-async", label: "Broadcast Tx Async" },
                { type: "doc", id: "api/babylon-gRPC/broadcast-tx-sync", label: "Broadcast Tx Sync" },
                { type: "doc", id: "api/babylon-gRPC/broadcast-tx-commit", label: "Broadcast Tx Commit" },
                { type: "doc", id: "api/babylon-gRPC/check-tx", label: "Check Tx" },
                { type: "doc", id: "api/babylon-gRPC/tx", label: "Get Tx by Hash" },
                { type: "doc", id: "api/babylon-gRPC/tx-search", label: "Search Txs" },
                { type: "doc", id: "api/babylon-gRPC/unconfirmed-txs", label: "List Unconfirmed Txs" },
                { type: "doc", id: "api/babylon-gRPC/num-unconfirmed-txs", label: "Number of Unconfirmed Txs" },
            ]
        },
         // Node & Network RPC
        {
            type: "category",
            label: "Node & Network",
            items: [
                { type: "doc", id: "api/babylon-gRPC/health", label: "Health Check" },
                { type: "doc", id: "api/babylon-gRPC/status", label: "Node Status" },
                { type: "doc", id: "api/babylon-gRPC/net-info", label: "Network Info" },
                { type: "doc", id: "api/babylon-gRPC/dial-seeds", label: "Dial Seeds (Unsafe)" },
                { type: "doc", id: "api/babylon-gRPC/dial-peers", label: "Dial Peers (Unsafe)" },
            ]
        },
         // Block & Chain RPC
        {
            type: "category",
            label: "Block & Chain",
            items: [
                { type: "doc", id: "api/babylon-gRPC/blockchain", label: "Get Block Headers (Range)" },
                { type: "doc", id: "api/babylon-gRPC/header", label: "Get Header by Height" }, // CometBFT header
                { type: "doc", id: "api/babylon-gRPC/header-by-hash", label: "Get Header by Hash" },
                { type: "doc", id: "api/babylon-gRPC/block", label: "Get Block by Height" }, // CometBFT block
                { type: "doc", id: "api/babylon-gRPC/block-by-hash", label: "Get Block by Hash" },
                { type: "doc", id: "api/babylon-gRPC/block-results", label: "Get Block Results by Height" },
                { type: "doc", id: "api/babylon-gRPC/block-search", label: "Search Blocks" },
                { type: "doc", id: "api/babylon-gRPC/commit", label: "Get Commit by Height" },
                { type: "doc", id: "api/babylon-gRPC/validators", label: "Get Validators by Height" },
                { type: "doc", id: "api/babylon-gRPC/genesis", label: "Get Genesis" },
                { type: "doc", id: "api/babylon-gRPC/genesis-chunked", label: "Get Genesis (Chunked)" },
            ]
        },
         // Consensus RPC
        {
            type: "category",
            label: "Consensus",
            items: [
                { type: "doc", id: "api/babylon-gRPC/dump-consensus-state", label: "Dump Consensus State" },
                { type: "doc", id: "api/babylon-gRPC/consensus-state", label: "Get Consensus State" },
                { type: "doc", id: "api/babylon-gRPC/consensus-params", label: "Get Consensus Parameters" },
            ]
        },
         // ABCI RPC
        {
            type: "category",
            label: "ABCI",
            items: [
                { type: "doc", id: "api/babylon-gRPC/abci-info", label: "ABCI Info" },
                { type: "doc", id: "api/babylon-gRPC/abci-query", label: "ABCI Query" },
            ]
        },
         // Evidence RPC
        {
            type: "category",
            label: "Evidence",
            items: [
                 { type: "doc", id: "api/babylon-gRPC/broadcast-evidence", label: "Broadcast Evidence" },
            ]
        }
      ],
    },
  ],
};

export default sidebar.apisidebar;

