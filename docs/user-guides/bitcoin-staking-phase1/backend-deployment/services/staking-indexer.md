---
id: staking-indexer
sidebar_label: Staking Indexer
---
# Staking Indexer

The staking indexer is a tool that extracts BTC staking relevant data
from the Bitcoin blockchain, ensures that it follows the pre-requisites
for a valid staking transaction, and determines whether
the stake should be active or not.

All valid staking transactions are transformed into a structured form,
stored in a database, and published as events in a RabbitMQ messaging queue
for consumption by consumers.

The staking indexer is the enforcer of the Bitcoin Staking protocol
and serves as the ground truth for the lock-only Bitcoin Staking system.

## 1. Hardware Requirements

- CPU: Multi-core processor (4 cores minimum)
- Memory: Minimum 4GB RAM, recommended 8GB RAM

## 2. Install Staking Indexer

### 2.1 Clone the repository to your local machine from Github

```bash
git clone https://github.com/babylonlabs-io/staking-indexer.git
```

### 2.2 Check out the desired version

You can find the latest release
[here](https://github.com/babylonlabs-io/staking-indexer/releases).

```bash
cd staking-indexer
git checkout tags/{VERSION}
```

### 2.3 Install the sid daemon binary by running

```bash
make install
```

## 3. Configuration

### 3.1 Generate the default configuration

```bash
sid init
```

This will create a sid.conf file in the default home directory.
The default home directories for different operating systems are:

- MacOS:  `~/Users/<username>/Library/Application Support/Sid`
- Linux: `~/.Sid`
- Windows: `C:\Users\<username>\AppData\Local\Sid`

### 3.2 Update default configurations

- Bitcoin network to run on

Set the `BitcoinNetwork` to match with the information from the
[installed Bitcoin node](../infra/bitcoind.md).

```text
[Application Options]
; Bitcoin network to run on
BitcoinNetwork = signet
```

- Bitcoin node to connect to

Set the Bitcoin node connection address (`RPCHost`)
and credentials (`RPCUser` and `RPCUser`)
to match the information from the
[installed Bitcoin node](../infra/bitcoind.md).

```text
[btcconfig]
; The daemon's rpc listening address.
RPCHost = 127.0.0.1:38332

; Username for RPC connections.
RPCUser = user

; Password for RPC connections.
RPCPass = pass
```

- RabbitMQ cluster to connect to

Set the RabbitMQ connection address (`Url`)
and credentials (`User` and `Password`)
to match the information from the
[installed RabbitMQ cluster](../infra/rabbitmq.md).

```text
[queueconfig]
; the user name of the queue
User = user

; the password of the queue
Password = password

; the url of the queue
Url = localhost:5672
```

- Prometheus metrics configuration:

Set the `Host` and `Port` to customize how the metrics are exposed

```text
[metricsconfig]
; IP of the Prometheus server
Host = 127.0.0.1

; Port of the Prometheus server
Port = 2112
```

## 4. Download global params

To download the global parameters,
follow [this](../global-system-configuration.md#staking-parameters)
instructions.

## 5. Start Staking Indexer

In case you are using the default home directory,
you can start the staking-indexer running:

```bash
sid start
```

Note: If the indexer fails to start due to re-org,
please rerun the command to start it.

## 6. Create systemd service (Optional - Linux Only)

### 6.1 Create systemd service definition

Run the following command, replacing `system_username`
with the appropriate system user or service account name:

```bash
cat <<EOF | sudo tee /etc/systemd/system/sid.service
[Unit]
Description=Sid service
After=network.target

[Service]
Type=simple
ExecStart=$(which sid) start
Restart=on-failure
User=system_username

[Install]
WantedBy=multi-user.target
EOF
```

### 6.2 Reload systemd manager configuration

```bash
sudo systemctl daemon-reload
```

### 6.3 Enable the service to start on boot

```bash
sudo systemctl enable sid.service
```

### 6.4 Start the service

```bash
sudo systemctl start sid.service
```

### 6.5 Verify Staking Indexer is running

Check sid service status:

```bash
sudo systemctl status sid
```

Expected log:

```accesslog
Jul 04 06:49:54 system_username sid[839944]: 2024-07-04T06:49:55.798273Z        info        Starting Prometheus server        {"address": "127.0.0.1:2114"}
Jul 04 06:49:54 system_username sid[839944]: 2024-07-04T06:49:55.805957Z        info        Starting Staking Indexer App        {"module": "staking indexer"}
```

## 7. Monitoring

The service exposes Prometheus metrics through a Prometheus server.
By default, the server is reachable under `127.0.0.1:2112`.
