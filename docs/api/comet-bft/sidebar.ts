import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/comet-bft/babylon-grpc-api-docs",
    },
    {
      type: "category",
      label: "mint",
      link: {
        type: "doc",
        id: "api/comet-bft/mint",
      },
      items: [
        {
          type: "doc",
          id: "api/comet-bft/annual-provisions",
          label: "AnnualProvisions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/genesis-time",
          label: "GenesisTime",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/inflation-rate",
          label: "InflationRate",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "CometBFT",
      link: {
        type: "doc",
        id: "api/comet-bft/comet-bft",
      },
      items: [
        {
          type: "doc",
          id: "api/comet-bft/broadcast-tx-sync",
          label: "broadcast_tx_sync",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/broadcast-tx-async",
          label: "broadcast_tx_async",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/broadcast-tx-commit",
          label: "broadcast_tx_commit",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/check-tx",
          label: "check_tx",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/health",
          label: "health",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/status",
          label: "status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/net-info",
          label: "net_info",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/dial-seeds",
          label: "dial_seeds (unsafe)",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/dial-peers",
          label: "dial_peers (unsafe)",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/blockchain",
          label: "blockchain",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/header",
          label: "header",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/header-by-hash",
          label: "header_by_hash",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/block",
          label: "block",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/block-by-hash",
          label: "block_by_hash",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/block-results",
          label: "block_results",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/commit",
          label: "commit",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/validators",
          label: "validators",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/genesis",
          label: "genesis",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/genesis-chunked",
          label: "genesis_chunked",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/dump-consensus-state",
          label: "dump_consensus_state",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/consensus-state",
          label: "consensus_state",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/consensus-params",
          label: "consensus_params",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/unconfirmed-txs",
          label: "unconfirmed_txs",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/num-unconfirmed-txs",
          label: "num_unconfirmed_txs",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/tx-search",
          label: "tx_search",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/block-search",
          label: "block_search",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/tx",
          label: "tx",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/abci-info",
          label: "abci_info",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/abci-query",
          label: "abci_query",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/comet-bft/broadcast-evidence",
          label: "broadcast_evidence",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
