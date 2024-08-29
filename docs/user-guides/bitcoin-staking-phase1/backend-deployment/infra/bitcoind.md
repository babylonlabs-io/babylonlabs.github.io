---
id: bitcoind
sidebar_label: Bitcoind
hide_table_of_contents: false
---
# Bitcoin Node Setup

## 1. Hardware Requirements

- CPU: Multi-core processor.
- Memory: Minimum 8GB RAM.
- Storage: SSDs with at least 800GB of space to accommodate the full Bitcoin blockchain.

## 2. Bitcoin Core Setup

Download and install the bitcoin binaries according to your operating system
from the official
[Bitcoind Core registry](https://bitcoincore.org/bin/bitcoin-core-26.0/).
All programs in this guide are compatible with version 26.0.

## 3. Configuration

bitcoind is configured through a main configuration file named bitcoin.conf.

Depending on the operating system,
the configuration file should be placed under the corresponding path:

- MacOS: `/Users/<username>/Library/Application Support/Bitcoin`
- Linux: `/home/<username>/.bitcoin`
- Windows: `C:\Users\<username>\AppData\Roaming\Bitcoin`

Both servers can utilize the following base parameter skeleton
(adapted for the BTC signet network):

```text
# Accept command line and JSON-RPC commands
server=1
# Enable transaction indexing
txindex=1
# RPC server settings
rpcuser=<rpc-username>
rpcpassword=<rpc-password>
# Optional: In case of non-mainnet BTC node,
# the following two lines specify the network that your
# node will operate; for this example, utilizing signet
signet=1
[signet]
# Port your bitcoin node will listen for incoming requests;
# below port is the canonical port for signet,
# for mainnet, typically 8332 is used
rpcport=38332
# Address your bitcoin node will listen for incoming requests
rpcbind=0.0.0.0
# Optional: Needed for remote node connectivity
rpcallowip=0.0.0.0/0
```

Notes:

- Instead of hardcoding the RPC server password (`rpcpassword`) in the config,
it is recommended to generate its salted hash and use the rpcauth field instead.
To generate the salted hash, you can use
this [platform](https://jlopp.github.io/bitcoin-core-rpc-auth-generator/)
as reference - however, the salting operation should be executed locally.
The resulting config value will look like this:

```text
rpcauth=<rpc-password-salted-hash>
```

- In case you will be connecting to BTC Mainnet network,
ensure to remove the following config skeleton lines:

```text
signet=1
[signet]
```

## 4. Start bitcoind

### 4.1 Start the Bitcoin daemon

```bash
bitcoind
```

### 4.2 Verify bitcoind is Running

Check the status of bitcoind.

```bash
bitcoin-cli getblockchaininfo
```

You should see information about the blockchain,
indicating that `bitcoind` is running correctly.

## 5. Create a systemd Service for bitcoind (Optional)

### 5.1 Create systemd service definition

Run the following command, replacing `your_username` with your actual username:

```bash
cat <<EOF | sudo tee /etc/systemd/system/bitcoind.service
[Unit]
Description=Bitcoin daemon
After=network.target

[Service]
ExecStart=/usr/local/bin/bitcoind -conf=/home/your_username/.bitcoin/bitcoin.conf
ExecStop=/usr/local/bin/bitcoin-cli stop
User=your_username
Restart=always

[Install]
WantedBy=multi-user.target
EOF
```

### 5.2 Reload systemd manager configuration

```bash
sudo systemctl daemon-reload
```

### 5.3 Enable the service to start on boot

```bash
sudo systemctl enable bitcoind.service
```

### 5.4 Start the service

```bash
sudo systemctl start bitcoind.service
```

## 6. Monitoring

The bitcoind server availability can be polled through
[Prometheus Blackbox Exporter](https://github.com/prometheus/blackbox_exporter).

Bitcoin-specific Prometheus metrics can also be exposed
by utilizing any open-source Prometheus bitcoind exporter
([example](https://github.com/jvstein/bitcoin-prometheus-exporter?tab=readme-ov-file)).
