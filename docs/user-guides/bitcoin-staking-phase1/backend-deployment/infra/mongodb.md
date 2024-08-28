---
id: mongodb
sidebar_label: MongoDB
hide_table_of_contents: false
---
# Mongodb Setup

## 1. Hardware Requirements

:::info Note

For the most accurate and up-to-date hardware recommendations,
please refer to the official
[documentation](https://www.mongodb.com/docs/cloud-manager/tutorial/provisioning-prep/#deployment-prerequisites)

:::

The system requires a MongoDB replica set cluster
for data redundancy and high availability.

For production deployments, we strongly recommend a multi-node cluster
to ensure optimal performance and reliability.

Hardware Specifications:

- CPU: Multi-core processors.
- Memory: Minimum 4GB RAM per node.
- Storage: SSDs recommended for better performance.

The MongoDB Agent must be installed only on 64-bit architectures.

## 2. Install MongoDB

According to your operating system, follow the official instructions to install
[MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/)

## 3. Configure MongoDB Replica Set

### 3.1 Edit MongoDB configuration file

```bash
sudo vi /etc/mongod.conf
```

### 3.2 Add the replica set configuration

Find the `replication` section and add the following:

```bash
replication:
   replSetName: "rs0"
```

This process instructs MongoDB to start up
as part of the specified replica set (`rs0` in this case).

### 3.3 Restart MongoDB to apply changes

```bash
sudo systemctl restart mongod
```

### 3.4 Initialize the replica set

Start the MongoDB shell and connect to the installed MongoDB instance
running on `localhost` at port `27017`

If your MongoDB server is running on a different host or port,
you can specify them using the --host and --port options respectively.

```bash
mongosh --host localhost --port 27017
```

Inside the MongoDB shell, run:

```bash
rs.initiate()
```

### 3.5 Verify the replica set configuration

```bash
rs.status()
```

The output of `rs.status()` will include information like:

- `Set Name` (set): The name of the replica set.
- `Members` (members): List of replica set members (members array)
with details such as `hostname`, `state` (stateStr), `health` (health),
`uptime` (uptime), and `last heartbeat message` (lastHeartbeatMessage).

Here’s a simplified example of how the output look like:

```json
  set: 'rs0',
  members: [
    {
      _id: 0,
      name: '127.0.0.1:27017',
      health: 1,
      state: 1,
      stateStr: 'PRIMARY',
      uptime: 1202009,
      optime: { ts: Timestamp({ t: 1721191458, i: 1 }), t: Long('1') },
      optimeDate: ISODate('2024-07-17T04:44:18.000Z'),
      lastAppliedWallTime: ISODate('2024-07-17T04:44:18.441Z'),
      lastDurableWallTime: ISODate('2024-07-17T04:44:18.441Z'),
      syncSourceHost: '',
      syncSourceId: -1,
      infoMessage: '',
      electionTime: Timestamp({ t: 1719989484, i: 2 }),
      electionDate: ISODate('2024-07-03T06:51:24.000Z'),
      configVersion: 1,
      configTerm: 1,
      self: true,
      lastHeartbeatMessage: ''
    }
  ]
```

## 4. Create MongoDB credentials

:::info Note

The exact credentials will later be used by the services to connect to the queues.

:::

Start the MongoDB shell and connect to the installed MongoDB instance
running on `localhost` at port `27017`

If your MongoDB server is running on a different host or port,
you can specify them using the --host and --port options respectively.

```bash
mongosh --host localhost --port 27017
```

Inside the MongoDB shell, run the following commands to create a new user::

```text
use admin
db.createUser({
  user: "<username>",
  pwd: "<password>",
  roles: [ { role: "readWrite", db: "<database>" } ]
})
```

Replace `<username>`, `<password>`, and `<database>`
with your desired username, password, and database name respectively.

## 5. Monitoring

The MongoDB server availability can be polled through
[Prometheus Blackbox Exporter](https://github.com/prometheus/blackbox_exporter).

MongoDB-specific Prometheus metrics can also be exposed
by utilizing any open-source Prometheus MongoDB exporter
([example](https://github.com/percona/mongodb_exporter)).
