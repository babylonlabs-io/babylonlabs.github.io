---
id: zoneconcierge
sidebar_label: Zone Concierge Module
hide_table_of_contents: true
---

# Zone Concierge Module

Learn what the Babylon Zone Concierge Module is and how it operates.

---

## Summary

The zone concierge module is responsible for providing BTC timestamps to headers from other Cosmos zones.
These BTC timestamps allow Cosmos zones integrating with Babylon to achieve Bitcoin security, i.e., forking a Cosmos zone is as hard as forking Bitcoin.
To receive Cosmos zones' headers, the zone concierge module leverages the light clients in the IBC protocol.
Specifically, on top of the original [IBC-Go](https://github.com/cosmos/ibc-go) implementation, Babylon adds a hook that forwards headers with a valid quorum certificate to the zone concierge module.
Upon a header from IBC, zone concierge then stores the header's metadata in the KV store.
When the epoch that stores this header's metadata is finalized by Bitcoin, the header is consequently finalized by Bitcoin as well.

## Problem Statement

Babylon aims at providing Bitcoin security to other Cosmos zones.
To this end, Babylon needs to checkpoint itself to Bitcoin, and checkpoint other Cosmos zones to itself.
The {"epoching, checkpointing, BTCCheckpoint, BTCLightclient"} modules jointly provide the functionality of checkpointing Babylon to Bitcoin.
The zone concierge module and the IBC modules jointly provide the functionality of checkpointing Cosmos zones to Babylon.

In order to checkpoint Cosmos zones to Babylon, Babylon needs to receive, verify headers of Cosmos zones.
Babylon will need to will checkpoint two types of headers: canonical headers and fork headers that have a quorum certificate, i.e., a set of signatures from validators with > 2/3 voting power.
Checkpointing canonical headers allows Babylon to act as a canonical chain oracle.
Checkpointing fork headers allows Babylon to identify dishonest majority attacks and slash equivocating validators.
Zone concierge will not checkpoint any header that does not have a quorum certificate.

Specifically, the zone concierge module aims at providing the following guarantees

- **Timestamping headers:** Babylon timestamps all Cosmos zones' headers with a valid quorum certificate from the IBC relayer, regardless whether they are on CZ canonical chains or not.
- **Verifiability of timestamps:** For any CZ header, Babylon can provide a proof that the CZ header is checkpointed by {"Babylon, BTC"}, where the proof is verifiable assuming access to Babylon/BTC light clients.

under the following assumptions:

- BTC is always secure with the k-deep confirmation rule
- Babylon might have dishonest majority
- Cosmos zones might have dishonest majority
- There exists >=1 honest IBC relayer and >=1 vigilante {"submitter, reporter"}
- The network is synchronous (i.e., messages are delivered within a known time bound)



## Design
Babylon implements the zone concierge module in order to checkpoint headers of Cosmos zones.
Specifically, the zone concierge module

- leverages IBC light clients for receiving and verifying headers from Cosmos zones
- intercepts and indexes headers from Cosmos zones
- provides proofs that a header is finalized by Bitcoin



### IBC Light Client for Checkpointing Cosmos Zones

Babylon leverages the IBC protocol to receive and verify headers of Cosmos zones.
In a pair of Cosmos zones with an IBC channel, each Cosmos zone maintains the counterparty zone's light client, exchanges IBC packets from each other, and verifies inclusions of IBC packets with assistance of the light client.

The light client allows a Cosmos zone to maintain a subset of headers from the counterparty zone in an IBC connection, such that the light client ensures
- **Safety:** The IBC light client is consistent with the counterparty zone's blockchain
- **Liveness:** The IBC light client keeps growing
when the counterparty zone has > 2/3 honest voting power and there exists > 1 honest relayer.

Verifying a header is done by a special [quorum intersection mechanism](https://arxiv.org/abs/2010.07031): upon a header from the relayer, the light client checks whether the intersected voting power bewteen the quorum certificates of the current tip and the header is more than 1/3 of the voting power in the current tip.
If yes, then this ensures that there exists at least one honest validator in the header's quorum certificate, and this header is agreed by all honest validators.
Each header of a Cosmos zone carries `AppHash`, which is the root of the Merkle IAVL tree for the Cosmos zone's database.
The `AppHash` allows a light client to verify whether an IBC packet is included in the Cosmos zone's blockchain.

Since the IBC light client provides a consistent view of another Cosmos zone's canonical chain, it is also useful for checkpointing Cosmos zones, apart from verifying IBC packets.
Specifically, each header with a valid quorum certificate can be viewed as a timestamp, and the IBC light client can be viewed as a primitive for producing timestamps for any Cosmos zone.
Following this principle, zone concierge reuses the IBC light clients to checkpointing Cosmos zones.

### Intercepting and Indexing Headers from Cosmos Zones

Zone concierge relies on the IBC light clients to timestamp Cosmos zones.
In order to further timestamp headers of Cosmos zones to Babylon, zone concierge has to build an index that maps each header to the current epoch, which will be eventually finalized by Bitcoin.
To this end, zone concierge builds an index for each IBC light client, and thus each Cosmos zone.
Specifically, zone concierge intercepts each header from IBC light clients via hooks and indexes it, including the header's positions on the Cosmos zone and Babylon.

Note that zone concierge intercepts all headers that have a valid quorum certificate, including both canonical headers and fork headers.
A fork header with a valid quorum certificate is a signal of the dishonest majority attack: the majority of validators are honest and sign conflicted headers.
Babylon adopts a modified IBC light client that filters such conflicted headers and forwards them to zone concierge, such that Babylon can slash the double-signing validators.

### Providing Proofs that a Header is Finalized by Bitcoin

To supports applications that demand a BTC-finalized PoS chain, zone concierge will provide proofs that the headers are indeed finalized by Bitcoin.
The proof of a BTC-finalized header includes the following:

1. Proof that the header is included in a Babylon block
2. Proof that the Babylon block is in an epoch
3. Proof that the epoch has been sealed by this epoch's validator set
4. Proof that the epoch's checkpoint has been submitted and finalized by Bitcoin

The first proof is formed as a Merkle proof that the transaction including this header is in the Babylon block.
The second proof is formed as a Merkle proof that the block's `Apphash` is committed to the Merkle root of `AppHash`s of all blocks in this epoch.
The third proof is formed as a BLS multi-signature jointly generated by the epoch's validator set.
The last proof is formed as Merkle proofs of two transactions that constitute a BTC checkpoint, same as in [BTCCheckpoint module](./btccheckpoint.md).


## Further Integrations

The BTC-finalized PoS chain will enable a number of applications, such as raising alarms upon dishonest majority attacks and reducing the unbonding time period.
These use cases require new modules in the Cosmos zones, and will be developed by Babylon team in the future.

### Raising Alarms upon Dishonest Majority Attacks

Zone concierge timestamps both canonical headers and fork headers that have valid quorum certificates.
Such fork header signals an dishonest majority attack.
Babylon can send this fork header back to the corresponding Cosmos zone, such that the Cosmos zone will get notified with this dishonest majority attack, thus will decide to stall and initiate a social consensus.

### Reducing Unbonding Time

Zone concierge provides a BTC-finalized prefix for a Cosmos zone's blockchain.
Such BTC-finalized prefix resists against the long range attacks, thus unbonding requests in this prefix can be finished without raising any security issue.
Since each epoch takes 100 BTC blocks (which is about 17 hours) to finalize, such BTC-assisted unbonding is significantly faster than the current 21-day unbonding period.
