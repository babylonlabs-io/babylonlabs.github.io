---
id: czintegrate
sidebar_label: BTC timestamping integration
hide_table_of_contents: true
---

# BTC timestamping integration

Learn how to integrate a Cosmos Zone with the Babylon BTC timestamping protocol.

---

At the moment, Babylon provides a canonical chain oracle for each integrated Cosmos zone,
and allows anyone to query the canonical chains of integrated Cosmos zones and
query the fork headers created by a validator set with dishonest majority.
In the future, integrating Babylon will allows Cosmos zones to raise alarms upon
dishonest majority attacks, and reduce the unbonding time.

In order to integrate a Cosmos zone to Babylon,
the first option would be sending an email to [the Babylon team](mailto:admin@babylonlabs.io),
then the Babylon team will deploy a relayer for your blockchain.
Alternatively, anyone can integrate any Cosmos zone to Babylon
by running an IBC relayer specialized for Babylon.
The special IBC relayer uses a subset of the IBC protocol,
and there is no need to modify the integrated Cosmos zone's code,
or have tokens in the integrated Cosmos zone.

## Babylon IBC relayer

In order to provide a canonical chain oracle for Cosmos zones,
Babylon only needs to use a subset of IBC protocols.
Specifically, Babylon needs to maintain an IBC light client for the integrated Cosmos zone,
but not the other way.
However, existing relayers, including the [Go relayer](https://github.com/cosmos/relayer)
and the Rust Hermes relayer, are designed for the full IBC protocol stack with an emphasis on
IBC packets, thus only provide functionalities for updating both IBC clients in two Cosmos zones and
relaying IBC packets among them.

To this end, the Babylon team has developed a special IBC relayer
based on [the official IBC relayer in Golang](https://github.com/cosmos/relayer).
The special IBC relayer allows one to maintain an IBC light client of a Cosmos zone in Babylon,
and periodically forward headers of the Cosmos zone to Babylon.
It gives us the following advantages:

- Integrating a Cosmos zone to Babylon only needs Babylon accounts and tokens. 
  Accounts and tokens of integrated Cosmos zones are not needed.
- Integrating a Cosmos zone to Babylon incurs zero computational
  or storage overhead on integrated Cosmos zones.

## Running a Babylon IBC relayer

Running a Babylon IBC relayer consists of the following steps:

1. Install the Babylon Relayer
2. Configure the Babylon Relayer
3. Create a keyring for the Babylon relayer
4. Obtain Babylon tokens
5. Start the Babylon Relayer

### Install the Babylon Relayer

The Babylon relayer is located at [GitHub](https://github.com/babylonlabs-io/babylon-relayer).
Please follow the documentation for installing it.
In summary, after cloning the repository,
navigate to the folder in which you cloned it,
checkout to the version you want to install (e.g. `git checkout v0.3.0`),
and execute,

```bash
$ make install
```

This will install the `babylon-relayer` binary. You can verify that everything worked properly by running,
```bash
$ babylon-relayer --help
babylon-relayer has:
        1. Configuration management for Chains and Paths
        2. Key management for managing multiple keys for multiple chains
        3. Query and transaction functionality for IBC
        4. Functionality for relaying headers from Cosmos Zones to Babylon periodically

        NOTE: Most of the commands have aliases that make typing them much quicker
                  (i.e. 'babylon-relayer tx', 'babylon-relayer q', etc...)

Usage:
  babylon-relayer [command]
 
...output truncated
```

### Configure the Babylon Relayer

The default Babylon relayer home directory is `~/.relayer`.
You can specify a different Babylon relayer home directory through the `--home` CLI flag.
For the purposes of this document and for simplicity,
we will assume that the home directory is `~/.relayer`.

The configuration file for the relayer is located under the `$RELAYER_HOME/config/config.yaml`.
In our case, `$RELAYER_HOME` is `~/.relayer`.
An example config file for integrating Osmosis testnet is as follows:
```yaml
global:
    api-listen-addr: :5183
    timeout: 20s
    memo: ""
    light-cache-size: 10
chains:
    # Name for the Babylon chain
    babylon:
        type: cosmos
        value:
            # REPLACEME: Name of the key in the keyring that will be used to send transactions to Babylon.
            #            We will create this key on the next step.
            key: babylon-relayer-key
            # REPLACEME: The Chain ID of the Babylon network you want to connect to.
            #            For example, for the current testnet, this is `bbn-test-2`
            #            Note that this chain ID should be the same one you used for creating the keyring.
            chain-id: bbn-test-3
            # REPLACEME: The RPC endpoint of a node that runs on the Babylon network you want to connect to.
            rpc-addr: https://rpc.testnet3.babylonlabs.io:443
            account-prefix: bbn
            # The backend of the keyring you're using. Recall that this should always be `test`.
            keyring-backend: test
            # Gas prices and gas adjustment.
            gas-adjustment: 1.5
            gas-prices: 0.002ubbn
            min-gas-amount: 0
            debug: true
            timeout: 10s
            output-format: json
            sign-mode: direct
            extra-codecs: []
    # Name for the chain to be integrated
    osmosis:
        type: cosmos
        value:
            # REPLACEME: The chain ID of the chain you want to integrate with Babylon
            chain-id: osmo-test-4
            # REPLACEME: The RPC endpoint of a node that runs on the network of the chain you want to integrate with Babylon.
            rpc-addr: https://osmosis-testnet-rpc.allthatnode.com:26657/
            keyring-backend: test
            timeout: 10s
paths:
    # Name of the relayer path
    osmosis:
        # Chain IDs that this path will connect
        # REPLACEME: Use the chain IDs For Babylon and the integrated chain you specified above.
        src:
            chain-id: bbn-test-3
        dst:
            chain-id: osmo-test-4
```

### Create a key for the Babylon relayer

After specifying the configuration,
we need to create a keyring that will pay the transaction fees for sending
transactions to the Babylon chain.

We have two options:
1. Create a keyring from scratch
```bash
$ babylon-relayer keys add $BABYLON_NAME $BABYLON_KEY_NAME
```
2. Import an already existing keyring. For this you're going to need the mnemonic
```bash
$ babylon-relayer keys restore $BABYLON_NAME $BABYLON_KEY_NAME "$MNEMONIC"
```

In the above commands,
- `$BABYLON_NAME` is the name assigned to the Babylon chain in the configuration file.
  In the example configuration above this is `babylon`.
- `$BABYLON_KEY_NAME` is the name assigned to the key for Babylon in the configuration file.
  In the example configuration above this is `babylon-relayer-key`
- `$MNEMONIC` is the mnemonic for the key you want to import.

To verify that your key has been included, you can execute:
```bash
$ babylon-relayer keys list $BABYLON_NAME
```
If all worked as expected, you should see the key address in the output.

### Obtain Babylon Tokens

Now it's time to obtain the tokens that will be used to pay for Babylon transaction fees
for relaying headers.
Those funds should go to the address of the key you created on the previous step.
You can obtain funds through the faucet found in the Babylon Discord.

### Start the Babylon Relayer

To start the Babylon relayer,

```bash
$ babylon-relayer keep-update-clients --interval $INTERVAL
```

where `$INTERVAL` is the interval for relaying a header (e.g., `10m` to denote 10 minutes per header).

### Check if the Integration is Successful

After the above steps, the Cosmos zone has been integrated to Babylon.
You can do the following things to check the status of the integration:
- Check the Babylon node API
  `http://lcd.testnet3.babylonlabs.io/babylon/zoneconcierge/v1/chain_info/<your_chain_id>`
  that shows the information of the Cosmos zone in the Babylon blockchain's view.
- Check whether [BabylonScan](https://babylonscan.io) shows
  the information of the Cosmos zone or not.
  - NOTE: one needs to submit a PR to a chain registry in order to be shown on BabylonScan

## Future Integration Phases

In the future, Babylon will enable further integration phases,
such as raising alarms upon dishonest majority attacks and
reducing the unbonding time period.
Such integrations will need IBC packets,
thus require using the original IBC relayer
rather than the above specialized one.
Please see [Zone Concierge](/docs/developer-guides/modules/zoneconcierge.md) for more details.
