"use strict";(self.webpackChunkdocument_sample=self.webpackChunkdocument_sample||[]).push([[5127],{3438:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>h,frontMatter:()=>a,metadata:()=>r,toc:()=>d});var i=n(4848),o=n(8453);const a={id:"deployment-overview",sidebar_label:"Overview of Validator Deployment",hide_table_of_contents:!0},s="Overview of Validator Deployment",r={id:"user-guides/btc-staking-testnet/deployment-overview",title:"Overview of Validator Deployment",description:"Overview of validator deployment",source:"@site/docs/user-guides/btc-staking-testnet/deployment-overview.md",sourceDirName:"user-guides/btc-staking-testnet",slug:"/user-guides/btc-staking-testnet/deployment-overview",permalink:"/docs/user-guides/btc-staking-testnet/deployment-overview",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/user-guides/btc-staking-testnet/deployment-overview.md",tags:[],version:"current",frontMatter:{id:"deployment-overview",sidebar_label:"Overview of Validator Deployment",hide_table_of_contents:!0},sidebar:"docs",previous:{title:"Installation",permalink:"/docs/user-guides/installation"},next:{title:"Network Information",permalink:"/docs/user-guides/btc-staking-testnet/network-information"}},l={},d=[];function c(e){const t={a:"a",em:"em",h1:"h1",img:"img",li:"li",ol:"ol",p:"p",ul:"ul",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h1,{id:"overview-of-validator-deployment",children:"Overview of Validator Deployment"}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"Overview of validator deployment",src:n(711).A+"",width:"2432",height:"1729"})}),"\n",(0,i.jsxs)(t.p,{children:["In this testnet, the Babylon Bitcoin staking protocol secures the Babylon blockchain\nvia an extra round of voting on top of the CometBFT consensus, called the\n",(0,i.jsx)(t.em,{children:"finality round"}),". This round is conducted by ",(0,i.jsx)(t.em,{children:"finality providers"}),', which are the\n"validators" that accept Bitcoin as stake delegations. Finality providers use\ntheir EOTS keys to cast finality votes on Babylon blocks generated by CometBFT.\nA Babylon block that has received more than 2/3 finality votes from the active\nfinality provider set is BTC-finalized.']}),"\n",(0,i.jsx)(t.p,{children:"Therefore, one can join BTC staking testnet via one (or more) of the three sets\nof actions:"}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsxs)(t.li,{children:["Become a ",(0,i.jsx)(t.em,{children:"Babylon CometBFT validator"})," and accept Babylon\ntest token delegations. For this, you need to\n",(0,i.jsx)(t.a,{href:"/docs/user-guides/installation",children:"deploy and maintain a Babylon node"})," and\n",(0,i.jsx)(t.a,{href:"/docs/user-guides/btc-staking-testnet/become-validator",children:"register a CometBFT validator"}),"."]}),"\n",(0,i.jsxs)(t.li,{children:["Become a ",(0,i.jsx)(t.em,{children:"finality provider"})," and accept signet BTC delegations.\nFor this, you need to use the ",(0,i.jsx)(t.a,{href:"/docs/user-guides/btc-staking-testnet/finality-providers/overview",children:"finality provider\nprogram"}),".\nThis serves as the control plane for finality providers. It allows\ncreating, managing, and operating finality providers on the Babylon ledger.\nIts functionality is split into two daemons:","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"the EOTS manager daemon, which serves as a server for securely managing\nthe EOTS keys of the finality provider and generating signatures using them;\nand"}),"\n",(0,i.jsx)(t.li,{children:"the finality provider daemon, which is responsible for maintaining a\nconnection with a Babylon node and submitting finality votes for new\nblocks after they are generated by CometBFT."}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.em,{children:"Self-Delegate"})," BTC to your finality provider in a trustless way to gain\nvoting power. You can accomplish this by operating the ",(0,i.jsx)(t.a,{href:"./become-btc-staker",children:"BTC Staker program"}),". The most secure setup involves\na connection to a self-hosted Bitcoin node to submit and monitor the\nconfirmation state of staking transactions and\na connection to a Babylon node to submit staking requests.\nFor this testnet, we are utilising the BTC signet network to enable for\nharmless experimentation. Syncing a node to the BTC signet is super fast and\nshould not take more than 60 minutes. After performing a self-delegation\nto your finality provider you can shut down the Bitcoin node and the\nbtc-staker if you do not intend to make any further delegations.\nAlternatively, you could self-delegate BTC Signet tokens via the staking web\napplication when it becomes available."]}),"\n"]}),"\n",(0,i.jsx)(t.p,{children:"CometBFT validators and Finality providers are independent entities - you can be\nany of the 2. To fully participate in the testnet, we\nstrongly encourage experimenting with both and executing self-delegations."})]})}function h(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},711:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/validator-deployment-overview-94880e77490ac05fb604c55a2970e038.png"},8453:(e,t,n)=>{n.d(t,{R:()=>s,x:()=>r});var i=n(6540);const o={},a=i.createContext(o);function s(e){const t=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),i.createElement(a.Provider,{value:t},e.children)}}}]);