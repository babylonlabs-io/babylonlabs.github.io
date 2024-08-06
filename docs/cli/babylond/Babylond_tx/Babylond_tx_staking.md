---
id: babylond_tx_staking
sidebar_label: babylond tx staking
hide_table_of_contents: true

---

:::info
Please use the wrapped messages in the [epoching](../Babylond_tx//Babylond_tx_epoching.md) and 
[checkpointing](../Babylond_tx/Babylond_tx_checkpointing.md) module to perform
staking-related operations.

In order to keep the validator set unchanged in the middle of epochs, the epoching
module intercepts and rejects staking-related messages that affect validator sets via
AnteHandler, but instead defines wrapped versions of them and forwards their
unwrapped forms to the staking module upon an epoch ends. Read more [here](/docs/developer-guides/modules/epoching.md#delaying-wrapped-messages-to-the-end-of-epochs)
:::

# babylond tx staking

Querying subcommands for staking transactions.

## tx staking commands

```
babylond tx staking [flags]
babylond tx staking [command]
```

## Options

```
-h, --help   help for staking
```

## Options Inherited from Parent Commands

```
      --chain-id string     The network chain ID
      --home string         directory for config and data (default "/home/<yourSystemUsername>/.babylond")
      --log_format string   The logging format (json|plain) (default "plain")
      --log_level string    The logging level (trace|debug|info|warn|error|fatal|panic) (default "info")
      --trace               print out full stack trace on errors
```
