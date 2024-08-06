---
id: overview
sidebar_label: FAQ
hide_table_of_contents: true
pagination_prev: null
custom_edit_url: null
---

# Frequently Asked Questions

- [Questions about Bitcoin Staking](#questions-about-bitcoin-staking)
  - [Will my bitcoins be bridged to other blockchains?](#will-my-bitcoins-be-bridged-to-other-blockchains)
  - [As a bitcoin staker, do I have to run a validator by myself?](#as-a-bitcoin-staker-do-i-have-to-run-a-validator-by-myself)
  - [When slashing happens, will all my staked bitcoins be burned?](#when-slashing-happens-will-all-my-staked-bitcoins-be-burned)

## Questions about Bitcoin Staking

### Will my bitcoins be bridged to other blockchains?

No.
Babylon allows bitcoin holders to stake their
bitcoins without bridging them to other blockchains,
while providing the chain with full slashable security guarantees.

### As a bitcoin staker, do I have to run a validator by myself?

No.
Like most PoS systems,
with the Bitcoin staking protocol,
you can delegate your voting power to a validator that you trust.
The validator will usually charge a commission of your staking reward.
If the delegated validator acts maliciously, your stake will also be slashed.
Running validator by yourself will avoid this trust and commission,
putting both the stake and reward fully under your control.

### When slashing happens, will all my staked bitcoins be burned?

Not necessarily.
Our protocol supports partial slashing.
This means that, when slashing happens,
only a certain portion of the staked bitcoins will be slashed,
with the portion being a parameter of the protocol.
