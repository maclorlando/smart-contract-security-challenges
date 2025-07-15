import { ethers } from "hardhat";
import { expect } from "chai";

describe("CaptureTheEther - GuessTheRandomNumberChallenge", function () {
  it("Should guess the correct random number by reading storage", async function () {
    const [player] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("GuessTheRandomNumberChallenge");
    const challenge = await Factory.connect(player).deploy({ value: ethers.parseEther("1") });
    await challenge.waitForDeployment();

    // Read storage slot 0 where the answer is stored (this is valid for Solidity 0.4.x)
    const slot0 = await ethers.provider.getStorage(await challenge.getAddress(), 0);
    const answer = Number(slot0) & 0xff;

    await challenge.connect(player).guess(answer, {
      value: ethers.parseEther("1"),
    });

    const balance = await ethers.provider.getBalance(await challenge.getAddress());
    expect(balance).to.equal(0n);
  });
});
