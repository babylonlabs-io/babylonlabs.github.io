---
id: staking-expiry-checker
sidebar_label: Staking Expiry Checker
---
# Staking Expiry Checker

## 1. Hardware Requirements

- CPU: Multi-core processor (4 cores minimum)
- Memory: Minimum 4GB RAM, recommended 8GB RAM

## 2. Install Staking Expiry Checker

### 2.1 Clone the repository to your local machine from Github

```bash
git clone https://github.com/babylonlabs-io/staking-expiry-checker.git
```

### 2.2 Check out the desired version

You can find the latest release
[here](https://github.com/babylonlabs-io/staking-expiry-checker/releases).

```bash
cd staking-expiry-checker
git checkout tags/{VERSION}
```

### 2.3 Install the binary by running

```bash
make install
```

## 3. Configuration

### 3.1 Create home directory

```bash
mkdir -p ~/.staking-expiry-checker/
```

### 3.2 Copy the default configuration

```bash
cp ~/staking-expiry-checker/config/config-local.yml ~/.staking-expiry-checker/config.yml
```

### 3.3 Update default configurations

- MongoDB cluster to connect to

Set the MongoDB connection address (`address`)
and credentials (`username`, `password`, and `db-name`) to match
the information from the
[installed MongoDB cluster](../infra/mongodb.md).

```yml
db:
  username: "<admin>"
  password: "<password>"
  address: "mongodb://localhost:27017/?directConnection=true"
  db-name: "<db-name>"
```

- Bitcoin node to connect to

Set the Bitcoin node connection address (`url`)
and credentials (`rpc-user` and `rpc-pass`)
to match the information from the
[installed Bitcoin node](../infra/bitcoind.md).

```yml
btc:
  endpoint: localhost:18332
  disable-tls: false
  net-params: testnet
  rpc-user: rpcuser
  rpc-pass: rpcpass
```

- RabbitMQ cluster to connect to

Set the RabbitMQ connection address (`url`)
and credentials (`queue_user` and `queue_password`)
to match the information from the
[installed RabbitMQ cluster](../infra/rabbitmq.md).

```yml
queue:
  queue_user: admin
  queue_password: password
  url: "localhost:5672"
```

- Prometheus metrics configuration:

Set the `host` and `port` to customize how the metrics are exposed

```yml
metrics:
  host: 0.0.0.0
  port: 2112
```

## 4. Start Staking Expiry Checker

You can start the staking-expiry-checker by running:

```bash
staking-expiry-checker --config ~/.staking-expiry-checker/config.yml
```

## 5. Create systemd service (Optional - Linux Only)

### 5.1 Create systemd service definition

Run the following command, replacing `system_username`
with the appropriate system user or service account name:

```bash
cat <<EOF | sudo tee /etc/systemd/system/staking-expiry-checker.service
[Unit]
Description=Staking Expiry Checker service
After=network.target

[Service]
Type=simple
ExecStart=$(which staking-expiry-checker) --config /home/system_username/.staking-expiry-checker/config.yml
Restart=on-failure
User=system_username

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
sudo systemctl enable staking-expiry-checker.service
```

### 5.4 Start the service

```bash
sudo systemctl start staking-expiry-checker.service
```

## 6. Monitoring

The service exposes Prometheus metrics through a Prometheus server.
By default, the server is reachable under `127.0.0.1:2112`.
