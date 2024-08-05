---
id: babylond_tx_checkpointing_submit
sidebar_label: babylond tx checkpointing submit
hide_table_of_contents: true

---

# babylond tx checkpointing submit
Submit a BLS signature.
## tx checkpointing submit command
```
babylond tx checkpointing submit [epoch_number] [last_commit_hash] [bls_sig] [signer address] [flags]
```
## Options
```
      --chain-id string     The network chain ID
      --home string         directory for config and data (default "/home/kakakepan/.babylond")
      --log_format string   The logging format (json|plain) (default "plain")
      --log_level string    The logging level (trace|debug|info|warn|error|fatal|panic) (default "info")
      --trace               print out full stack trace on errors

Use "babylond tx checkpointing [command] --help" for more information about a command.
kakakepan@DESKTOP-58G3HHU:/mnt/c/Users/kakakepan/Documents/Babylond/babylon$ ./build/babylond tx checkpointing create-validator
panic: could not create directory "": mkdir : no such file or directory

goroutine 1 [running]:
github.com/tendermint/tendermint/config.EnsureRoot({0x0, 0x0})
        github.com/tendermint/tendermint@v0.34.24/config/toml.go:35 +0x1f6
github.com/cosmos/cosmos-sdk/server.interceptConfigs(0xc000feb520, {0x2228f87, 0x2ae1}, {0x1ec6660, 0xc0014ed8c0}, 0xc00016cf00)
        github.com/cosmos/cosmos-sdk@v0.46.6/server/util.go:204 +0x354
github.com/cosmos/cosmos-sdk/server.InterceptConfigsPreRunHandler(0x0?, {0x2228f87, 0x2ae1}, {0x1ec6660, 0xc0014ed8c0}, 0x0?)
        github.com/cosmos/cosmos-sdk@v0.46.6/server/util.go:137 +0x305
github.com/babylonlabs-io/babylon/cmd/babylond/cmd.NewRootCmd.func1(0xc000fb0900, {0x1?, 0x2bbbeb0?, 0x1?})
        github.com/babylonlabs-io/babylon/cmd/babylond/cmd/root.go:79 +0x2ae
github.com/tendermint/tendermint/libs/cli.concatCobraCmdFuncs.func1(0xc000fb0900?, {0x3cc75e0, 0x0, 0x0})
        github.com/tendermint/tendermint@v0.34.24/libs/cli/setup.go:118 +0x62
github.com/spf13/cobra.(*Command).execute(0xc000fb0900, {0x3cc75e0, 0x0, 0x0})
        github.com/spf13/cobra@v1.6.0/command.go:891 +0x739
github.com/spf13/cobra.(*Command).ExecuteC(0xc0004e6c00)
        github.com/spf13/cobra@v1.6.0/command.go:1040 +0x3bd
github.com/spf13/cobra.(*Command).Execute(...)
        github.com/spf13/cobra@v1.6.0/command.go:968
github.com/spf13/cobra.(*Command).ExecuteContext(...)
        github.com/spf13/cobra@v1.6.0/command.go:961
github.com/cosmos/cosmos-sdk/server/cmd.Execute(0xdd3c638e3ea023cf?, {0x0, 0x0}, {0xc001133a00, 0x19})
        github.com/cosmos/cosmos-sdk@v0.46.6/server/cmd/execute.go:36 +0x20f
main.main()
        github.com/babylonlabs-io/babylon/cmd/babylond/main.go:18 +0x35
kakakepan@DESKTOP-58G3HHU:/mnt/c/Users/kakakepan/Documents/Babylond/babylon$ ./build/babylond tx checkpointing create-validator -p
Error: unknown shorthand flag: 'p' in -p
Usage:
  babylond tx checkpointing create-validator [flags]

Flags:
  -a, --account-number uint                 The account number of the signing account (offline mode only)
      --amount string                       Amount of coins to bond
      --aux                                 Generate aux signer data instead of sending a tx
  -b, --broadcast-mode string               Transaction broadcasting mode (sync|async|block) (default "sync")
      --commission-max-change-rate string   The maximum commission change rate percentage (per day)
      --commission-max-rate string          The maximum commission rate percentage
      --commission-rate string              The initial commission rate percentage
      --details string                      The validator's (optional) details
      --dry-run                             ignore the --gas flag and perform a simulation of a transaction, but don't broadcast it (when enabled, the local Keybase is not accessible)
      --fee-granter string                  Fee granter grants fees for the transaction
      --fee-payer string                    Fee payer pays fees for the transaction instead of deducting from the signer
      --fees string                         Fees to pay along with transaction; eg: 10uatom
      --from string                         Name or address of private key with which to sign
      --gas string                          gas limit to set per-transaction; set to "auto" to calculate sufficient gas automatically. Note: "auto" option doesn't always report accurate results. Set a valid coin value to adjust the result. Can be used instead of "fees". (default 200000)
      --gas-adjustment float                adjustment factor to be multiplied against the estimate returned by the tx simulation; if the gas limit is set manually this flag is ignored  (default 1)
      --gas-prices string                   Gas prices in decimal format to determine the transaction fee (e.g. 0.1uatom)
      --generate-only                       Build an unsigned transaction and write it to STDOUT (when enabled, the local Keybase only accessed when providing a key name)
  -h, --help                                help for create-validator
      --home string                         The node home directory
      --identity string                     The optional identity signature (ex. UPort or Keybase)
      --ip string                           The node's public IP. It takes effect only when used in combination with --generate-only
      --keyring-backend string              Select keyring's backend (os|file|kwallet|pass|test|memory) (default "os")
      --keyring-dir string                  The client Keyring directory; if omitted, the default 'home' directory will be used
      --ledger                              Use a connected Ledger device
      --min-self-delegation string          The minimum self delegation required on the validator
      --moniker string                      The validator's name
      --node string                         <host>:<port> to tendermint rpc interface for this chain (default "tcp://localhost:26657")
      --node-id string                      The node's ID
      --note string                         Note to add a description to the transaction (previously --memo)
      --offline                             Offline mode (does not allow any online functionality)
  -o, --output string                       Output format (text|json) (default "json")
      --pubkey string                       The validator's Protobuf JSON encoded public key
      --security-contact string             The validator's (optional) security contact email
  -s, --sequence uint                       The sequence number of the signing account (offline mode only)
      --sign-mode string                    Choose sign mode (direct|amino-json|direct-aux), this is an advanced feature
      --timeout-height uint                 Set a block timeout height to prevent the tx from being committed past a certain height
      --tip string                          Tip is the amount that is going to be transferred to the fee payer on the target chain. This flag is only valid when used with --aux, and is ignored if the target chain didn't enable the TipDecorator
      --website string                      The validator's (optional) website
  -y, --yes                                 Skip tx broadcasting prompt confirmation

Global Flags:
      --chain-id string     The network chain ID
      --log_format string   The logging format (json|plain) (default "plain")
      --log_level string    The logging level (trace|debug|info|warn|error|fatal|panic) (default "info")
      --trace               print out full stack trace on errors

kakakepan@DESKTOP-58G3HHU:/mnt/c/Users/kakakepan/Documents/Babylond/babylon$ ./build/babylond tx checkpointing submit -y
Error: accepts 4 arg(s), received 0
Usage:
  babylond tx checkpointing submit [epoch_number] [last_commit_hash] [bls_sig] [signer address] [flags]

Flags:
  -a, --account-number uint      The account number of the signing account (offline mode only)
      --aux                      Generate aux signer data instead of sending a tx
  -b, --broadcast-mode string    Transaction broadcasting mode (sync|async|block) (default "sync")
      --dry-run                  ignore the --gas flag and perform a simulation of a transaction, but don't broadcast it (when enabled, the local Keybase is not accessible)
      --fee-granter string       Fee granter grants fees for the transaction
      --fee-payer string         Fee payer pays fees for the transaction instead of deducting from the signer
      --fees string              Fees to pay along with transaction; eg: 10uatom
      --from string              Name or address of private key with which to sign
      --gas string               gas limit to set per-transaction; set to "auto" to calculate sufficient gas automatically. Note: "auto" option doesn't always report accurate results. Set a valid coin value to adjust the result. Can be used instead of "fees". (default 200000)
      --gas-adjustment float     adjustment factor to be multiplied against the estimate returned by the tx simulation; if the gas limit is set manually this flag is ignored  (default 1)
      --gas-prices string        Gas prices in decimal format to determine the transaction fee (e.g. 0.1uatom)
      --generate-only            Build an unsigned transaction and write it to STDOUT (when enabled, the local Keybase only accessed when providing a key name)
  -h, --help                     help for submit
      --keyring-backend string   Select keyring's backend (os|file|kwallet|pass|test|memory) (default "os")
      --keyring-dir string       The client Keyring directory; if omitted, the default 'home' directory will be used
      --ledger                   Use a connected Ledger device
      --node string              <host>:<port> to tendermint rpc interface for this chain (default "tcp://localhost:26657")
      --note string              Note to add a description to the transaction (previously --memo)
      --offline                  Offline mode (does not allow any online functionality)
  -o, --output string            Output format (text|json) (default "json")
  -s, --sequence uint            The sequence number of the signing account (offline mode only)
      --sign-mode string         Choose sign mode (direct|amino-json|direct-aux), this is an advanced feature
      --timeout-height uint      Set a block timeout height to prevent the tx from being committed past a certain height
      --tip string               Tip is the amount that is going to be transferred to the fee payer on the target chain. This flag is only valid when used with --aux, and is ignored if the target chain didn't enable the TipDecorator
  -y, --yes                      Skip tx broadcasting prompt confirmation
```
## Options Inherited from Parent Commands
```
      --chain-id string     The network chain ID
      --home string         directory for config and data (default "/home/<yourSystemUsername>/.babylond")
      --log_format string   The logging format (json|plain) (default "plain")
      --log_level string    The logging level (trace|debug|info|warn|error|fatal|panic) (default "info")
      --trace               print out full stack trace on errors
```