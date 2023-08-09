# ScrowLite v1.0.1-beta (DApp Repository)

![ScrowLite](./app/src/assets/ScrowLite_Black_WhiteFill.svg#gh-dark-mode-only)
![ScrowLite](./app/src/assets/ScrowLite_White_BlackFill.svg#gh-light-mode-only)

[Contract Repository](https://github.com/Metaxona/ScrowLite)

An Escrow Dapp For Trustless Trading of ERC20, ERC721, and ERC1155 Assets

ETH to ERC and ERC to ETH Trades Are Not Included Since It Would Violate The Priciple Of Not Requiring Assets To Be Deposited To The Escrow Contract.

## Problem

Trust, Authenticity, Security, Fees, and Privacy

1. Trading Assets Today Has Been Hard, You Don't Know If The Other Party Is There To Scam You Or Not.

2. It Is Also Hard To Validate The Authenticity Of The Assets You Are Trying To Trade.

3. When Trading Assets, You'll Have To Go To Third Party Person Or Service To Become The Middleman Of The Trade, Which Some Are Scams Out To Get Your Assets

4. Inconsistent And Expensive Third Party Escorw Fees

### Usual Third-Party Escrow

1. Usually Requires KYC Which Is Not Attractive To Those Who Don't Like Sharing Personal Information Online

2. You Both Send Your Assets To The Middleman

3. Pay The Fee

4. The Middleman Sends The Assets To The New Respective Owners

### Usual Third-Party | Community Based Escrow Scams

   Phishing Discord Servers That Looks Like The Legit Counter Part (Almost 100% Likeness Including Announcements and Channels) Complete With Users With The Same Names And Profile Pictures, After Sending The Assets To THe Middleman, They Would Kick And Ban You, And Is Usually Done By A Group Of Scammers.

## Solution

### Trust

   By Creating This Dapp and Smart Contract, It Eliminates The Need For Third Party Middleman And Trust That Party B Would Scam Them

### Authenticity

   You Create The Trade By Using The Details You Provide

#### Your Asset

1. `Contract Address` - of The Token You Want To Trade, Which Party B Must Double Check Before Accepting The Trade

2. `Token Id` - of The ERC721 or ERC1155 of the NFT You Want To Trade

3. `Amount` - Of The ERC20 or ERC1155 You Want To Trade

#### Party B's Asset

1. `Contract Address` - of The Token You Want To Receive, Which You Must Double Check Before Creating The Trade

2. `Token Id` - of The ERC721 or ERC1155 of the NFT You Want To Receive

3. `Amount` - Of The ERC20 or ERC1155 You Want To Receive

This Would Give You Control To Make Sure You Are Receiving The Correct Asset Since The Trade Won't Proceed If The Both Parties Do Not Own Any Of The Required Assets. Checks Are Done When Creating ANd Accepting Trades To Prevent Trades From Becoming A Scam Where Users Would Create A Trade Then Transfer Assets, or Accepting The Trade Without The Required Assets

### Middleman

   Middleman Would Not Be Needed Since You Only Need To Come To An Aggrement With Party B Then Create A Trade Instance

### Security

#### Asset Security

1. Assets Won't Be Required To be Deposited To The Contract

2. Assets Must Be On The EOA (Externally Owned Account) or Wallet Of Both Parties

3. If The Required Assets Are Not In The Wallet

   1. Party A Won't Be Able To Create The Trade

   2. Party B Won't Be Able To Accept The Trade

   3. If Party A Transferred The Assets After Creating The Trade, Party B'a Acceptance Of The Trade Would Fail

#### Contract Security

Restrictions Are Placed In The Contract On Who Can Access Which Functions And Other Prevention Mechanisims To Prevent Reentracy Like The CEI (Check, Effect, Interact) Pattern And Several Checks Before Executions To Make Sure That The Trade Instance Has Not Been Interacted Yet (Completed, Rejected, or Cancelled) Before Executions.

#### Added Layer Of Security

Creation And Acceptance Of Trades Could Be Paused In The Contract In Case Of An Emergency Where An Exploit Is Found That Would Affect User's Assets. Pausing The Creation And Acceptance Of Trades Would Give All Users Time To Cancel Or Reject Their Pending Trade Instances To Avoid Being Exploited Due To A Bug Or Exploit In The Contract.

#### Other Contract Security Concern

Slither Analyzer Detects A High Level Error In The `AcceptTrade` Function Caused By The Parameters In The Function For Transfering ERC Assets' `from` Parameter Not Being `msg.sender`. To Prevent Exploits Because Of This, Include A Permission/Approval Revoke Method For Users To Revoke The Permissions For Their Assets For The Escrow Conrtact On The DApp. Reason For This Is To Allow The Contract To Swap Assets The Moment Party B Accepted The Trade And Any Other Method Won't Work.

### Fees

Fees Are In ETH Or The Native Token Of The Network The Contract Is Deployed On. Fees Are Set And Can Be Re-Set By The Contract's Owner If No Role Restrictions Is Included In The Contract. Initial Fee Is Set To `0.001 ETH` and Can Be Changed After Deployment.

### Privacy

No KYC Needed To Create And Interact With A Trade, Both Party Just Need To Have All Required Assets In Their EOA (Externally Owned Account) or Wallet

## Current Version Features

- One To One Asset Trade
- On-Chain Data Removing The Need For An External Database
- Access Restrictions

## Future Version Features

- Batch Trades Allowing Multi Asset Trades
- Role Based Restriction

## Contracts

Current Network: `Sepolia`

**ScrowLite** - `0x61caFF3872f505D3D0a4F40E156235D506816E49`  
**ScrowLite Data** - `0xB4B5a608908cb68cDBaDD620bb27E05080AF7931`  
**ERC Balance Library** - `0xE8BB32A0A9B69C95D68Bf8890f3ff5fbB46a691b`  
**Id Generator Library** - `0xd19247303c26aa4850776C9fCd7E995C883CDF27`

## Found Vulnerabilities or Exploits

1. Ownable Contract's `transferOwnership` function has no `onlyOwner` modifier allowing anyone to transfer the ownership of the contract giving them the ability to set the fee, pause the interactions, and withdraw the assets from the contract [FIXED]

2. Create Trade amount could be ZERO allowing scammers to create trades to targets and manipulate them to accepting the trade believing they would get a new asset in exchange for their asset

3. Etherscan found compiler bugs

   Solution: Upgrade to pragma 0.8.21

   1. [FullInlinerNonExpressionSplitArgumentEvaluationOrder [Low Severity]](https://sepolia.etherscan.io/solcbuginfo?a=FullInlinerNonExpressionSplitArgumentEvaluationOrder)

   2. [MissingSideEffectsOnSelectorAccess [Low Severity]](https://sepolia.etherscan.io/solcbuginfo?a=MissingSideEffectsOnSelectorAccess)

4. ERC20 TransferFrom is not using the safe version

## Development

Things Used In Developing This Project

### Smart Contract

1. Solidity
2. Hardhat
3. Ethers JS V6
4. Remix
5. Openzeppelin

#### Testing

1. Hardhat + Chai + Mocha
2. Ethereum Waffle
3. nodemon
4. Slither by Crytic

### User Interface (React)

1. React
2. React Router
3. Chakra UI
4. React Icons
5. Wagmi
6. Viem
7. RainbowKit
8. Alchemy SDK
9. Prettier

### User Interface (Next)

1. React
2. Next JS 13 App Router
3. Chakra UI
4. React Icons
5. Wagmi
6. Viem
7. RainbowKit
8. Alchemy SDK
9. Prettier
