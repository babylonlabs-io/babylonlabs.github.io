import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "category",
      label: "Authentication",
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "api/babylon-gRPC/babylon-grpc-api-docs",
        },
      ],
    },
    {
      type: "category",
      label: "Content",
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "api/babylon-gRPC/babylon-grpc-api-docs",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
