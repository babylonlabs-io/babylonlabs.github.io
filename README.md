# Babylon Labs Documentation

This repository contains the official documentation for Babylon Labs, built using [Docusaurus](https://docusaurus.io/).

## Overview

Our documentation provides comprehensive guides, API references, and technical specifications for all Babylon Labs products and protocols. The documentation is open-source, and we welcome contributions from the community.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v16.14 or higher)
- [npm](https://www.npmjs.com/) (v7 or higher)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/babylonlabs-io/babylonlabs.github.io.git
cd babylonlabs.github.io
```

2. Install dependencies:

```bash
npm install
```


### Local Development

To start the development server:

```bash
npm run dev
```

This will start the development server and open your default browser to `http://localhost:3000`.

### Building the Documentation

To build the documentation for production:

```bash
npm run build
```

This will check for broken links and generate the static HTML files in the `build` directory.

If there is any warning of broken links, please fix them, or it will block deployments. 

## Project Structure

```bash
docs/
├── guides/
│   ├── overview/
│   │   ├── bitcoin_staking.md
│   │   ├── bitcoin_secured_networks.md
│   │   ├── babylon_genesis.md
│   │   └── ...
│   └── networks/
│       ├── phase-1/
│       │   └── ...
│       ├── phase-2/
│       │   └── ...
│       └── phase-3/
│           └── ...
├── developers/
│   ├── babylon_chain/
│   │   └── ...
│   ├── wallet_integration/
│   │   └── ...
│   ├── dapps/
│   │   └── ...
│   ├── bsns/
│   │   └── ...
│   └── faqs.md
├── operators/
│   ├── babylon_node/
│   │   └── ...
│   ├── key_management.md
│   ├── monitoring.md
│   └── operators.md
└── api/
    └── babylon-gRPC/
        └── ...
```

# Contributing

We welcome contributions from the community! Here's how you can help:

### Contributing Guidelines

1. **Fork the Repository**
   - Create a fork of this repository
   - Clone your fork locally

2. **Create a Branch**
   - Create a new branch for your changes
   - Use descriptive branch names (e.g., `my-name/add-staking-guide`)

3. **Make Your Changes**
   - Keep changes focused and atomic
   - Test locally
   - Use `npm run build` to check if there is any broken links (or it will stop deployment pipeline)

4. **Submit a Pull Request**
   - Ensure your PR has a clear title and description
   - Link any relevant issues
   - Update documentation as needed

### Style Guide

- Use clear, concise language
- Follow Markdown best practices
- Include code examples where appropriate
- Add screenshots for complex UI explanations

## Acknowledgments

Thanks to @kkkk666 our Developer Advocate who helped make this documentation happen!
