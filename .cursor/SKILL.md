---
name: openapi-spec-transformer
description: |
  Transform Swagger 2.0 API specifications to OpenAPI 3.0.0 format for Babylon documentation site. Use this skill when: (1) Updating API specs from source repositories, (2) Converting Swagger 2.0 to OpenAPI 3.0 with tag enhancements, (3) Validating API spec changes against live endpoints, (4) Building and testing Docusaurus docs with updated specs, (5) Preparing PRs with endpoint-level change details. This is a hands-on Claude Code workflow, NOT CI/CD automation.
---

# OpenAPI Spec Transformer

Transform Swagger 2.0 API specs to OpenAPI 3.0.0 format in a single Claude Code session with full validation.

## Workflow Overview

```
1. Fetch Source Specs     → Download Swagger 2.0 from source repos
2. Transform              → Convert to OpenAPI 3.0 + enhancements
3. Compare Differences    → Diff against current specs
4. Test Public Endpoints  → Validate changes against live APIs
5. Build Website          → Run npm run build
6. Validate Build Output  → Confirm spec renders correctly
7. Confirm via API        → Re-test endpoints post-build
8. Prepare PR             → Create PR with endpoint details
```

## Source Repositories

| Source | Path | Target |
|--------|------|--------|
| `babylonlabs-io/babylon` | `client/docs/swagger-ui/swagger.yaml` | `static/swagger/babylon-grpc-openapi3.yaml` |
| `babylonlabs-io/staking-api-service` | `docs/swagger.yaml` | `static/swagger/babylon-staking-api-openapi3.yaml` |

## Step 1: Fetch Source Specs

Download Swagger 2.0 specs from source repositories:

```bash
# Babylon gRPC spec
curl -o /tmp/babylon-swagger2.yaml \
  https://raw.githubusercontent.com/babylonlabs-io/babylon/main/client/docs/swagger-ui/swagger.yaml

# Staking API spec
curl -o /tmp/staking-swagger2.yaml \
  https://raw.githubusercontent.com/babylonlabs-io/staking-api-service/main/docs/swagger.yaml
```

Verify download:
```bash
head -20 /tmp/babylon-swagger2.yaml  # Should show swagger: "2.0"
```

## Step 2: Transform to OpenAPI 3.0

### Base Conversion

Use `swagger2openapi` for mechanical conversion:

```bash
npx swagger2openapi /tmp/babylon-swagger2.yaml -o /tmp/babylon-openapi3-base.yaml
```

### Required Enhancements

After base conversion, apply these enhancements:

**1. Update openapi version:**
```yaml
openapi: 3.0.0
```

**2. Add info block:**
```yaml
info:
  title: Babylon gRPC API Docs
  description: |
    Babylon supports three RPC protocols:
    - URI/HTTP: Query parameters in URL
    - JSONRPC/HTTP: JSON body requests
    - JSONRPC/websockets: Real-time subscriptions
  version: "1.0.0"
```

**3. Add servers:**
```yaml
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

**4. Reorganize tags** (from single "Query" tag to module-specific):
```yaml
tags:
  - name: btccheckpoint
    description: BTC Checkpoint module queries and Txs
  - name: btclightclient
    description: BTC Light Client module queries and Txs
  - name: btcstaking
    description: Manages BTC staking, finality providers, and delegations
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

**5. Add x-tagGroups extension:**
```yaml
x-tagGroups:
  - name: btccheckpoint
    tags:
      - btc-checkpoint-info
      - btc-checkpoint-params
    description: BTC Checkpoint queries
  # ... repeat for each module
```

**6. Assign tags to paths** based on path prefix:
- `/babylon/btccheckpoint/` → `btccheckpoint`
- `/babylon/btclightclient/` → `btclightclient`
- `/babylon/btcstaking/` → `btcstaking`
- `/babylon/checkpointing/` → `checkpointing`
- `/babylon/epoching/` → `epoching`
- `/babylon/finality/` → `finalityprovider`
- `/babylon/incentive/` → `incentive`
- `/babylon/mint/` → `mint`

## Step 3: Compare Differences

Compare transformed spec against current spec:

```bash
# Show structural differences
diff -u static/swagger/babylon-grpc-openapi3.yaml /tmp/babylon-openapi3-transformed.yaml | head -100

# Count endpoint changes
grep -c "operationId:" static/swagger/babylon-grpc-openapi3.yaml
grep -c "operationId:" /tmp/babylon-openapi3-transformed.yaml
```

Key things to check:
- New endpoints added
- Endpoints removed
- Schema changes
- Tag reorganization

## Step 4: Test Against Public Endpoints

Validate key endpoints work with live APIs:

```bash
# Babylon gRPC endpoints
curl -s "https://babylon.nodes.guru/api/babylon/btcstaking/v1/params" | jq .

curl -s "https://babylon.nodes.guru/api/babylon/epoching/v1/current_epoch" | jq .

curl -s "https://babylon.nodes.guru/api/babylon/finality/v1/finality_providers" | jq .

# Staking API endpoints
curl -s "https://staking-api.babylonlabs.io/v2/stats" | jq .

curl -s "https://staking-api.babylonlabs.io/healthcheck" | jq .
```

Document which endpoints:
- ✓ Respond correctly
- ✓ Match spec parameters
- ✗ Have issues (note for PR)

## Step 5: Build Website

Copy transformed spec and build:

```bash
# Copy transformed spec
cp /tmp/babylon-openapi3-transformed.yaml static/swagger/babylon-grpc-openapi3.yaml

# Generate OpenAPI markdown
npm run genmd

# Build full site (checks broken links)
npm run build
```

**Critical**: Build must complete without errors. Common issues:
- Broken `$ref` paths in spec
- Missing schema definitions
- Invalid YAML syntax

## Step 6: Validate Build Output

Check the generated docs:

```bash
# Preview built site
npm run serve
# Open http://localhost:3000/api/babylon-gRPC/
```

Verify:
- [ ] All endpoints appear in sidebar
- [ ] Tags are grouped correctly
- [ ] Server dropdown shows all servers
- [ ] Schema references resolve
- [ ] Try "Try it out" functionality

## Step 7: Confirm via Public API

After build, re-verify endpoints match the spec:

```bash
# Pick 3-5 endpoints from the spec and test
# Compare response schema to spec definitions

# Example: Check finality providers endpoint
curl -s "https://babylon.nodes.guru/api/babylon/finality/v1/finality_providers?limit=1" | jq .
```

Confirm:
- Response fields match spec
- Required fields present
- Data types correct

## Step 8: Prepare PR

Create PR with endpoint-level details:

```bash
git checkout -b update-openapi-specs-$(date +%Y%m%d)
git add static/swagger/
git commit -m "docs: update OpenAPI specs from source repositories"
```

**PR Description Template:**

```markdown
## Summary
Update OpenAPI specs from source repositories.

## Changes

### Babylon gRPC API
- **New endpoints**: (list any new)
- **Removed endpoints**: (list any removed)
- **Modified schemas**: (list changes)

### Staking API
- **New endpoints**: (list any new)
- **Removed endpoints**: (list any removed)
- **Modified schemas**: (list changes)

## Validation
- [x] Endpoints tested against live APIs
- [x] Build completes without errors
- [x] Docs render correctly
- [x] Schema references resolve

## Test Commands Used
\`\`\`bash
curl -s "https://babylon.nodes.guru/api/babylon/btcstaking/v1/params" | jq .
# ... other test commands
\`\`\`
```

## Configuration Reference

### Docusaurus OpenAPI Plugin Config

Located in `docusaurus.config.js`:

```javascript
[
  'docusaurus-plugin-openapi-docs',
  {
    id: 'babylon-grpc',
    docsPluginId: 'classic',
    config: {
      babylonGrpc: {
        specPath: 'static/swagger/babylon-grpc-openapi3.yaml',
        outputDir: 'docs/api/babylon-gRPC',
        sidebarOptions: { groupPathsBy: 'tag' },
      },
    },
  },
]
```

### Required npm Scripts

```bash
npm run genmd    # Generate OpenAPI markdown
npm run build    # Build site (validates links)
npm run serve    # Preview built site
npm run dev      # Development server
```

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

## References

- **Tag Mapping**: See references/tag-mapping.md
- **Server Endpoints**: See references/servers.md
- **Transformation Examples**: See references/examples.md
