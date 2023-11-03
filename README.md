<h3 align="left">Repository for Jasmine</h3>

![image](https://github.com/xiaoyuanxun/Jasmine/assets/53613219/03c09d93-641b-45dc-baec-15ac62ef10d0)

<div align="center" id="top">
  <p align="center">
    A decentralised NFT application hosted on the Internet Computer Blockchain (ICP)
  </p>
</div>


## About Jasmine

Dapp Demo address: [Kontribute.app](https://kontribute.app).

Jasmine allows readers, writers and web 3 enthusiasts, to create and enjoy community created content, read or write stories and create or sell NFTs along with other features.


### The Tech Stack

* [React.js](https://reactjs.org/)
* [Motoko](https://internetcomputer.org/docs/current/developer-docs/build/languages/motoko/)
* [DFX](https://internetcomputer.org/docs/current/references/cli-reference/dfx-parent/)

### ICP Tools

* [CanDB](https://github.com/canscale/CanDB)    -- a flexible, performant, and horizontally scalable non-relational multi-canister data storage framework built for the Internet Computer.
* [Anvil Protocol](https://docs.nftanvil.com/docs/sdk/js)  -- A communication protocol wish to be autonomous, zero maintenance, self-sustainable web3 microservices made to last million+ years.
* [User Geek](https://usergeek.app/)   -- the first decentralised product analytics tool
built on the DFINITY Internet Computer.
* [Internet Identity](https://internetcomputer.org/docs/current/tokenomics/identity-auth/what-is-ic-identity/)

### Other Tools

* [React Redux](https://react-redux.js.org/)   -- official React UI bindings layer for Redux.
* [Chakra UI](https://chakra-ui.com/)          -- a simple, modular and accessible component library that gives you the building blocks you need to build your React applications.
* [vessel](https://github.com/dfinity/vessel)  -- the original package manager for Motoko programming language.


## Design Approach

Jasmine is built on top of the ICP blockchain - meaning the frontend and backend are both hosted on the blockchain. We use a variety of tools, web2 and web3 alike. The codebase has been opensourced to hopefully be used for educational purposes for any other developers building dapps on the ICP blockchain. 

This project was kickstarted with the `dfx new` command. 

### Frontend

We try to take a modern approach to the frontend in terms of using modern React practices such as functional components and hooks aswell as implementing the most popular React state management library: Redux. The idea is to make as many readable dynamic components as possible taking a "less is more" approach. We are adament that the dapp works and looks nice across all device screens so we use Chakra UI for most of the UI design and CSS, This allows custom and fast development of the UI aswell as responsive components.

### Backend

Our backend is a mix between in house smart contracts written in Motoko aswell as using frontend api's to call external smart contracts on the ICP blockchain. We call features and tools from other Motoko packages using Vessel - a Motoko package manager. Some of our Motoko backend is calling the Anvil Protocols smart contracts - covering our whole NFT integration. For our story integration we use CanDB, a flexible, performant, and horizontally scalable non-relational multi-canister database built for the Internet Computer. All of this makes Kontribute a multi-canister dapp.

## ICP, Anvil Protocol, CanDB and APIs

The ICP blockchain allows us to create "canisters" which can serve your applications code (a canister is just a smart contract which in turn is just code on a blockchain), We use canisters to host both our frontend and backend. Our dapps authentication uses [Internet Identity](https://internetcomputer.org/docs/current/tokenomics/identity-auth/what-is-ic-identity/) which is currently an ICP specific authentication system, it is secure and powered by cryptography and allows users to create anonymous user IDs and wallets. 

We have integrated the Anvil Protocol which allows us to achieve NFT integration aswell as providing us with a variety of tools, including `vessel` and `npm` packages. Our marketplace, inventory and ICP wallet are all powered by the Anvil Protocol. 

We have integrated the Motoko library CanDB and using this we designed a data model that lets us give each author (anyone who posts a story on the platform) a unique canister that they can own. This makes Jasmine a highly scalable dapp that sticks purely to blockchain infrastructure. 

We use UserGeek for analytics which allows us to obtain stats on unique users who use our dapp, as well as things like how many users purchased NFTs, All information is anonymous.

## License
Jasmine is distributed under the terms of the Apache License (Version 2.0).

See LICENSE for details.

<p align="right">(<a href="#top">back to top</a>)</p>
