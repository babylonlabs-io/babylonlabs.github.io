# Transformation Examples

## Example 1: Path Tag Transformation

### Before (Swagger 2.0)

```yaml
paths:
  /babylon/btcstaking/v1/params:
    get:
      summary: Parameters queries the parameters of the module
      operationId: BtcStakingParams
      tags:
        - Query
      responses:
        "200":
          description: A successful response
```

### After (OpenAPI 3.0)

```yaml
paths:
  /babylon/btcstaking/v1/params:
    get:
      summary: Parameters queries the parameters of the module
      operationId: BtcStakingParams
      tags:
        - btcstaking
      responses:
        "200":
          description: A successful response
```

---

## Example 2: Schema Reference Transformation

### Before (Swagger 2.0)

```yaml
definitions:
  babylonbtcstakingv1QueryParamsResponse:
    type: object
    properties:
      params:
        $ref: '#/definitions/babylonbtcstakingv1Params'
```

### After (OpenAPI 3.0)

```yaml
components:
  schemas:
    babylonbtcstakingv1QueryParamsResponse:
      type: object
      properties:
        params:
          $ref: '#/components/schemas/babylonbtcstakingv1Params'
```

---

## Example 3: Server Configuration

### Before (Swagger 2.0)

```yaml
swagger: "2.0"
host: "localhost"
basePath: "/"
schemes:
  - "http"
```

### After (OpenAPI 3.0)

```yaml
openapi: 3.0.0
servers:
  - url: https://babylon-archive.nodes.guru/api
    description: Mainnet RPC (Archive)
  - url: https://babylon.nodes.guru/api
    description: Mainnet RPC (Pruned)
  - url: https://rpc.testnet.babylonlabs.io/api
    description: Testnet RPC
  - url: http://localhost:9090
    description: Local development
```

---

## Example 4: Info Block Enhancement

### Before (Swagger 2.0)

```yaml
info:
  title: HTTP API Console
  version: "1.0"
```

### After (OpenAPI 3.0)

```yaml
info:
  title: Babylon gRPC API Docs
  description: |
    Babylon supports three RPC protocols:
    - URI/HTTP: Query parameters in URL
    - JSONRPC/HTTP: JSON body requests
    - JSONRPC/websockets: Real-time subscriptions

    ## RPC Configuration

    Enable in `app.toml`:
    ```toml
    [grpc]
    enable = true
    address = "0.0.0.0:9090"
    ```
  version: "1.0.0"
  contact:
    name: Babylon Labs
    url: https://babylonlabs.io
```

---

## Example 5: Full Endpoint Transformation

### Before (Swagger 2.0)

```yaml
swagger: "2.0"
paths:
  /babylon/finality/v1/finality_providers:
    get:
      summary: FinalityProviders queries all finality providers
      operationId: FinalityProviders
      tags:
        - Query
      parameters:
        - name: pagination.key
          in: query
          required: false
          type: string
          format: byte
        - name: pagination.limit
          in: query
          required: false
          type: string
          format: uint64
      responses:
        "200":
          description: A successful response
          schema:
            $ref: '#/definitions/babylonfinalityv1QueryFinalityProvidersResponse'
```

### After (OpenAPI 3.0)

```yaml
openapi: 3.0.0
paths:
  /babylon/finality/v1/finality_providers:
    get:
      summary: FinalityProviders queries all finality providers
      operationId: FinalityProviders
      tags:
        - finalityprovider
      parameters:
        - name: pagination.key
          in: query
          required: false
          schema:
            type: string
            format: byte
        - name: pagination.limit
          in: query
          required: false
          schema:
            type: string
            format: uint64
      responses:
        "200":
          description: A successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/babylonfinalityv1QueryFinalityProvidersResponse'
```

---

## Example 6: Enum Value Normalization

### Before (Source Swagger 2.0 — lowercase values, no varnames)

```yaml
definitions:
  types.FinalityProviderQueryingState:
    enum:
      - active
      - standby
    type: string
```

### After (OpenAPI 3.0 — SCREAMING_SNAKE_CASE with domain prefix + x-enum-varnames)

```yaml
components:
  schemas:
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

**Key changes:**
- Enum values converted from lowercase (`active`, `standby`) to SCREAMING_SNAKE_CASE with domain prefix (`FINALITY_PROVIDER_STATUS_ACTIVE`)
- Values updated to match live API responses (e.g., `standby` → `INACTIVE`)
- Added `description` field for the schema
- Added `x-enum-varnames` with PascalCase names for code generation
- `type: string` placed after `enum` list

### v2 State Enum Pattern

```yaml
# v2 state machine enums use SCREAMING_SNAKE_CASE without domain prefix
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

### v1 State Enum Pattern

```yaml
# v1 enums use lowercase snake_case (legacy convention)
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

---

## Example 7: Schema Name Cleanup (Staking API)

### Before (ugly auto-generated names)

```yaml
components:
  schemas:
    github_com_babylonlabs-io_staking-api-service_internal_shared_types.Error:
      type: object
      properties:
        err: {}
        errorCode:
          $ref: '#/components/schemas/github_com_babylonlabs-io_staking-api-service_internal_shared_types.ErrorCode'

    handler.ArrayResponse-v2service.DelegationPublic:
      type: object
      properties:
        data:
          items:
            $ref: '#/components/schemas/v2service.DelegationPublic'
          type: array
```

### After (clean names)

```yaml
components:
  schemas:
    types.Error:
      x-tags:
        - shared
      type: object
      properties:
        err: {}
        errorCode:
          $ref: '#/components/schemas/types.ErrorCode'

    handler.ArrayResponse_v2service.DelegationPublic:
      x-tags:
        - v2
      type: object
      properties:
        data:
          items:
            $ref: '#/components/schemas/v2service.DelegationPublic'
          type: array
```

---

## Quick Reference: Key Differences

| Swagger 2.0 | OpenAPI 3.0 |
|-------------|-------------|
| `swagger: "2.0"` | `openapi: 3.0.0` |
| `definitions:` | `components.schemas:` |
| `#/definitions/` | `#/components/schemas/` |
| `host:`, `basePath:`, `schemes:` | `servers:` array |
| `type: string` in parameter | `schema: { type: string }` |
| `schema:` in response | `content.application/json.schema:` |
| `produces:`, `consumes:` | `content:` per operation |

---

## Validation Checklist

After transformation, verify:

- [ ] `openapi: 3.0.0` at root
- [ ] All `$ref` paths use `#/components/schemas/`
- [ ] All parameters have `schema:` wrapper
- [ ] Response bodies wrapped in `content.application/json`
- [ ] `servers:` array present with valid URLs
- [ ] Tags assigned based on path prefix
- [ ] `x-tagGroups` present for sidebar organization
- [ ] Enum values use correct casing (SCREAMING_SNAKE_CASE for v2, lowercase snake_case for v1)
- [ ] Domain-specific enums have domain prefix (e.g., `FINALITY_PROVIDER_STATUS_*`)
- [ ] All enums have `x-enum-varnames` with PascalCase names
- [ ] Enum value ordering matches live API responses
- [ ] `type: string` placed after `enum` list, not before
- [ ] Schema names cleaned up (no Go package paths)
- [ ] All schemas have `x-tags` for API version grouping
