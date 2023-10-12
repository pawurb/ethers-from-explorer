# ethers-from-explorer [![NPM version](https://badge.fury.io/js/ethers-from-explorer.svg)](https://badge.fury.io/js/ethers-from-explorer)

`ethers-from-explorer` is inspired by the [`from_explorer` method in Brownie](https://eth-brownie.readthedocs.io/en/stable/api-network.html#Contract.from_explorer). It extends the functionality of the [`ethers`](https://github.com/ethers-io/ethers.js) library by adding a convenient `fromExplorer` function.

This package simplifies the process of instantiating `Contract` objects by allowing you to create them using only the address. You no longer need to manually import the ABI JSON to interact with the `Contract` instance. Instead of writing code like this:

```node
const v3Quoter = new ethers.Contract(
  V3_QUOTER_ADDRESS,
  V3QuoterAbi, // manually imported ABI JSON
  provider
);
```

You can now omit the ABI argument and use the `fromExplorer` function as follows:

```node
const v3Quoter = await ethers.fromExplorer(
  V3_QUOTER_ADDRESS,
  provider
)
```

## Installation and usage

```bash
npm install ethers-from-explorer
```

```node
const { ethers } = require('ethers');
require('ethers-from-explorer');

const provider = new ethers.JsonRpcProvider('YOUR_ETHEREUM_RPC_URL');
const V3_QUOTER_ADDRESS = '0xYourContractAddress';

(async () => {
  const v3Quoter = await ethers.fromExplorer(
    V3_QUOTER_ADDRESS,
    provider
  );

  // you can interact with the `v3Quoter` Contract instance without providing the ABI.
  const factoryAddress = await v3Quoter.factory()
})();
```

Package uses [Etherscan API](https://etherscan.io/) to download ABI for a given contract address. API calls are throttled by default to 1 request every 5 seconds. You can specify an `ETHERSCAN_API_KEY` environment variable to increase the rate limit if needed.

ABI responses are cached locally in a `~/.ethers-abi-cache.json` file, ensuring that each ABI is downloaded only once and reducing unnecessary network requests.

## TODO

- support for proxy contracts
- support for other networks
