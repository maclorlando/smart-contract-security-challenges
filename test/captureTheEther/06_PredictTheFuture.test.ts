import { ethers } from "hardhat";
import { expect } from "chai";
import { network } from "hardhat";

beforeEach(async () => {
  await network.provider.send("hardhat_reset");
});

describe("CaptureTheEther - PredictTheFutureChallenge", function () {
  it("Should win the challenge when prediction matches", async function () {
    const [player] = await ethers.getSigners();

    const Challenge = await ethers.getContractFactory("PredictTheFutureChallenge");
    const challenge = await Challenge.connect(player).deploy({ value: ethers.parseEther("1") });
    await challenge.waitForDeployment();

    const Solver = await ethers.getContractFactory("PredictTheFutureSolver");
    const solver = await Solver.connect(player).deploy(await challenge.getAddress(), { value: ethers.parseEther("1") });
    await solver.waitForDeployment();

    // Attempt settle in loop until correct guess
    for (let i = 0; i < 100; i++) {
      const tx = await solver.connect(player).attemptSettle();
      await tx.wait();

      if (await challenge.isComplete()) {
        break;
      }

      // Force a new block
      await ethers.provider.send("evm_mine", []);
    }

    expect(await challenge.isComplete()).to.be.true;
  });
});
