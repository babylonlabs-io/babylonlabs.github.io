"use strict";(self.webpackChunkdocument_sample=self.webpackChunkdocument_sample||[]).push([[1745],{2948:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>a,metadata:()=>s,toc:()=>d});var t=i(4848),o=i(8453);const a={id:"overview",title:"Become a Finality Provider",sidebar_label:"Become a Finality Provider"},r=void 0,s={id:"user-guides/btc-staking-testnet/finality-providers/overview",title:"Become a Finality Provider",description:"A toolset crafted for the creation and",source:"@site/docs/user-guides/btc-staking-testnet/finality-providers/overview.md",sourceDirName:"user-guides/btc-staking-testnet/finality-providers",slug:"/user-guides/btc-staking-testnet/finality-providers/overview",permalink:"/docs/user-guides/btc-staking-testnet/finality-providers/overview",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/user-guides/btc-staking-testnet/finality-providers/overview.md",tags:[],version:"current",frontMatter:{id:"overview",title:"Become a Finality Provider",sidebar_label:"Become a Finality Provider"},sidebar:"docs",previous:{title:"Become a Validator",permalink:"/docs/user-guides/btc-staking-testnet/become-validator"},next:{title:"EOTS Manager",permalink:"/docs/user-guides/btc-staking-testnet/finality-providers/eots-manager"}},l={},d=[{value:"1. Overview",id:"1-overview",level:2},{value:"2. Installation",id:"2-installation",level:2},{value:"Prerequisites",id:"prerequisites",level:3},{value:"Downloading the code",id:"downloading-the-code",level:3},{value:"Building and installing the binary",id:"building-and-installing-the-binary",level:3},{value:"3. Setting up a finality provider",id:"3-setting-up-a-finality-provider",level:2},{value:"3.1. Setting up a Babylon Full Node",id:"31-setting-up-a-babylon-full-node",level:3},{value:"3.2. Setting up the EOTS Manager",id:"32-setting-up-the-eots-manager",level:3},{value:"3.3. Setting up a Finality Provider",id:"33-setting-up-a-finality-provider",level:3},{value:"4. Delegations &amp; Rewards",id:"4-delegations--rewards",level:2}];function c(e){const n={a:"a",code:"code",em:"em",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,o.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"A toolset crafted for the creation and\nmanagement of Finality Providers."}),"\n",(0,t.jsx)(n.h2,{id:"1-overview",children:"1. Overview"}),"\n",(0,t.jsxs)(n.p,{children:["Finality providers are responsible for voting\nat a finality round on top of ",(0,t.jsx)(n.a,{href:"https://github.com/cometbft/cometbft",children:"CometBFT"}),".\nSimilar to any native PoS validator,\na finality provider can receive voting power delegations from BTC stakers, and\ncan earn commission from the staking rewards denominated in Babylon tokens."]}),"\n",(0,t.jsx)(n.p,{children:"The finality provider toolset does not have\nany special hardware requirements\nand can operate on standard mid-sized machines\nrunning a UNIX-flavored operating system.\nIt consists of the following programs:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.em,{children:"Babylon full node"}),": An instance of a Babylon node connecting to\nthe Babylon network. Running one is not a strict requirement,\nbut it is recommended for security compared to trusting a third-party RPC node."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.em,{children:"Extractable One-Time Signature (EOTS) manager"}),":\nA daemon responsible for securely maintaining the finality provider\u2019s\nprivate key and producing extractable one time signatures from it."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.em,{children:"Finality Provider"}),": A daemon managing the finality provider.\nIt connects to the EOTS manager to generate EOTS public randomness and\nfinality votes for Babylon blocks, which it submits to Babylon through\nthe node connection."]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"The following graphic demonstrates the interconnections between the above programs:"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"Finality Provider Interconnections",src:i(7434).A+"",width:"1101",height:"528"})}),"\n",(0,t.jsx)(n.h2,{id:"2-installation",children:"2. Installation"}),"\n",(0,t.jsx)(n.h3,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,t.jsx)(n.p,{children:"This project requires Go version 1.21 or later."}),"\n",(0,t.jsxs)(n.p,{children:["Install Go by following the instructions on\nthe ",(0,t.jsx)(n.a,{href:"https://golang.org/doc/install",children:"official Go installation guide"}),"."]}),"\n",(0,t.jsx)(n.h3,{id:"downloading-the-code",children:"Downloading the code"}),"\n",(0,t.jsx)(n.p,{children:"To get started, clone the repository to your local machine from Github:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"git clone https://github.com/babylonlabs-io/finality-provider.git\n"})}),"\n",(0,t.jsxs)(n.p,{children:["You can choose a specific version from\nthe ",(0,t.jsx)(n.a,{href:"https://github.com/babylonlabs-io/finality-provider/releases",children:"official releases page"})]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"cd finality-provider # cd into the project directory\ngit checkout <release-tag>\n"})}),"\n",(0,t.jsx)(n.h3,{id:"building-and-installing-the-binary",children:"Building and installing the binary"}),"\n",(0,t.jsx)(n.p,{children:"At the top-level directory of the project"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"make install\n"})}),"\n",(0,t.jsxs)(n.p,{children:["The above command will build and install the following binaries to\n",(0,t.jsx)(n.code,{children:"$GOPATH/bin"}),":"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"eotsd"}),": The daemon program for the EOTS manager."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"fpd"}),": The daemon program for the finality-provider."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"fpcli"}),": The CLI tool for interacting with the finality-provider daemon."]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["If your shell cannot find the installed binaries, make sure ",(0,t.jsx)(n.code,{children:"$GOPATH/bin"})," is in\nthe ",(0,t.jsx)(n.code,{children:"$PATH"})," of your shell. Usually these commands will do the job"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"export PATH=$HOME/go/bin:$PATH\necho 'export PATH=$HOME/go/bin:$PATH' >> ~/.profile\n"})}),"\n",(0,t.jsx)(n.h2,{id:"3-setting-up-a-finality-provider",children:"3. Setting up a finality provider"}),"\n",(0,t.jsx)(n.h3,{id:"31-setting-up-a-babylon-full-node",children:"3.1. Setting up a Babylon Full Node"}),"\n",(0,t.jsxs)(n.p,{children:["Before setting up the finality provider toolset,\nan operator must ensure a working connection with a Babylon full node.\nIt is highly recommended that operators run their own node to avoid\ntrusting third parties. Instructions on how to set up a full Babylon node\ncan be found in\n",(0,t.jsx)(n.a,{href:"https://docs.babylonlabs.io/docs/user-guides/btc-staking-testnet/setup-node",children:"the Babylon documentation"}),"."]}),"\n",(0,t.jsx)(n.h3,{id:"32-setting-up-the-eots-manager",children:"3.2. Setting up the EOTS Manager"}),"\n",(0,t.jsxs)(n.p,{children:["After a node and a keyring have been set up,\nthe operator can set up and run the\nExtractable One Time Signature (EOTS) manager daemon.\nA complete overview of the EOTS manager, its operation, and\nits configuration options can be found in the\n",(0,t.jsx)(n.a,{href:"/docs/user-guides/btc-staking-testnet/finality-providers/eots-manager",children:"EOTS Manager page"})]}),"\n",(0,t.jsx)(n.h3,{id:"33-setting-up-a-finality-provider",children:"3.3. Setting up a Finality Provider"}),"\n",(0,t.jsxs)(n.p,{children:["The last step is to set up and run\nthe finality daemon.\nA complete overview of the finality daemon, its operation, and\nits configuration options can be found in the\n",(0,t.jsx)(n.a,{href:"/docs/user-guides/btc-staking-testnet/finality-providers/finality-provider",children:"Finality page"}),"."]}),"\n",(0,t.jsx)(n.h2,{id:"4-delegations--rewards",children:"4. Delegations & Rewards"}),"\n",(0,t.jsxs)(n.p,{children:["A finality provider receives BTC delegations through delegators\ninteracting with Babylon and choosing it as the recipient of their delegations.\nTo perform a self-delegation,\nthe operator can either visit the staking web app we provide,\nor run the Babylon ",(0,t.jsx)(n.a,{href:"https://github.com/babylonlabs-io/btc-staker",children:"BTC Staker program"})," once.\nThe BTC staker connects to a Bitcoin wallet and Babylon to perform delegations."]})]})}function h(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},7434:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/finality-toolset-9c0d5efdc590d6f89e65d9a08e6799f4.png"},8453:(e,n,i)=>{i.d(n,{R:()=>r,x:()=>s});var t=i(6540);const o={},a=t.createContext(o);function r(e){const n=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),t.createElement(a.Provider,{value:n},e.children)}}}]);