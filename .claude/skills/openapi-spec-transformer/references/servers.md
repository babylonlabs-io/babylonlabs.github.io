# Server Endpoints Reference

## Babylon gRPC API Servers

```yaml
servers:
  - url: https://babylon-archive.nodes.guru/api
    description: Mainnet RPC (Archive) - Full historical data
  - url: https://babylon.nodes.guru/api
    description: Mainnet RPC (Pruned) - Recent data only
  - url: https://rpc.testnet.babylonlabs.io/api
    description: Testnet RPC - For testing and development
  - url: http://localhost:9090
    description: Local development - For local node
```

### Server Selection Guide

| Use Case | Server |
|----------|--------|
| Production queries | `babylon.nodes.guru/api` |
| Historical data | `babylon-archive.nodes.guru/api` |
| Testing integration | `rpc.testnet.babylonlabs.io/api` |
| Local development | `localhost:9090` |

---

## Staking API Servers

```yaml
servers:
  - url: https://staking-api.babylonlabs.io
    description: Production Staking API
  - url: https://staking-api-testnet.babylonlabs.io
    description: Testnet Staking API
```

---

## Testing Endpoints

### Babylon gRPC Health Check

```bash
# Check if mainnet is responding
curl -s "https://babylon.nodes.guru/api/cosmos/base/tendermint/v1beta1/node_info" | jq .default_node_info.network

# Expected: "bbn-1" for mainnet
```

### Staking API Health Check

```bash
# Check if staking API is healthy
curl -s "https://staking-api.babylonlabs.io/healthcheck"

# Expected: {"status":"ok"}
```

---

## Common Test Endpoints

### Babylon gRPC

| Endpoint | Purpose |
|----------|---------|
| `/babylon/btcstaking/v1/params` | BTC staking parameters |
| `/babylon/epoching/v1/current_epoch` | Current epoch info |
| `/babylon/finality/v1/finality_providers` | List FPs |
| `/babylon/checkpointing/v1/raw_checkpoints` | Raw checkpoints |
| `/babylon/costaking/v1/params` | Co-staking parameters |
| `/cosmos/base/tendermint/v1beta1/node_info` | Node info |

### Staking API

| Endpoint | Purpose |
|----------|---------|
| `/healthcheck` | Health status |
| `/v2/stats` | Overall statistics |
| `/v2/finality-providers` | List finality providers |
| `/v2/delegations` | List delegations |

---

## Network-Specific Notes

### Mainnet (bbn-1)
- Chain ID: `bbn-1`
- Archive node retains full history
- Pruned node has faster queries but limited history

### Testnet
- Chain ID: `bbn-test-5` (verify current)
- May have different parameters
- Good for testing new features

### Local Development
- Default gRPC port: `9090`
- Requires running local Babylon node
- Use for development and debugging
