"use strict";(self.webpackChunkdocument_sample=self.webpackChunkdocument_sample||[]).push([[9261],{5512:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>c,contentTitle:()=>s,default:()=>r,frontMatter:()=>o,metadata:()=>h,toc:()=>l});var t=i(4848),a=i(8453);const o={id:"btclightclient",sidebar_label:"BTC Light Client Module",hide_table_of_contents:!0},s="BTC Light Client Module",h={id:"developer-guides/modules/btclightclient",title:"BTC Light Client Module",description:"Learn what the Babylon BTC Light Client Module is and how it operates.",source:"@site/docs/developer-guides/modules/btclightclient.md",sourceDirName:"developer-guides/modules",slug:"/developer-guides/modules/btclightclient",permalink:"/docs/developer-guides/modules/btclightclient",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/developer-guides/modules/btclightclient.md",tags:[],version:"current",frontMatter:{id:"btclightclient",sidebar_label:"BTC Light Client Module",hide_table_of_contents:!0},sidebar:"docs",previous:{title:"BTC Checkpoint Module",permalink:"/docs/developer-guides/modules/btccheckpoint"},next:{title:"Zone Concierge Module",permalink:"/docs/developer-guides/modules/zoneconcierge"}},c={},l=[{value:"Summary",id:"summary",level:2},{value:"Problem Statement",id:"problem-statement",level:2},{value:"Design",id:"design",level:2},{value:"Base Bitcoin Header",id:"base-bitcoin-header",level:3},{value:"Inserting Bitcoin Blocks",id:"inserting-bitcoin-blocks",level:3},{value:"Identifying the Canonical Chain",id:"identifying-the-canonical-chain",level:3}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",ol:"ol",p:"p",ul:"ul",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"btc-light-client-module",children:"BTC Light Client Module"}),"\n",(0,t.jsx)(n.p,{children:"Learn what the Babylon BTC Light Client Module is and how it operates."}),"\n",(0,t.jsx)(n.hr,{}),"\n",(0,t.jsx)(n.h2,{id:"summary",children:"Summary"}),"\n",(0,t.jsx)(n.p,{children:"The BTC light client module is responsible for maintaining a chain of Bitcoin headers\nand identifying the canonical Bitcoin chain from it, much like a Bitcoin light client.\nThis header chain can then be used to verify the\ninclusion of checkpoints in Bitcoin and to calculate the checkpoint depth. This\nmodule is critical to Babylon, as it provides a consistent view of time\namong all Babylon nodes."}),"\n",(0,t.jsx)(n.h2,{id:"problem-statement",children:"Problem Statement"}),"\n",(0,t.jsx)(n.p,{children:"Babylon nodes need to make decisions based on the state of the Bitcoin chain.\nExample decisions are:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Has a checkpoint been included in Bitcoin?"}),"\n",(0,t.jsx)(n.li,{children:"Is this checkpoint deep enough in Bitcoin to mark it as finalized? If yes,\nthe node will approve the stake unbonding request covered by it."}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"Each decision must be consistent among all the Babylon nodes\nto make sure their application state is the same after the execution of\neach Babylon block.\nThus, Babylon nodes must have a consistent view of the Bitcoin chain included as a part of their state."}),"\n",(0,t.jsxs)(n.p,{children:["The BTC light client module accomplishes this by\nreceiving Bitcoin headers as Tendermint-ordered Babylon transactions,\ntypically from a ",(0,t.jsx)(n.a,{href:"./reporter",children:"vigilante reporter"}),",\nand is responsible for their verification.\nOnce headers are added, the BTC light client module can identify the canonical chain\nby calculating the chain that has the most work committed to it.\nSince Tendermint guarantees consistency of\ntransaction orders, the BTC light client module of all Babylon nodes will\nmaintain the same BTC header chain.\nOther modules can then query the BTC light client for checkpoint related\ndecision making."]}),"\n",(0,t.jsx)(n.h2,{id:"design",children:"Design"}),"\n",(0,t.jsx)(n.p,{children:"Below we outline the key design decisions for the BTC light client module:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"#base-bitcoin-header",children:"Base Bitcoin Header"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"#inserting-bitcoin-blocks",children:"Inserting Bitcoin Blocks"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"#identifying-the-canonical-chain",children:"Identifying the Canonical Chain"})}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"base-bitcoin-header",children:"Base Bitcoin Header"}),"\n",(0,t.jsxs)(n.p,{children:["The base bitcoin header is the first Bitcoin header that Babylon maintains.\nThis header is specified in Babylon\u2019s genesis block, and\nis a header that is sufficiently deep.\nFor example, for our testnet, we will use a Bitcoin header that is 100-deep inside\nBitcoin's canonical chain at the time of genesis.\nReverting such a header would require immense computational power.\nWe choose a 100 because Bitcoin itself uses the ",(0,t.jsx)(n.code,{children:"100-deep"})," as the ",(0,t.jsx)(n.code,{children:"COINBASE_MATURITY"})," value\nto determine whether a coinbase reward is available to be spent."]}),"\n",(0,t.jsx)(n.h3,{id:"inserting-bitcoin-blocks",children:"Inserting Bitcoin Blocks"}),"\n",(0,t.jsx)(n.p,{children:"Bitcoin blocks are inserted into the Babylon chain by submitting\na message to the BTC light client module containing the hex representation of the header.\nThose headers are verified based on the following rules:"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"The header has the structure of a valid Bitcoin block."}),"\n",(0,t.jsxs)(n.li,{children:["The ",(0,t.jsx)(n.code,{children:"Bits"})," field of the header respects the work rules ",(0,t.jsx)(n.a,{href:"https://github.com/bitcoin/bitcoin/blob/a688ff9046a9df58a373086445ab5796cccf9dd3/src/validation.cpp#L3468",children:"maintained by the connected Bitcoin chain"})," (either mainnet or testnet)."]}),"\n",(0,t.jsx)(n.li,{children:"The hash of the header does not correspond to a hash of a header already maintained by Babylon."}),"\n",(0,t.jsxs)(n.li,{children:["The ",(0,t.jsx)(n.code,{children:"PrevHash"})," field corresponds to a hash of a Bitcoin header that is already maintained by Babylon."]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["The above rules ensure that a Babylon node only accepts Bitcoin headers that would be accepted\nby a Bitcoin full node or light client, with the exception of not accepting orphaned headers.\nOrphan headers are headers that are not connected with any known Bitcoin block through the ",(0,t.jsx)(n.code,{children:"PrevHash"})," field\nwhich are typically accepted by Bitcoin node implementations in the hopes that the missing header with a hash\nequal to ",(0,t.jsx)(n.code,{children:"PrevHash"})," will be propagated at a later point.\nTo simplify the Babylon node, we made the design decision of not maintaining such a pool of orphan headers."]}),"\n",(0,t.jsx)(n.h3,{id:"identifying-the-canonical-chain",children:"Identifying the Canonical Chain"}),"\n",(0,t.jsx)(n.p,{children:"The BTC light client module maintains an entry in its storage corresponding to the tip\nof the canonical chain based on the set of headers that it has. Along with the tip,\nit stores its cumulative work, i.e. the total work for this chain of headers."}),"\n",(0,t.jsxs)(n.p,{children:["When a new header is inserted, its cumulative work is calculated as the sum of\nits work (through the ",(0,t.jsx)(n.code,{children:"Bits"})," field of the header) and the cumulative work of its parent header.\nIf this sum is more than the cumulative work of the tip of the chain,\nthen the new header becomes the tip."]}),"\n",(0,t.jsx)(n.p,{children:"One can identify the canonical Bitcoin chain maintained by Babylon and the corresponding depth of headers\nby traversing the ancestor list of the tip of the canonical chain."})]})}function r(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>s,x:()=>h});var t=i(6540);const a={},o=t.createContext(a);function s(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function h(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:s(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);