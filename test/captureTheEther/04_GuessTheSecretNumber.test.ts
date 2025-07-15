import { ethers } from "hardhat";
import { expect } from "chai";
import { keccak256, toBeHex } from "ethers";

describe("CaptureTheEther - GuessTheSecretNumberChallenge", function () {
  it("Should solve by brute-forcing the keccak256 hash", async function () {
    const [player] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("GuessTheSecretNumberChallenge");
    const challenge = await Factory.connect(player).deploy({
      value: ethers.parseEther("1"),
    });
    await challenge.waitForDeployment();

    // Brute-force the answer
    const targetHash = "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365";
    let answer = -1;

    for (let i = 0; i < 256; i++) {
      const hash = keccak256(toBeHex(i, 1)); // 1-byte encoding
      if (hash === targetHash) {
        answer = i;
        break;
      }
    }

    if (answer === -1) throw new Error("Answer not found!");

    await challenge.connect(player).guess(answer, {
      value: ethers.parseEther("1"),
    });

    expect(await challenge.isComplete()).to.be.true;
  });
});
