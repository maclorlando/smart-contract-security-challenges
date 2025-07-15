import { ethers } from "hardhat";
import { expect } from "chai";
import { GuessTheNumberChallenge } from "../../typechain-types"; // ✅ if needed

describe("CaptureTheEther - GuessTheNumberChallenge", function () {
  it("Should solve the challenge by guessing 42", async function () {
    const [player] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("GuessTheNumberChallenge");
    const challenge = await Factory.connect(player).deploy({
      value: ethers.parseEther("1")
    }) as GuessTheNumberChallenge;

    await challenge.waitForDeployment();

    await challenge.connect(player).guess(42, { value: ethers.parseEther("1") });

    const balance = await ethers.provider.getBalance(await challenge.getAddress());
    expect(balance).to.equal(0n);
  });
});
