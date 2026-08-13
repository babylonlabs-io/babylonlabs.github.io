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
