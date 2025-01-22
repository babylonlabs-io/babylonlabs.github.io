---
id: grpcrestapi
sidebar_label: gRPC Gateway (REST API)
hide_table_of_contents: true

---

# GRPC Gateway API 

Babylond's implementation is based on CometBFT node rpcs. In addition, some custom modules also allow Babylon specific methods. 

Please refer to both Babylon gRPC API and CometBFT API specifications for details. 

[Babylon Custom gRPC](https://app.swaggerhub.com/apis-docs/jvssptyltd/babylon_g_rpc_gateway_docs/1.0.0)

[Babylon Standard gRPC (CometBFT v0.38)](https://app.swaggerhub.com/apis-docs/jvssptyltd/comet-bft_rpc/v0.38.x)


Phase 3: Devnet Endpoints

| Provider      | RPC Endpoint                          | LCD Nodes Endpoint                     | gRPC Endpoint                          |
|---------------|---------------------------------------|---------------------------------------|----------------------------------------|
| Babylon Labs  | https://rpc.devnet.babylonlabs.io    | https://lcd.devnet.babylonlabs.io    | https://grpc.devnet.babylonlabs.io    |

Phase 2: Testnet Endpoints

| Provider      | RPC Endpoint                          | LCD Nodes Endpoint                     | gRPC Endpoint                          |
|---------------|---------------------------------------|---------------------------------------|----------------------------------------|
| Nodes Guru    | https://babylon-testnet-rpc.nodes.guru | https://babylon-testnet-api.nodes.guru | https://babylon-testnet-grpc.nodes.guru |
| Polkachu      | https://babylon-testnet-rpc.polkachu.com | https://babylon-testnet-api.polkachu.com | http://babylon-testnet-grpc.polkachu.com:20690 |