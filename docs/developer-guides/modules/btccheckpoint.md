---
id: btccheckpoint
sidebar_label: BTC Checkpoint Module
hide_table_of_contents: true
---

# BTC Checkpoint Module

Learn what the Babylon BTC Checkpoint Module is and how it operates.

---

## Summary

The `btccheckpoint` module is responsible for receiving information about Babylon checkpoints
submitted to Bitcoin ledger. Each valid submission is composed of two Bitcoin transactions.
Each of those transactions must contain at least one OP_RETRUN output which contains specific
Babylon data. To verify that those transactions are part of bitcoin ledger, each submission
must also have merkle proof of inclusions against transaction root hash from Bitcoin
header which is already known by `btclightclient` module.
Data included in OP_RETURN outputs must form a valid Babylon checkpoint. As `btccheckpoint`
does not know all rules which makes checkpoint valid, it communicates with
`checkpoint` module to validate it.
After submission is deemed valid:
- It stored and tracked by `btcheckpoint` module
- `checkpointing` module is informed about the different stages of checkpoint life cycle

## Problem Statement

To properly track the life cycle of checkpoint on Bitcoin ledger, `btccheckpoint` module
relay on two external processes:
- vigilante submitter - process which submits checkpoints from Babylon network to Bitcoin
network
- vigilante reporter - process which scan Bitcoin ledger looking for Babylon checkpoints
and reports them back to Babylon.
As Babylon is open system, there can be many submitters and many reporters which can
lead to (if submitters and reporters do not coordinate):
- submitting one checkpoint multiple times on Bitcoin ledger by different submitters
- reporting one submission multiple times to Babylon by different reporters
`btccheckpoint` module need to take care of properly de-duplicating identical submissions
and deciding which submission is first on Bitcoin ledger.

### Submission Identification

Each submitted transaction is identified by `TransactionKey`  which is composed from
Bitcoin block header hash and transaction index in the block, and each submission
is identified by `SubmissionKey` which composed from two `TransactionKeys`. Submission
validation rules makes sure that there is only one order of `TransactionKeys` in each
submissions.
This layout makes it easy to not accept submissions if it was already reported and recorded
in Babylon ledger.

### Submission Validation Rules

Each submission is inserted into Babylon ledger by sending transaction which contains
`MsgInsertBTCSpvProof` [msg](https://github.com/babylonlabs-io/babylon/blob/dev/proto/babylon/btccheckpoint/tx.proto#L15).
This message must contain all necessary data required to validate that submissions is part of
Bitcoin canonical chain. Message must contain two [BTCSpvProof](https://github.com/babylonlabs-io/babylon/blob/dev/proto/babylon/btccheckpoint/btccheckpoint.proto#L23) objects.
Each `BTCSpvProof` contains:
- Bitcoin transaction
- Index of Bitcoin transaction in Bitcoin block
- merkle proof that provided transaction is part of the Bitcoin block
- Bitcoin header of the block which contains provided transaction.

Validations performed when receiving new submission:

1. Check that all received Bitcoin objects (Transactions, Headers, Proofs) have correct format
2. Check that merkle proofs are connecting provided transactions to provided headers
3. Check that provided transactions contain OP_RETRUN outputs which contains data
4. Check that data extracted from OP_RETURN outputs form possible Babylon checkpoint.
5. Check that submission is not a duplicate
6. Check that provided Bitcoin headers are known to `btclightclient` module and are
on the Bitcoin main chain maintained by `btclightclient` module
7. Check that extracted checkpoint is valid, according to `checkpointing` module rules
8. Check that that there are already valid checkpoint submissions for checkpoints for the previous epoch which
are deeper in Bitcoin ledger.
Example: If the received checkpoint is for epoch 9 and is in Bitcoin block which is 10 deep on Bitcoin
ledger, there must already exists submission for epoch 8 which is at least 11 deep on Bitcoin ledger.
This rule ensures that checkpoints for older epoch, are older on Bitcoin chain.


