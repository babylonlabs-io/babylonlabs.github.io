---
id: Babylond_query_ibc_channel_unreceived-acks
sidebar_label: Babylond_query_ibc_channel_unreceived-acks
hide_table_of_contents: true

---

# Babylond Query ibc channel unreceived-acks
Querying all the unreceived acks associated with the given channel.
## query ibc channel unreceived-acks command
```
babylond query ibc channel unreceived-acks [port-id] [channel-id] [flags]
```
### Example Command
```
$ babylond query ibc channel unreceived-acks [port-id] [channel-id] --sequences=1,2,3
```
## Options
```
      --height int             Use a specific height to query state at (this can error if the node is pruning state)
  -h, --help                   help for unreceived-acks
      --node string            <host>:<port> to Tendermint RPC interface for this chain (default "tcp://localhost:26657")
  -o, --output string          Output format (text|json) (default "text")
      --sequences int64Slice   comma separated list of packet sequence numbers (default [])
```
## Options Inherited from Parent Commands
```
      --chain-id string     The network chain ID
      --home string         directory for config and data (default "/home/<yourSystemUsername>/.babylond")
      --log_format string   The logging format (json|plain) (default "plain")
      --log_level string    The logging level (trace|debug|info|warn|error|fatal|panic) (default "info")
      --trace               print out full stack trace on errors
```