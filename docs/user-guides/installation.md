---
id: installation
sidebar_label: Installation
hide_table_of_contents: true
pagination_prev: null
pagination_next: null
custom_edit_url: null
---

import myImageUrl from './image/installationguide.png';

# Installation

💻 Learn how to install and initialize the Babylon chain on your system.

---

<div style={{justifyContent: 'center', display: 'flex'}}>
    <img style={{width: "1000px"}} src={myImageUrl} alt="installationguide" />
</div>


## Step 1: Install Golang <a id="step1"></a>
:::info Note

Babylon requires Golang [version 1.21](https://go.dev/doc/install) for Babylon to be installed on your system.
Install it using the instructions on the provided link.

:::

After you install it, you can verify that you have the proper version by running:
```console
$ go version
go version go1.21.6 linux/amd64
```

## Step 2: Build and Install Babylon <a id="step2"></a>
You need to clone Babylon’s GitHub repository to install the `babylond` executable.

1. Install build requirements
```console
sudo apt install git build-essential curl jq --yes
```
2. Retrieve the Babylon source code either through the [releases page](https://github.com/babylonlabs-io/babylon/releases) or by cloning the [source code](https://github.com/babylonlabs-io/babylon).
3. Navigate to the directory that contains the Babylon source code. From there build and install the babylond executable
```console
git checkout <version_to_install>
make install
```

:::info Note

The last command first executes `git checkout` in the specific version that you want to install.
Ensure that you install the same version of the Babylon executable as the one that is running on the network you aim to join.

:::
