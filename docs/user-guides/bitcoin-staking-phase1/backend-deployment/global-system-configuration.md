---
id: global-params
sidebar_label: Global System Configuration
hide_table_of_contents: false
---
# Global System Configuration

## 1. Staking Parameters

The Global Configuration includes versioned governance parameters
that specify what constitutes a valid staking transaction
that should be considered as an active one for the lock-only system.

Detailed information can be found
[here](https://github.com/babylonlabs-io/networks/blob/60fa3a395a22c23b2a1f06ca9ea680535cce54eb/bbn-1/parameters).

Each lock-only network maintains its own set of versioned global parameters:

- [Mainnet](https://github.com/babylonlabs-io/networks/blob/60fa3a395a22c23b2a1f06ca9ea680535cce54eb/bbn-1/parameters/global-params.json)

## 2. Finality Providers

Finality providers can accept delegations from BTC stakers.
For more details, please visit
[this link](https://github.com/babylonlabs-io/networks/tree/8cdcbf78bbc95ae7136c7998ae5ff55b88031cf9/bbn-1/finality-providers).

The Finality provider information registry stores additional information
such as the finality provider's moniker, website, and identity.

There are many registries that might exist, and it is up to the staking provider
to utilize a source of information that best fits their requirements.
This document uses the registry information maintained by Babylon.

### 2.1 Accessing Individual Finality Provider Information

Finality provider information is available in individual JSON files within the
finality provider registry. You can find these files in the following directory,
depending on the network:

- [Mainnet](https://github.com/babylonlabs-io/networks/tree/8cdcbf78bbc95ae7136c7998ae5ff55b88031cf9/bbn-1/finality-providers/registry)

Each JSON file contains information in the following format:

```JSON
{
  "description": {
    "moniker": "<moniker>",
    "identity": "<identity>",
    "website": "<website>",
    "security_contact": "<security_contact>",
    "details": "<details>"
  },
  "btc_pk": "<eots_btc_pk>",
  "commission": "<commission_decimal>",
  "deposit": {
    "tx_hash": "tx_hash",
    "signed_tx": "signed_tx_hex"
  }
}
```

### 2.2 Generating Concatenated Finality Provider Information

The concatenated Finality Provider information file is essential for backend
services that require a unified view of all finality provider information.

To generate a concatenated JSON file from the individual JSON files,
use the following reference script.
Depending on the network, you can change the corresponding directory `DIR`:

- testnet: `export DIR="./networks/bbn-1/finality-providers/registry"`

```bash
echo '
# Clone the repository
git clone git@github.com:babylonlabs-io/networks.git

# Output files
OUTPUT="temp.json"
FINAL="finality-providers.json"

# Start the JSON object and array
echo "{" > $OUTPUT
echo "\"finality_providers\": [" >> $OUTPUT

# Iterate over JSON files and append them to the output file
for file in "$DIR"/*.json; do
    cat "$file" >> $OUTPUT
    echo "," >> $OUTPUT
done

# Remove the last comma and close the JSON array and object
truncate -s-2 $OUTPUT
echo "]" >> $OUTPUT
echo "}" >> $OUTPUT

# Beautify the final JSON output
cat $OUTPUT | jq . > $FINAL
' > generate_finality_providers.sh && bash generate_finality_providers.sh
```

This script clones the Babylon networks repository,
navigates to the specified directory,
iterate over JSON files and
append them to the output file containing all Finality provider information.
