---
id: rabbitmq
sidebar_label: RabbitMQ
hide_table_of_contents: false
---
# RabbitMQ Setup

## 1. Hardware Requirements

:::info Note

For the most accurate and up-to-date hardware recommendations,
please refer to the official [documentation](https://www.rabbitmq.com/docs/production-checklist)

:::

For a production system, we recommend a multi-node RabbitMQ cluster
with quorum queues to ensure message durability and high availability.
This setup enhances fault tolerance and performance for reliable messaging infrastructure.

Hardware Specifications:

- CPU: Multi-core processors.
- Memory: Minimum 4GB RAM per node.
- Storage: SSDs recommended for better performance.
- Network: High-speed, low-latency network connection.

## 2. Install RabbitMQ

According to your operating system, follow the official instructions to install
[RabbitMQ]( https://www.rabbitmq.com/docs/download#installation-guides)

## 3. Add RabbitMQ credentials

### 3.1 Enable RabbitMQ Management Dashboard

```bash
sudo rabbitmq-plugins enable rabbitmq_management
```

### 3.2 Create an admin user for RabbitMQ

:::info Note

The exact credentials will later be used by the services to connect to the queues.

:::

```bash
sudo rabbitmqctl add_user <admin> <password>
sudo rabbitmqctl set_user_tags <admin> <administrator>
sudo rabbitmqctl set_permissions -p / <admin> ".*" ".*" ".*"
```

Replace `<admin>` with your desired username and `<password>` with your desired password.

### 3.3 Access the RabbitMQ Management Dashboard

Open your web browser and navigate to
the `default` RabbitMQ Management Dashboard
: `http://localhost:15672/`

Log in with the username `<admin>` and the password `<password>`
that is set from the above step.

## 4. Monitoring

The RabbitMQ server availability can be polled through
[Prometheus Blackbox Exporter](https://github.com/prometheus/blackbox_exporter).

RabbitMQ-specific Prometheus metrics can also be exposed
by utilizing any open-source Prometheus RabbitMQ exporter
([example](https://github.com/kbudde/rabbitmq_exporter)).
