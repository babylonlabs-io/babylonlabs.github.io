import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/staking-api/babylon-staking-api",
    },
    {
      type: "category",
      label: "shared",
      link: {
        type: "doc",
        id: "api/staking-api/shared",
      },
      items: [
        {
          type: "doc",
          id: "api/staking-api/health-check-endpoint",
          label: "Health check endpoint",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/staking-api/delegation-check",
          label: "Delegation Check",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/staking-api/get-stakers-public-keys",
          label: "Get stakers' public keys",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "v2",
      link: {
        type: "doc",
        id: "api/staking-api/v-2",
      },
      items: [
        {
          type: "doc",
          id: "api/staking-api/get-a-delegation",
          label: "Get a delegation",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/staking-api/get-delegations",
          label: "Get Delegations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/staking-api/list-finality-providers",
          label: "List Finality Providers",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/staking-api/get-network-info",
          label: "Get Network Info",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/staking-api/get-prices",
          label: "Get Prices",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/staking-api/get-staker-stats",
          label: "Get Staker Stats",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/staking-api/get-overall-stats",
          label: "Get Overall Stats",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "v1",
      link: {
        type: "doc",
        id: "api/staking-api/v-1",
      },
      items: [
        {
          type: "doc",
          id: "api/staking-api/delegation",
          label: "Delegation",
          className: "menu__list-item--deprecated api-method get",
        },
        {
          type: "doc",
          id: "api/staking-api/get-active-finality-providers-deprecated",
          label: "Get Active Finality Providers (Deprecated)",
          className: "menu__list-item--deprecated api-method get",
        },
        {
          type: "doc",
          id: "api/staking-api/global-params",
          label: "Global Params",
          className: "menu__list-item--deprecated api-method get",
        },
        {
          type: "doc",
          id: "api/staking-api/get-staker-delegations",
          label: "Get Staker Delegations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/staking-api/get-overall-stats-deprecated",
          label: "Get Overall Stats (Deprecated)",
          className: "menu__list-item--deprecated api-method get",
        },
        {
          type: "doc",
          id: "api/staking-api/get-staker-stats-deprecated",
          label: "Get Staker Stats (Deprecated)",
          className: "menu__list-item--deprecated api-method get",
        },
        {
          type: "doc",
          id: "api/staking-api/unbond-phase-1-delegation",
          label: "Unbond phase-1 delegation",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/staking-api/check-unbonding-eligibility",
          label: "Check unbonding eligibility",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
