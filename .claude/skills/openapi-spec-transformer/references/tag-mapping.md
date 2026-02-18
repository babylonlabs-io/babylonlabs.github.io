# Tag Mapping Reference

## Babylon gRPC API Tags

### Path Prefix to Tag Mapping

| Path Prefix | Tag | Description |
|-------------|-----|-------------|
| `/babylon/btccheckpoint/` | `btccheckpoint` | BTC Checkpoint module queries and Txs |
| `/babylon/btclightclient/` | `btclightclient` | BTC Light Client module queries and Txs |
| `/babylon/btcstaking/` | `btcstaking` | Manages BTC staking, finality providers, and delegations |
| `/babylon/btcstkconsumer/` | `btcstkconsumer` | Manages consumer chain registration and interaction |
| `/babylon/costaking/` | `costaking` | Co-staking module queries |
| `/babylon/checkpointing/` | `checkpointing` | Handles checkpoint creation and status tracking |
| `/babylon/epoching/` | `epoching` | Manages epoch lifecycle and validator sets |
| `/babylon/finality/` | `finalityprovider` | Finality provider registration and status |
| `/babylon/incentive/` | `incentive` | Reward calculation and distribution |
| `/babylon/mint/` | `mint` | Token inflation and minting parameters |
| `/babylon/monitor/` | `monitor` | Monitor module for checkpoint and epoch verification |
| `/babylon/zoneconcierge/` | `zoneconcierge` | Zone Concierge cross-chain header and finalization queries |
| `/cosmos/` | Keep original | Standard Cosmos SDK endpoints |

> **Fallback**: Any unmapped `/babylon/<module>/` prefix should be logged as a warning and assigned to an `other` tag. Update this table when new modules appear in the source spec.

### x-tagGroups Structure

```yaml
x-tagGroups:
  - name: btccheckpoint
    tags:
      - btc-checkpoint-info
      - btc-checkpoint-params
      - btc-checkpoint-submissions
    description: BTC Checkpoint queries
  - name: btclightclient
    tags:
      - btc-headers
      - btc-tip
      - btc-params
    description: BTC Light Client queries
  - name: btcstaking
    tags:
      - btc-staking-params
      - btc-delegations
      - finality-providers-staking
    description: BTC Staking queries
  - name: btcstkconsumer
    tags:
      - btcstk-consumer-params
      - btcstk-consumer-chains
    description: BTC Staking Consumer queries
  - name: costaking
    tags:
      - costaking-params
      - costaking-delegations
    description: Co-staking queries
  - name: checkpointing
    tags:
      - checkpoint-status
      - checkpoint-epochs
    description: Checkpointing queries
  - name: epoching
    tags:
      - epoch-info
      - epoch-msgs
      - epoch-validators
    description: Epoching queries
  - name: finalityprovider
    tags:
      - finality-providers
      - finality-votes
      - finality-evidence
    description: Finality Provider queries
  - name: incentive
    tags:
      - rewards
      - reward-gauges
    description: Incentive queries
  - name: mint
    tags:
      - mint-params
      - inflation
    description: Mint queries
  - name: monitor
    tags:
      - monitor-checkpoints
      - monitor-epochs
    description: Monitor queries
  - name: zoneconcierge
    tags:
      - zone-chain-info
      - zone-headers
      - zone-finalization
    description: Zone Concierge queries
```

---

## Staking API Tags

### Path Prefix to Tag Mapping

| Path Prefix | Tag | Description |
|-------------|-----|-------------|
| `/v1/` | `v1` | Phase-1 API endpoints (deprecated) |
| `/v2/` | `v2` | Phase-2 API endpoints (current) |
| `/healthcheck` | `shared` | Health and status endpoints |

### Staking API Tag Definitions

```yaml
tags:
  - name: v1
    description: Phase-1 API endpoints (deprecated). Use v2 endpoints for new integrations.
  - name: v2
    description: Phase-2 API endpoints. Current recommended API version.
  - name: shared
    description: Common endpoints across all versions (health checks, stats).
```

---

## Transformation Logic

When transforming specs, apply tags based on path matching:

```javascript
function assignTag(path) {
  const tagMap = {
    '/babylon/btccheckpoint/': 'btccheckpoint',
    '/babylon/btclightclient/': 'btclightclient',
    '/babylon/btcstaking/': 'btcstaking',
    '/babylon/btcstkconsumer/': 'btcstkconsumer',
    '/babylon/costaking/': 'costaking',
    '/babylon/checkpointing/': 'checkpointing',
    '/babylon/epoching/': 'epoching',
    '/babylon/finality/': 'finalityprovider',
    '/babylon/incentive/': 'incentive',
    '/babylon/mint/': 'mint',
    '/babylon/monitor/': 'monitor',
    '/babylon/zoneconcierge/': 'zoneconcierge',
  };

  for (const [prefix, tag] of Object.entries(tagMap)) {
    if (path.startsWith(prefix)) {
      return tag;
    }
  }
  // Log unmapped Babylon modules so they can be added to this mapping
  if (path.startsWith('/babylon/')) {
    console.warn(`Unmapped Babylon module path: ${path}`);
  }
  return 'other';
}
```

---

## Common Issues

### Source Spec Uses Single Tag
Source Swagger 2.0 typically uses `tags: [Query]` for all endpoints. Replace with module-specific tags.

### Missing Tag Definitions
If an endpoint uses a tag not in the `tags` array, add it:

```yaml
tags:
  - name: new-tag-name
    description: Description of the new tag
```

### x-tagGroups Not Rendering
Ensure `x-tagGroups` is at the root level of the spec, not nested under `info` or other keys.
