"use strict";(self.webpackChunkdocument_sample=self.webpackChunkdocument_sample||[]).push([[2420],{3519:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>i,default:()=>g,frontMatter:()=>r,metadata:()=>s,toc:()=>l});var a=n(4848),o=n(8453);const r={id:"babylond_tx_feegrant_grant",sidebar_label:"babylond tx feegrant grant",hide_table_of_contents:!0},i="babylond tx feegrant grant",s={id:"cli/babylond/Babylond_tx/Babylond_tx_feegrant/babylond_tx_feegrant_grant",title:"babylond tx feegrant grant",description:"Grant authorization for fee allowance to an address.",source:"@site/docs/cli/babylond/Babylond_tx/Babylond_tx_feegrant/Babylond_tx_feegrant_grant.md",sourceDirName:"cli/babylond/Babylond_tx/Babylond_tx_feegrant",slug:"/cli/babylond/Babylond_tx/Babylond_tx_feegrant/babylond_tx_feegrant_grant",permalink:"/docs/cli/babylond/Babylond_tx/Babylond_tx_feegrant/babylond_tx_feegrant_grant",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/cli/babylond/Babylond_tx/Babylond_tx_feegrant/Babylond_tx_feegrant_grant.md",tags:[],version:"current",frontMatter:{id:"babylond_tx_feegrant_grant",sidebar_label:"babylond tx feegrant grant",hide_table_of_contents:!0},sidebar:"docs",previous:{title:"babylond tx feegrant",permalink:"/docs/cli/babylond/Babylond_tx/babylond_tx_feegrant"},next:{title:"babylond tx feegrant revoke",permalink:"/docs/cli/babylond/Babylond_tx/Babylond_tx_feegrant/babylond_tx_feegrant_revoke"}},d={},l=[{value:"tx feegrant grant command",id:"tx-feegrant-grant-command",level:2},{value:"Options",id:"options",level:2},{value:"Options Inherited from Parent Commands",id:"options-inherited-from-parent-commands",level:2}];function c(e){const t={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.h1,{id:"babylond-tx-feegrant-grant",children:"babylond tx feegrant grant"}),"\n",(0,a.jsx)(t.p,{children:"Grant authorization for fee allowance to an address."}),"\n",(0,a.jsx)(t.h2,{id:"tx-feegrant-grant-command",children:"tx feegrant grant command"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{children:"babylond tx feegrant grant [granter_key_or_address] [grantee] [flags]\n"})}),"\n",(0,a.jsx)(t.h2,{id:"options",children:"Options"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{children:'  -a, --account-number uint        The account number of the signing account (offline mode only)\n      --allowed-messages strings   Set of allowed messages for fee allowance\n      --aux                        Generate aux signer data instead of sending a tx\n  -b, --broadcast-mode string      Transaction broadcasting mode (sync|async|block) (default "sync")\n      --dry-run                    ignore the --gas flag and perform a simulation of a transaction, but don\'t broadcast it (when enabled, the local Keybase is not accessible)\n      --expiration string          The RFC 3339 timestamp after which the grant expires for the user\n      --fee-granter string         Fee granter grants fees for the transaction\n      --fee-payer string           Fee payer pays fees for the transaction instead of deducting from the signer\n      --fees string                Fees to pay along with transaction; eg: 10uatom\n      --from string                Name or address of private key with which to sign\n      --gas string                 gas limit to set per-transaction; set to "auto" to calculate sufficient gas automatically. Note: "auto" option doesn\'t always report accurate results. Set a valid coin value to adjust the result. Can be used instead of "fees". (default 200000)\n      --gas-adjustment float       adjustment factor to be multiplied against the estimate returned by the tx simulation; if the gas limit is set manually this flag is ignored  (default 1)\n      --gas-prices string          Gas prices in decimal format to determine the transaction fee (e.g. 0.1uatom)\n      --generate-only              Build an unsigned transaction and write it to STDOUT (when enabled, the local Keybase only accessed when providing a key name)\n  -h, --help                       help for grant\n      --keyring-backend string     Select keyring\'s backend (os|file|kwallet|pass|test|memory) (default "os")\n      --keyring-dir string         The client Keyring directory; if omitted, the default \'home\' directory will be used\n      --ledger                     Use a connected Ledger device\n      --node string                <host>:<port> to tendermint rpc interface for this chain (default "tcp://localhost:26657")\n      --note string                Note to add a description to the transaction (previously --memo)\n      --offline                    Offline mode (does not allow any online functionality)\n  -o, --output string              Output format (text|json) (default "json")\n      --period int                 period specifies the time duration(in seconds) in which period_limit coins can be spent before that allowance is reset (ex: 3600)\n      --period-limit string        period limit specifies the maximum number of coins that can be spent in the period\n  -s, --sequence uint              The sequence number of the signing account (offline mode only)\n      --sign-mode string           Choose sign mode (direct|amino-json|direct-aux), this is an advanced feature\n      --spend-limit string         Spend limit specifies the max limit can be used, if not mentioned there is no limit\n      --timeout-height uint        Set a block timeout height to prevent the tx from being committed past a certain height\n      --tip string                 Tip is the amount that is going to be transferred to the fee payer on the target chain. This flag is only valid when used with --aux, and is ignored if the target chain didn\'t enable the TipDecorator\n  -y, --yes                        Skip tx broadcasting prompt confirmation\n'})}),"\n",(0,a.jsx)(t.h2,{id:"options-inherited-from-parent-commands",children:"Options Inherited from Parent Commands"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{children:'      --chain-id string     The network chain ID\n      --home string         directory for config and data (default "/home/<yourSystemUsername>/.babylond")\n      --log_format string   The logging format (json|plain) (default "plain")\n      --log_level string    The logging level (trace|debug|info|warn|error|fatal|panic) (default "info")\n      --trace               print out full stack trace on errors\n'})})]})}function g(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(c,{...e})}):c(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>s});var a=n(6540);const o={},r=a.createContext(o);function i(e){const t=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),a.createElement(r.Provider,{value:t},e.children)}}}]);