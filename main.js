const { ethers, Contract } = require("ethers");
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const fsp = require("fs/promises");
var fs = require("fs");
const homePath =
  process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
const DEFAULT_CACHE_FILE = ".ethers-abi-cache.json";

ethers["fromExplorer"] = async function (
  address,
  provider,
  cachePath = DEFAULT_CACHE_FILE,
  http = fetch
) {
  let abi;

  abi = await getCachedAbi(address, cachePath);

  if (!abi || typeof abi.map != "function") {
    const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API_KEY}`;
    const response = await http(url);
    const json = await response.text();
    abi = JSON.parse(json)["result"];
    await cacheAbi(address, cachePath, abi);
  }

  return new ethers.Contract(address, abi, provider);
};

async function getCache(cachePath) {
  if (cachePath) {
    const fullPath = `${homePath}/${cachePath}`;

    if (fs.existsSync(fullPath)) {
      const rawJSON = await fsp.readFile(fullPath);
      return JSON.parse(rawJSON);
    }
  }

  return null;
}

async function getCachedAbi(address, cachePath) {
  const cachedJSON = await getCache(cachePath);

  if (cachedJSON) {
    return cachedJSON[address];
  }

  return null;
}

async function cacheAbi(address, cachePath, abi) {
  const oldCachedJSON = await getCache(cachePath);
  let newCache = {};

  if (oldCachedJSON) {
    newCache = oldCachedJSON
  }

  newCache[address] = abi;
  const fullPath = `${homePath}/${cachePath}`;
  await fsp.writeFile(fullPath, JSON.stringify(newCache));
}
