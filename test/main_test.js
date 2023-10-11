const expect = require("chai").expect;
const { main } = require("ethers-from-explorer");
var fs = require("fs");
const { ethers } = require("ethers");
const CONTRACT_ADDRESS = "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc";
const BLOCKCHAIN_URL = process.env.BLOCKCHAIN_URL;

const httpMock = (url) => {
  var abiMock = fs.readFileSync("./test/fixtures/v2_pair_abi.json", "utf8");
  return { text: () => abiMock };
};

let provider;
const TEST_CACHE_FILE = ".test-abi-cache.json"
const FULL_PATH = `${process.env.HOME}/${TEST_CACHE_FILE}`

describe("ethers.fromExplorer", async () => {
  beforeEach(async () => {
    provider = new ethers.providers.JsonRpcProvider(BLOCKCHAIN_URL);
  });

  afterEach(async () => {
    try {
      fs.unlinkSync(FULL_PATH)
    } catch {}
  });

  it("instantiates contract with a correct ABI", async () => {
    const contract = await ethers.fromExplorer(
      CONTRACT_ADDRESS,
      provider,
      false,
      httpMock
    );
    let result = await contract.token0();
    expect(result).to.eq("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
  });

  it("caches ABI responses to the target JSON file", async () => {
    expect(fs.existsSync(FULL_PATH)).to.eq(false)

    const contract = await ethers.fromExplorer(
      CONTRACT_ADDRESS,
      provider,
      TEST_CACHE_FILE,
      httpMock
    );

    expect(fs.existsSync(FULL_PATH)).to.eq(true)
    const rawCache = fs.readFileSync(FULL_PATH, "utf8");
    const cachedJSON = JSON.parse(rawCache)
    expect(typeof(cachedJSON[CONTRACT_ADDRESS])).to.eq("string")
    expect(cachedJSON['0x0000000000000000000000000000000000000000']).to.eq(undefined)
  });
});
