---
name: openapi-spec-transformer
description: |
  Transform Swagger 2.0 API specifications to OpenAPI 3.0.0 format for Babylon documentation site.
  Use this skill when: (1) Updating API specs from source repositories, (2) Converting Swagger 2.0 to
  OpenAPI 3.0 with tag enhancements, (3) Syncing API docs with upstream changes.
  This is a FULLY AUTONOMOUS Claude Code workflow — execute all steps end-to-end without pausing for
  human review. The human validates locally after completion.
---

# OpenAPI Spec Transformer

Transform Swagger 2.0 API specs to OpenAPI 3.0.0 format in a single Claude Code session. Run ALL steps autonomously — do NOT pause between steps for human confirmation.

## Execution Mode

**AUTONOMOUS**: Execute every step sequentially without asking the user to review intermediate results. Only stop if a step fails with an unrecoverable error. After all steps complete, present a summary for the user to validate locally.

## Workflow Overview

```
1. Fetch Source Specs        → Download Swagger 2.0 from source repos
2. Read Current Specs        → Load existing OpenAPI 3.0 specs from repo
3. Transform                 → Convert to OpenAPI 3.0 + all enhancements
4. Compare Differences       → Diff new vs current specs (endpoint-level)
5. Test Public Endpoints     → Validate a sample of endpoints against live APIs
6. Update Repo Specs         → Copy transformed specs into static/swagger/
7. Regenerate Docs           → Run npm run genmd, fix sidebar, npm run build
8. Present Summary           → Show diff summary + test results for human review
```

## Source Repositories

| Source | Path | Target |
|--------|------|--------|
| `babylonlabs-io/babylon` | `client/docs/swagger-ui/swagger.yaml` | `static/swagger/babylon-grpc-openapi3.yaml` |
| `babylonlabs-io/staking-api-service` | `docs/swagger.yaml` | `static/swagger/babylon-staking-api-openapi3.yaml` |

---

## Step 1: Fetch Source Specs

Download Swagger 2.0 specs from source repositories into `/tmp/`:

```bash
# Babylon gRPC spec
curl -sL -o /tmp/babylon-swagger2.yaml \
  https://raw.githubusercontent.com/babylonlabs-io/babylon/main/client/docs/swagger-ui/swagger.yaml

# Staking API spec
curl -sL -o /tmp/staking-swagger2.yaml \
  https://raw.githubusercontent.com/babylonlabs-io/staking-api-service/main/docs/swagger.yaml
```

**Verify downloads succeeded** (must show `swagger: "2.0"` near the top):
```bash
head -5 /tmp/babylon-swagger2.yaml
head -5 /tmp/staking-swagger2.yaml
```

If either download fails, stop and report the error.

## Step 2: Read Current Specs

Read the existing OpenAPI 3.0 specs from the repository to enable comparison:

```bash
# These are the CURRENT specs that will be replaced
cat static/swagger/babylon-grpc-openapi3.yaml > /tmp/babylon-grpc-current.yaml
cat static/swagger/babylon-staking-api-openapi3.yaml > /tmp/staking-api-current.yaml
```

Also capture current endpoint counts for the diff summary:
```bash
grep -c "operationId:" static/swagger/babylon-grpc-openapi3.yaml
grep -c "operationId:" static/swagger/babylon-staking-api-openapi3.yaml
```

## Step 3: Transform to OpenAPI 3.0

### 3a. Base Conversion

Use `swagger2openapi` for mechanical Swagger 2.0 → OpenAPI 3.0 conversion:

```bash
npx swagger2openapi /tmp/babylon-swagger2.yaml -o /tmp/babylon-openapi3-base.yaml
npx swagger2openapi /tmp/staking-swagger2.yaml -o /tmp/staking-openapi3-base.yaml
```

### 3b. Babylon gRPC Enhancements

Read `/tmp/babylon-openapi3-base.yaml` and apply ALL of the following enhancements:

**1. Set openapi version:**
```yaml
openapi: 3.0.0
```

**2. Set info block:**
```yaml
info:
  title: Babylon gRPC API Docs
  description: |
    A Babylon gRPC Gateway is a REST interface for Babylon's gRPC.
    This specification documents the RPCs for Babylon specific RPCs.

    **Supported RPC protocols:**

    *   URI over HTTP
    *   JSONRPC over HTTP
    *   JSONRPC over websockets

    **Configuration**

    RPC can be configured by tuning parameters under "[rpc]" table in the
    `$CMTHOME/config/config.toml` file or by using the `--rpc.X` command-line flags.

    The default RPC listen address is `tcp://127.0.0.1:26657`.
  version: "1.0.0"
  contact:
    name: Babylon Labs
    url: https://babylonlabs.io
```

**3. Add servers** (see references/servers.md for full list):
```yaml
servers:
  - url: https://babylon-archive.nodes.guru/api
    description: Mainnet RPC (Archive) - Full historical data
  - url: https://babylon.nodes.guru/api
    description: Mainnet RPC (Pruned) - Recent data only
  - url: https://rpc.testnet.babylonlabs.io/api
    description: Testnet RPC - For testing and development
  - url: http://localhost:9090
    description: Local development
```

**4. Reorganize tags** (replace single "Query" tag with module-specific tags):
```yaml
tags:
  - name: btccheckpoint
    description: BTC Checkpoint module queries and Txs
  - name: btclightclient
    description: BTC Light Client module queries and Txs
  - name: btcstaking
    description: Manages BTC staking, finality providers, and delegations
  - name: btcstkconsumer
    description: Manages consumer chain registration and interaction with BTC-staked finality providers
  - name: costaking
    description: Co-staking module queries
  - name: checkpointing
    description: Handles checkpoint creation and status tracking
  - name: epoching
    description: Manages epoch lifecycle and validator sets
  - name: finalityprovider
    description: Finality provider registration and status
  - name: incentive
    description: Reward calculation and distribution
  - name: mint
    description: Token inflation and minting parameters
```

**5. Add x-tagGroups extension** (see references/tag-mapping.md for full structure).

**6. Assign tags to ALL paths** based on path prefix mapping:
- `/babylon/btccheckpoint/` → `btccheckpoint`
- `/babylon/btclightclient/` → `btclightclient`
- `/babylon/btcstaking/` → `btcstaking`
- `/babylon/btcstkconsumer/` → `btcstkconsumer`
- `/babylon/costaking/` → `costaking`
- `/babylon/checkpointing/` → `checkpointing`
- `/babylon/epoching/` → `epoching`
- `/babylon/finality/` → `finalityprovider`
- `/babylon/incentive/` → `incentive`
- `/babylon/mint/` → `mint`
- `/cosmos/` → Keep original tag or assign `CometBFT`

### 3c. Staking API Enhancements

Read `/tmp/staking-openapi3-base.yaml` and apply ALL of the following:

**1. Set openapi version:**
```yaml
openapi: 3.0.0
```

**2. Set info block:**
```yaml
info:
  title: Babylon Staking API
  description: Babylon Staking API provides endpoints for BTC staking operations.
  version: "2.0"
```

**3. Add servers:**
```yaml
servers:
  - url: https://staking-api.babylonlabs.io
    description: Production (Mainnet)
  - url: https://staking-api-testnet.babylonlabs.io
    description: Testnet
```

**4. Tags:**
```yaml
tags:
  - name: v1
    description: Phase-1 API endpoints (deprecated). Use v2 endpoints for new integrations.
  - name: v2
    description: Phase-2 API endpoints. Current recommended API version.
  - name: shared
    description: Common endpoints across all versions (health checks, stats).
```

Assign tags based on path:
- `/v1/` → `v1`
- `/v2/` → `v2`
- `/healthcheck` → `shared`

**5. Clean up schema names** (CRITICAL):

The source Swagger spec has ugly auto-generated Go paths. Apply these replacements to BOTH schema definitions AND all `$ref` references throughout the spec:

```
github_com_babylonlabs-io_staking-api-service_internal_shared_types.Error → types.Error
handler.ArrayResponse-v1service → handler.ArrayResponse_v1service
handler.ArrayResponse-v2service → handler.ArrayResponse_v2service
handler.MapResponse-String → handler.MapResponse_String
handler.PublicResponse-v1service → handler.PublicResponse_v1service
handler.PublicResponse-v2service → handler.PublicResponse_v2service
handler.PublicResponse-v2handlers → handler.PublicResponse_v2handlers
handler.paginationResponse → handler.PaginationResponse
indexertypes. → indexerTypes.
```

**Expected clean schema names:**
```
types.Error, types.ErrorCode, types.MapStringFloat64, types.MapStringString,
types.FinalityProviderDescription, types.FinalityProviderQueryingState,
handler.PaginationResponse, handler.ArrayResponse_v1service.DelegationPublic,
handler.ArrayResponse_v2service.DelegationPublic, handler.MapResponse_StringFloat64,
handler.MapResponse_StringString, handler.PublicResponse_v1service.DelegationPublic,
handler.PublicResponse_v2service.DelegationPublic, indexerTypes.BbnStakingParams,
indexerTypes.BtcCheckpointParams, v1handlers.DelegationCheckPublicResponse,
v1handlers.UnbondDelegationRequestPayload, v1service.DelegationPublic,
v1service.FpDescriptionPublic, v1service.FpDetailsPublic, v1service.GlobalParamsPublic,
v1service.OverallStatsPublic, v1service.StakerStatsPublic, v1service.TransactionPublic,
v1service.VersionedGlobalParamsPublic, v2handlers.AddressScreeningResponse,
v2service.CovenantSignature, v2service.DelegationPublic, v2service.DelegationStaking,
v2service.DelegationUnbonding, v2service.FinalityProviderStatsPublic,
v2service.NetworkInfoPublic, v2service.OverallStatsPublic, v2service.ParamsPublic,
v2service.StakerStatsPublic, v2service.StakingSlashing, v2service.StakingStatusPublic,
v2service.UnbondingSlashing, v2types.DelegationState
```

**6. Normalize enum values and add `x-enum-varnames`:**

Schema enums must follow the correct naming convention per API version and include `x-enum-varnames` for code generation. Always verify enum values against the live API response, not just the source Swagger spec.

**Staking API enum conventions:**

| API Version | Enum Value Style | x-enum-varnames Style | Example |
|-------------|-----------------|----------------------|---------|
| v1 (`types.*`) | lowercase snake_case | PascalCase (no prefix) | `active` → `Active` |
| v2 (`v2types.*`) | SCREAMING_SNAKE_CASE | `State`-prefixed PascalCase | `ACTIVE` → `StateActive` |
| Domain enums | SCREAMING_SNAKE_CASE with domain prefix | Domain-prefixed PascalCase | `FINALITY_PROVIDER_STATUS_ACTIVE` → `FinalityProviderStatusActive` |
| Error codes | SCREAMING_SNAKE_CASE | PascalCase | `INTERNAL_SERVICE_ERROR` → `InternalServiceError` |

**Rules:**
- v2 enum values MUST be SCREAMING_SNAKE_CASE (e.g., `PENDING`, `ACTIVE`, `TIMELOCK_UNBONDING`)
- Domain-specific enums (like `FinalityProviderQueryingState`) use a domain prefix on each value (e.g., `FINALITY_PROVIDER_STATUS_ACTIVE`, not just `ACTIVE`)
- Every enum MUST include `x-enum-varnames` with a PascalCase variant name for each value
- Enum value ordering must match the live API — verify against actual responses, especially for state machine enums like `DelegationState`
- When the source spec has lowercase enum values for v2 endpoints, convert them to SCREAMING_SNAKE_CASE
- `type: string` comes after the `enum` list, not before

**Example — v2 domain enum:**
```yaml
types.FinalityProviderQueryingState:
  description: Status of a finality provider
  enum:
    - FINALITY_PROVIDER_STATUS_ACTIVE
    - FINALITY_PROVIDER_STATUS_INACTIVE
  type: string
  x-enum-varnames:
    - FinalityProviderStatusActive
    - FinalityProviderStatusInactive
```

**Example — v2 state enum:**
```yaml
v2types.DelegationState:
  enum:
    - PENDING
    - VERIFIED
    - ACTIVE
    - TIMELOCK_UNBONDING
    - EARLY_UNBONDING
    - TIMELOCK_WITHDRAWABLE
    - EARLY_UNBONDING_WITHDRAWABLE
    - TIMELOCK_SLASHING_WITHDRAWABLE
    - EARLY_UNBONDING_SLASHING_WITHDRAWABLE
    - TIMELOCK_WITHDRAWN
    - EARLY_UNBONDING_WITHDRAWN
    - TIMELOCK_SLASHING_WITHDRAWN
    - EARLY_UNBONDING_SLASHING_WITHDRAWN
    - SLASHED
    - EXPANDED
  type: string
  x-enum-varnames:
    - StatePending
    - StateVerified
    - StateActive
    - StateTimelockUnbonding
    - StateEarlyUnbonding
    - StateTimelockWithdrawable
    - StateEarlyUnbondingWithdrawable
    - StateTimelockSlashingWithdrawable
    - StateEarlyUnbondingSlashingWithdrawable
    - StateTimelockWithdrawn
    - StateEarlyUnbondingWithdrawn
    - StateTimelockSlashingWithdrawn
    - StateEarlyUnbondingSlashingWithdrawn
    - StateSlashed
    - StateExpanded
```

**Example — v1 state enum:**
```yaml
types.DelegationState:
  enum:
    - active
    - unbonding_requested
    - unbonding
    - unbonded
    - withdrawable
    - withdrawn
    - transitioned
    - slashed
  type: string
  x-enum-varnames:
    - Active
    - UnbondingRequested
    - Unbonding
    - Unbonded
    - Withdrawable
    - Withdrawn
    - Transitioned
    - Slashed
```

**7. Add x-tags to group schemas with API versions:**

By default, all schemas appear in a separate "Schemas" category. To group them with their corresponding API version, add `x-tags` to each schema definition:

```yaml
components:
  schemas:
    types.Error:
      x-tags:
        - shared
      # ... properties

    handler.ArrayResponse_v1service.DelegationPublic:
      x-tags:
        - v1
      # ... properties

    v2service.DelegationPublic:
      x-tags:
        - v2
      # ... properties
```

**Schema tagging rules:**
- `types.*`, `handler.PaginationResponse`, `handler.MapResponse_*`, `indexerTypes.*` → `x-tags: [shared]`
- `v1handlers.*`, `v1service.*`, `handler.*_v1service.*`, `handler.*_v1handlers.*` → `x-tags: [v1]`
- `v2handlers.*`, `v2service.*`, `v2types.*`, `handler.*_v2service.*`, `handler.*_v2handlers.*` → `x-tags: [v2]`

## Step 4: Compare Differences

Compare the NEW transformed specs against the CURRENT repo specs. Record:

```bash
# Count endpoints in current vs new
echo "=== Babylon gRPC ==="
echo "Current endpoints: $(grep -c 'operationId:' /tmp/babylon-grpc-current.yaml)"
echo "New endpoints: $(grep -c 'operationId:' /tmp/babylon-openapi3-transformed.yaml)"

echo "=== Staking API ==="
echo "Current endpoints: $(grep -c 'operationId:' /tmp/staking-api-current.yaml)"
echo "New endpoints: $(grep -c 'operationId:' /tmp/staking-openapi3-transformed.yaml)"
```

Also identify:
- **New endpoints** added (operationIds in new but not current)
- **Removed endpoints** (operationIds in current but not new)
- **Schema changes** (new/removed/modified schemas)
- **Tag changes** (reorganization)

Store results for the final summary.

## Step 5: Test Public Endpoints

Test a sample of endpoints against live APIs to validate the spec is accurate:

```bash
# Babylon gRPC - test 3 endpoints
curl -s "https://babylon.nodes.guru/api/babylon/btcstaking/v1/params" | head -c 200
curl -s "https://babylon.nodes.guru/api/babylon/epoching/v1/current_epoch" | head -c 200
curl -s "https://babylon.nodes.guru/api/babylon/finality/v1/finality_providers?pagination.limit=1" | head -c 200

# Staking API - test 2 endpoints
curl -s "https://staking-api.babylonlabs.io/healthcheck" | head -c 200
curl -s "https://staking-api.babylonlabs.io/v2/stats" | head -c 200
```

Record which endpoints respond successfully. Do NOT stop on test failures — just record them for the summary.

## Step 6: Update Repo Specs

Copy transformed specs into the repository:

```bash
cp /tmp/babylon-openapi3-transformed.yaml static/swagger/babylon-grpc-openapi3.yaml
cp /tmp/staking-openapi3-transformed.yaml static/swagger/babylon-staking-api-openapi3.yaml
```

## Step 7: Regenerate Docs and Build

### 7a. Clean old generated docs

```bash
rm -rf docs/api/staking-api/
rm -rf docs/api/babylon-gRPC/
rm -rf docs/api/comet-bft/
```

### 7b. Regenerate OpenAPI markdown

```bash
npm run genmd
```

Verify all files show "Successfully created". If any show "Failed to write", the YAML spec has issues — fix them before continuing.

### 7c. Fix sidebar.ts empty Schemas category

After regeneration, check each `sidebar.ts` for an empty "Schemas" category:

```typescript
// REMOVE this block if items is empty:
{
  type: "category",
  label: "Schemas",
  items: [],
},
```

This happens when `x-tags` move all schemas to their tag categories. The empty category causes a build error: `"Sidebar category Schemas has neither any subitem nor a link."`

Check these files:
- `docs/api/staking-api/sidebar.ts`
- `docs/api/babylon-gRPC/sidebar.ts`
- `docs/api/comet-bft/sidebar.ts`

### 7d. Build the site

```bash
npm run build
```

**The build MUST succeed.** Common failures and fixes:
1. **Broken links**: Check `$ref` paths in YAML
2. **Invalid sidebar file**: Old sidebar.ts references non-existent doc IDs → delete docs/api/ and regenerate
3. **Missing $ref pointer**: Schema was renamed but `$ref` references weren't updated → use `replace_all`
4. **Empty Schemas category**: Remove empty Schemas block from sidebar.ts

If the build fails, diagnose and fix the issue, then re-run the build. Repeat until it succeeds.

## Step 8: Present Summary

After all steps complete, present a summary to the user:

```
## OpenAPI Spec Transformation Complete

### Babylon gRPC API
- Endpoints: [old count] → [new count] ([+/- diff])
- New endpoints: [list or "none"]
- Removed endpoints: [list or "none"]
- Tag changes: [summary]

### Staking API
- Endpoints: [old count] → [new count] ([+/- diff])
- New endpoints: [list or "none"]
- Removed endpoints: [list or "none"]
- Schema changes: [summary]

### Live API Tests
- [endpoint]: [pass/fail]
- [endpoint]: [pass/fail]
- ...

### Build Status
- genmd: [pass/fail]
- build: [pass/fail]

### Next Steps
The user should:
1. Run `npm run serve` to preview at http://localhost:3000
2. Check /api/babylon-gRPC/ and /api/staking-api/ pages
3. Verify endpoint grouping and schema display
4. When satisfied, commit and create PR to `dev` branch
```

---

## Troubleshooting

### Build Fails with Broken Links
- Check `$ref` paths in YAML
- Ensure all schema definitions exist
- Run `npm run clear` before rebuild

### Endpoints Not Appearing
- Verify tags match `x-tagGroups`
- Check `operationId` is unique
- Ensure path has at least one operation

### Schema Validation Errors
- Use online OpenAPI validator
- Check for circular references
- Verify `required` fields exist in `properties`

### Enum Values Don't Match API Responses
- Source Swagger spec may have outdated or incorrect enum values
- Always verify enums against live API responses: `curl -s <endpoint> | jq .`
- v2 enums must be SCREAMING_SNAKE_CASE — convert if source uses lowercase
- Domain enums need a prefix (e.g., `FINALITY_PROVIDER_STATUS_` for FP states)
- Check enum ordering — state machine enums should follow the lifecycle order
- Ensure every enum has matching `x-enum-varnames` with the same count of entries

### Sidebar Shows Old Names After Schema Changes
- Delete `docs/api/staking-api/` and regenerate: `rm -rf docs/api/staking-api/ && npm run genmd`
- The `docusaurus-plugin-openapi-docs` generates sidebar.ts with labels from YAML schema names
- Old generated files persist and cause conflicts if not cleaned

### Empty "Schemas" Category Build Error
- Cause: All schemas moved to tag categories via `x-tags`, leaving empty "Schemas" category
- Fix: Edit `docs/api/staking-api/sidebar.ts` and remove the empty Schemas category block

## References

- **Tag Mapping**: See references/tag-mapping.md
- **Server Endpoints**: See references/servers.md
- **Transformation Examples**: See references/examples.md
