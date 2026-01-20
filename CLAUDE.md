# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the official Babylon Labs documentation site built with Docusaurus 3.7. The site provides comprehensive documentation for Babylon Labs' Bitcoin staking protocol, including guides for stakers, developers, operators, and Bitcoin Supercharged Networks (BSNs).

**Site Launched**: March 21, 2025

### Purpose and Goals

This documentation site serves as a single source of truth for:
- Protocol overview and core concepts (Bitcoin staking, BSNs, Finality Providers)
- Reliable product information and use cases
- Standardized installation, setup, deployment and maintenance procedures
- Accurate technical specifications, integration guides and chain information
- User-focused guides for stakers, operators, and developers

The site aims to:
- Improve user experience and reduce educational efforts by staff
- Communicate project planning and roadmap
- Make staking, running nodes, and building on Babylon chain faster
- Uplift Babylon's technical branding in the industry

## Tech Stack

- **Framework**: Docusaurus 3.7 (React-based static site generator)
- **Language**: TypeScript/JavaScript with React 18
- **Styling**: Tailwind CSS + Custom CSS
- **Content**: MDX (Markdown with JSX)
- **API Docs**: OpenAPI (via `docusaurus-plugin-openapi-docs`)
- **Build Tool**: SWC (Speedy Web Compiler)

## Development Commands

### Start Development Server
```bash
npm run dev
# or
npm start
```
Server runs at `http://localhost:3000`

### Build Production Site
```bash
npm run build
```
**IMPORTANT**: The build process:
1. Runs `npm run fetch` to fetch remote documentation
2. Builds the static site
3. **Throws errors on broken links** (`onBrokenLinks: 'throw'` in config)
4. Always run before committing to catch broken links - deployments will fail if broken links exist

### Linting and Formatting
```bash
npm run lint          # Check for lint errors
npm run lint:fix      # Auto-fix lint errors
npm run format        # Format all source and docs
npm run format:docs   # Format only docs
npm run typecheck     # Run TypeScript type checking
npm run spell-check   # Check spelling in docs
```

### Other Commands
```bash
npm run serve         # Preview production build locally
npm run clear         # Clear Docusaurus cache
npm run fetch         # Manually fetch remote docs (runs automatically on build)
npm run genmd         # Generate OpenAPI markdown docs
```

## Repository Structure

```
docs/                    # Main documentation content (MDX files)
├── guides/             # Overview and conceptual documentation
│   ├── overview/       # Landing and intro pages
│   │   └── babylon_genesis/  # Core Babylon Genesis docs
│   │       ├── architecture/     # System architecture
│   │       │   ├── btc_staking_program/  # BTC staking details
│   │       │   └── vigilantes/           # Vigilante services
│   │       ├── governance/       # Governance processes
│   │       ├── networks/         # Mainnet and testnet info
│   │       └── specifications/   # Technical specs
│   ├── research/       # Research papers and whitepapers
│   ├── security/       # Security audits and bug bounty
│   └── support/        # FAQ and Discord links
├── stakers/            # Staker documentation
│   ├── btc_stakers/    # BTC staking guides
│   │   ├── native_staking/   # Direct staking
│   │   ├── liquid_staking/   # LST protocols
│   │   └── campaigns/        # Staking campaigns
│   └── baby_stakers/   # BABY token staking
├── developers/         # Developer documentation
│   ├── bitcoin_staking/      # Bitcoin staking integration
│   │   ├── wallet_integration/   # Wallet guides
│   │   ├── staking_backend/      # Backend setup
│   │   └── networks/             # Network configs
│   └── babylon_genesis_chain/    # Babylon chain development
│       ├── dapps/                # dApp development
│       ├── wallet_setup/         # Wallet configuration
│       └── explorers/            # Block explorers
├── operators/          # Node operator documentation
│   ├── babylon_node/       # Full node setup
│   │   └── babylon_cli/    # CLI reference
│   ├── babylon_validators/ # Validator guides
│   ├── finality_providers/ # FP operation
│   ├── covenant_emulator/  # Covenant setup
│   ├── vigilantes/         # Vigilante services
│   └── staker_cli/         # Staker CLI tools
└── api/                # Auto-generated API docs
    ├── staking-api/        # Staking API reference
    ├── babylon-gRPC/       # Babylon gRPC API
    └── comet-bft/          # CometBFT RPC API

src/
├── components/         # React components
│   ├── RemoteMD.jsx       # Remote GitHub markdown fetcher
│   ├── ChatWidget.tsx     # AI assistant chat widget
│   ├── ChatWidget.css     # Chat widget styles
│   ├── ApiVersionSelector.tsx
│   └── homepage/          # Homepage components
├── theme/             # Docusaurus theme customizations
├── css/               # Custom CSS and Tailwind
└── pages/             # Custom pages (non-doc content)

static/
├── swagger/           # OpenAPI spec files (YAML)
├── remote-docs/       # Fetched remote documentation (generated)
├── logo/              # Site logos
└── img/               # Images

plugins/
├── fetch-remote-docs.cjs  # Fetches docs from GitHub repos
├── tailwind-plugin.cjs    # Tailwind CSS integration
└── webpack-react-provider.cjs  # React polyfills for browser

docusaurus.config.js   # Main Docusaurus configuration
sidebars-default.js    # Sidebar navigation structure
```

## Key Architecture Concepts

### Remote Documentation System

This site uses a custom system to fetch and display documentation from external GitHub repositories:

1. **RemoteMD Component** (`src/components/RemoteMD.jsx`):
   - React component that fetches markdown from GitHub raw URLs
   - Supports multi-version documentation with release tag selector
   - Handles relative links and images
   - Auto-generates heading IDs for anchor links

2. **Build-time Fetching** (`plugins/fetch-remote-docs.cjs`):
   - Scans all MDX files for `<RemoteMD>` components
   - Downloads remote markdown files during build
   - Converts to HTML and stores in `static/remote-docs/`
   - Generates sitemap for remote docs
   - **Runs automatically during `npm run build`**

3. **Usage in MDX files**:
   ```jsx
   <RemoteMD
     rawUrl="https://raw.githubusercontent.com/owner/repo/branch/path/file.md"
     releaseVersions={{
       "v1.0.0": "https://raw.githubusercontent.com/owner/repo/v1.0.0/path/file.md",
       "v2.0.0": "https://raw.githubusercontent.com/owner/repo/v2.0.0/path/file.md"
     }}
     defaultRelease="v2.0.0"
     hideRelease={false}
   />
   ```

### Sidebar Configuration

- **Auto-generated sidebars**: Most sections use `{ type: 'autogenerated', dirName: 'section-name' }` in `sidebars-default.js`
- **API sidebars**: Auto-generated from OpenAPI specs and imported
- Sidebars support auto-collapsing categories and are hideable

### OpenAPI Integration

Three API documentation sources are configured in `docusaurus.config.js`:
1. **Staking API**: `static/swagger/babylon-staking-api-openapi3.yaml`
2. **Babylon gRPC**: `static/swagger/babylon-grpc-openapi3.yaml`
3. **CometBFT**: `static/swagger/comet-bft-rpc-openapi3.yaml`

Generated docs appear in `docs/api/` directories.

### AI Chat Widget (Babylon AI Assistant)

The site includes an AI-powered chat assistant (`src/components/ChatWidget.tsx`) that helps users find information in the documentation.

**Key Features:**
- Streaming responses for real-time feedback
- Multi-session support (up to 15 concurrent chat sessions)
- Session persistence in localStorage
- Token limit validation with visual feedback
- Expandable/minimizable UI with sidebar for session management
- Markdown rendering with sanitization

**Architecture:**
```
┌─────────────────────────────────────────────────────────────┐
│  ChatWidget.tsx                                              │
│  ├── Health Check: GET {apiBaseUrl}/health                  │
│  │   └── If healthy → Show widget + "Ask AI" navbar button  │
│  │   └── If unhealthy → Hide widget completely              │
│  ├── Token Limits: GET {apiBaseUrl}/api/limits              │
│  └── Chat API: POST {apiBaseUrl}/api/query/stream           │
│       └── Server-Sent Events (SSE) for streaming            │
└─────────────────────────────────────────────────────────────┘
```

**Visibility Control:**
- The "Ask AI" button in the navbar is hidden by default via CSS
- ChatWidget adds `ai-chat-available` class to `<body>` when API health check passes
- CSS rule shows the button only when this class is present:
  ```css
  .header-ai-chat-link { display: none; }
  body.ai-chat-available .header-ai-chat-link { display: flex; }
  ```

**Configuration:**
- `API_BASE_URL` environment variable configures the backend endpoint
- Accessed via `siteConfig.customFields.apiBaseUrl` in the component
- Falls back to `/api` if not set

**Session Management:**
- Sessions stored in localStorage under key `babylon_ai_chat_sessions`
- Each session has: `id`, `thread_uuid`, `title`, `messages[]`, `timestamp`
- Auto-titles based on first user message
- Sessions can be renamed, deleted, or created via the expanded sidebar

**Dependencies:**
- `lucide-react` - Icons
- `react-markdown` - Markdown rendering
- `rehype-sanitize` - HTML sanitization
- `framer-motion` - Animations

### Environment Variables

Required variables (see `.env-example`):
- `ALGOLIA_APP_ID`: Algolia search app ID
- `ALGOLIA_API_KEY_READONLY`: Algolia read-only API key
- `TRACKING_ID`: Google Analytics tracking ID (optional)
- `BRANCH_NAME`: Determines which Algolia index to use (main vs dev)
- `API_BASE_URL`: Backend API URL for AI chat widget (optional, defaults to `/api`)

### Webpack Configuration

- Uses SWC loader instead of Babel for faster builds
- Custom polyfills for Node.js modules (path, buffer, stream, url) for browser compatibility

## Git Workflow and Branching Strategy

This project uses **GitFlow with staging** (different from most Babylon repos which use trunk-based flow).

### Branch Structure

- **`main`** - Production branch (deploys to https://docs.babylonlabs.io)
- **`dev`** - Development/testing branch (deploys to https://docs-dev.babylonlabs.io)

### Normal Development Flow

1. Create feature branch from `dev` with format: `your-name/description`
2. Make changes and test locally with `npm run dev`
3. **Run `npm run build`** to check for broken links - this is critical
4. Submit PR to `dev` branch with clear title and description
5. Test thoroughly on dev environment (https://docs-dev.babylonlabs.io)
6. When ready for production, merge `dev` → `main`
7. Deployment will fail if broken links exist

### Emergency Deployment Flow

For urgent production fixes:
1. Create feature branch from `main` directly
2. Submit PR to `main`
3. After merge, sync changes back: merge `main` → `dev` to keep environments aligned

## Content Guidelines

- Documentation uses MDX format (Markdown + JSX)
- Supports Mermaid diagrams (enabled in config)
- Supports live code blocks via `@docusaurus/theme-live-codeblock`
- Code syntax highlighting for: JavaScript, TypeScript, Rust, Swift, Objective-C, JSON, Bash

## CI/CD and Deployment Architecture

### Deployment Pipeline

The deployment system uses a separate GitHub Actions repository and AWS S3 for hosting:

```
┌─────────────────┐
│  This Repo      │
│  (babylonlabs.  │
│   github.io)    │
└────────┬────────┘
         │ Push to branch
         ▼
┌─────────────────────────────────────┐
│  GitHub Actions (separate repo)     │
│  babylonlabs.github.io-actions      │
├─────────────────────────────────────┤
│  • Triggers on push to main/dev     │
│  • Runs npm run build               │
│  • Uploads artifacts to S3          │
└────────┬───────────────────┬────────┘
         │                   │
         │ dev branch        │ main branch
         ▼                   ▼
┌──────────────────┐  ┌──────────────────┐
│  S3 Bucket       │  │  S3 Bucket       │
│  babylon-dev-    │  │  babylon-prod-   │
│  docs-website    │  │  docs-website    │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         ▼                     ▼
   docs-dev.           docs.babylonlabs.io
   babylonlabs.io      (via CloudFlare DNS)
```

### S3 Buckets

**Build Artifacts Storage**:
- `devnet-build-artifacts` - Dev build artifacts
- `mainnet-build-artifacts` - Production build artifacts

**Website Hosting**:
- `babylon-dev-docs-website` - Dev site (https://docs-dev.babylonlabs.io)
- `babylon-prod-docs-website` - Production site (https://docs.babylonlabs.io)

### Deployment Repositories

- **Source Code**: `babylonlabs-io/babylonlabs.github.io` (this repo)
- **CI/CD Workflows**: `babylonlabs-io/babylonlabs.github.io-actions` (restricted access)

### DNS Configuration

DNS records managed via CloudFlare and Terraform:
- Located in: `mainnet-k8s/terraform/docs-website`
- Production domain: `docs.babylonlabs.io`
- Dev domain: `docs-dev.babylonlabs.io`

### Manual Deployment Procedure (Production Transition)

When transitioning to a new production release:

1. Ensure release version is ready on `main` branch
2. Verify GitHub Actions has built artifacts and pushed to S3
3. Trigger deployment: https://github.com/babylonlabs-io/babylonlabs.github.io-actions/actions/workflows/deploy-main.yml
4. Verify content exists in target S3 bucket (`babylon-prod-docs-website`)
5. Run Terraform to import DNS record (in `mainnet-k8s/terraform/docs-website`):
   ```bash
   terraform import <resource> docs.babylonlabs.io
   ```
6. Run Terraform apply to update DNS record:
   ```bash
   terraform apply
   ```
7. Verify new website is live at https://docs.babylonlabs.io

### Key Points

- Build errors or broken links will prevent deployment
- Dev environment auto-deploys when PRs merge to `dev`
- Production deploys when changes merge to `main`
- DNS changes require Terraform operations

## Documentation Structure Overview

The site is organized into distinct sections for different audiences:

### Main Navigation Sections

- **Overview** (`/guides/overview/`) - Protocol introduction and core concepts
  - Babylon Genesis architecture, networks (mainnet/testnet), governance, specifications
  - BTC staking program details, vigilante services

- **Stakers** (`/stakers/`) - User guides for all staking options
  - BTC Stakers: Native staking, liquid staking (LSTs), staking campaigns
  - BABY Stakers: BABY token staking guides

- **Developers** (`/developers/`) - Technical integration guides
  - Bitcoin Staking: Wallet integration, backend setup, network configs
  - Babylon Genesis Chain: dApp development, wallet setup, explorers

- **Operators** (`/operators/`) - Node operation documentation
  - Babylon Node: Installation, CLI reference
  - Validators: Setup and operation guides
  - Finality Providers: FP setup and management
  - Covenant Emulator, Vigilantes, Staker CLI

- **API** (`/api/`) - Auto-generated API reference
  - Staking API, Babylon gRPC, CometBFT RPC

### Supporting Sections

- **Research** - Bitcoin staking and timestamping research papers
- **Security** - Audit reports and bug bounty program
- **Support** - Discord community links and FAQ

## Project Team

- **Project Lead**: Jenks Guo
- **Developers**: Kevin Liu, Daria Agadzhanova
- **Content Writers**: Jenks Guo, Daria Agadzhanova
- **Designer**: Lex
- **Stakeholders**: Xinshu Dong, Vitalis Salis, Fisher Yu

## Important Notes

- **Broken Links**: The build process throws errors on broken links. Always run `npm run build` locally before pushing.
- **Node Version**: Requires Node.js >= 18.0
- **Remote Docs**: Changes to `<RemoteMD>` components require a full rebuild to refetch content
- **Trailing Slashes**: Site uses trailing slashes (`trailingSlash: true`)
- **Base Path**: Docs are served from root path (`routeBasePath: '/'`)
- **Different Workflow**: This repo uses GitFlow (main/dev branches), unlike most Babylon repos which use trunk-based flow
