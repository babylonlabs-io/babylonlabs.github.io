import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/babylon-gRPC/babylon-grpc-api-docs",
    },
    {
      type: "category",
      label: "btccheckpoint",
      link: {
        type: "doc",
        id: "api/babylon-gRPC/btccheckpoint",
      },
      items: [
        {
          type: "doc",
          id: "api/babylon-gRPC/btc-checkpoints-info",
          label: "BtcCheckpointsInfo",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/btc-checkpoint-params",
          label: "BtcCheckpointParams",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/btc-checkpoint-info",
          label: "BtcCheckpointInfo",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/epoch-submissions",
          label: "EpochSubmissions",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "btclightclient",
      link: {
        type: "doc",
        id: "api/babylon-gRPC/btclightclient",
      },
      items: [
        {
          type: "doc",
          id: "api/babylon-gRPC/base-header",
          label: "BaseHeader",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/contains",
          label: "Contains",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/contains-bytes",
          label: "ContainsBytes",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/header-depth",
          label: "HeaderDepth",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/hashes",
          label: "Hashes",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/main-chain",
          label: "MainChain",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/btc-light-client-params",
          label: "BtcLightClientParams",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/tip",
          label: "Tip",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "btcstaking",
      link: {
        type: "doc",
        id: "api/babylon-gRPC/btcstaking",
      },
      items: [
        {
          type: "doc",
          id: "api/babylon-gRPC/btc-delegation",
          label: "BTCDelegation",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/btc-delegations",
          label: "BTCDelegations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-providers",
          label: "FinalityProviders",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-provider-delegations",
          label: "FinalityProviderDelegations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-provider",
          label: "FinalityProvider",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/largest-btc-re-org",
          label: "LargestBtcReOrg",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/params",
          label: "Params",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/params-by-btc-height",
          label: "ParamsByBTCHeight",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/params-by-version",
          label: "ParamsByVersion",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/params-versions",
          label: "ParamsVersions",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "btcstkconsumer",
      link: {
        type: "doc",
        id: "api/babylon-gRPC/btcstkconsumer",
      },
      items: [
        {
          type: "doc",
          id: "api/babylon-gRPC/consumer-registry-list",
          label: "ConsumerRegistryList",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/consumers-registry",
          label: "ConsumersRegistry",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-provider-consumer",
          label: "FinalityProviderConsumer",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-provider-consumer",
          label: "FinalityProviderConsumer",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-providers-consumer",
          label: "FinalityProvidersConsumer",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/btc-stk-consumer-params",
          label: "BtcStkConsumerParams",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "checkpointing",
      link: {
        type: "doc",
        id: "api/babylon-gRPC/checkpointing",
      },
      items: [
        {
          type: "doc",
          id: "api/babylon-gRPC/bls-public-key-list",
          label: "BlsPublicKeyList",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/epoch-status",
          label: "EpochStatus",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/recent-epoch-status-count",
          label: "RecentEpochStatusCount",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/last-checkpoint-with-status",
          label: "LastCheckpointWithStatus",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/raw-checkpoint",
          label: "RawCheckpoint",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/raw-checkpoints",
          label: "RawCheckpoints",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/raw-checkpoint-list",
          label: "RawCheckpointList",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "epoching",
      link: {
        type: "doc",
        id: "api/babylon-gRPC/epoching",
      },
      items: [
        {
          type: "doc",
          id: "api/babylon-gRPC/current-epoch",
          label: "CurrentEpoch",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/delegation-lifecycle",
          label: "DelegationLifecycle",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/epochs-info",
          label: "EpochsInfo",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/epoch-info",
          label: "EpochInfo",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/epoch-msgs",
          label: "EpochMsgs",
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
          label: "LatestEpochMsgs",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/epoching-params",
          label: "EpochingParams",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/validator-lifecycle",
          label: "ValidatorLifecycle",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "incentive",
      link: {
        type: "doc",
        id: "api/babylon-gRPC/incentive",
      },
      items: [
        {
          type: "doc",
          id: "api/babylon-gRPC/reward-gauges",
          label: "RewardGauge",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/btc-staking-gauge",
          label: "BTCStakingGauge",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/delegator-withdraw-address",
          label: "DelegatorWithdrawAddress",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/delegation-rewards",
          label: "DelegationRewards",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/incentive-params",
          label: "IncentiveParams",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "mint",
      link: {
        type: "doc",
        id: "api/babylon-gRPC/mint",
      },
      items: [
        {
          type: "doc",
          id: "api/babylon-gRPC/annual-provisions",
          label: "AnnualProvisions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/genesis-time",
          label: "GenesisTime",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/inflation-rate",
          label: "InflationRate",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "finality",
      items: [
        {
          type: "doc",
          id: "api/babylon-gRPC/activated-height",
          label: "ActivatedHeight",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/list-blocks",
          label: "ListBlocks",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/block",
          label: "Block",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/list-evidences",
          label: "ListEvidences",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/evidence",
          label: "Evidence",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-provider-current-power",
          label: "FinalityProviderCurrentPower",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-provider-power-at-height",
          label: "FinalityProviderPowerAtHeight",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/list-pub-rand-commit",
          label: "ListPubRandCommit",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/list-public-randomness",
          label: "ListPublicRandomness",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/active-finality-providers-at-height",
          label: "ActiveFinalityProvidersAtHeight",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finality-params",
          label: "FinalityParams",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/signing-infos",
          label: "SigningInfos",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/signing-info",
          label: "SigningInfo",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/votes-at-height",
          label: "VotesAtHeight",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "monitor",
      items: [
        {
          type: "doc",
          id: "api/babylon-gRPC/reported-checkpoint-btc-height",
          label: "ReportedCheckpointBtcHeight",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/ended-epoch-btc-height",
          label: "EndedEpochBtcHeight",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "zoneconcierge",
      items: [
        {
          type: "doc",
          id: "api/babylon-gRPC/header",
          label: "Header",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/chain-list",
          label: "ChainList",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/chains-info",
          label: "ChainsInfo",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/epoch-chains-info",
          label: "EpochChainsInfo",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finalized-chain-info-until-height",
          label: "FinalizedChainInfoUntilHeight",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/finalized-chains-info",
          label: "FinalizedChainsInfo",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/list-headers",
          label: "ListHeaders",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/list-epoch-headers",
          label: "ListEpochHeaders",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/babylon-gRPC/zone-concierge-params",
          label: "ZoneConciergeParams",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
