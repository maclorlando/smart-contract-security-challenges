import { ethers, network } from "hardhat";
import { expect } from "chai";

describe("CaptureTheEther - PredictTheBlockHashChallenge", function () {
  it("Should win by guessing 0x0 after 256 blocks", async function () {
    const [player] = await ethers.getSigners();

    // Deploy the challenge contract
    const ChallengeFactory = await ethers.getContractFactory("PredictTheBlockHashChallenge");
    const challenge = await ChallengeFactory.connect(player).deploy({ value: ethers.parseEther("1") });
    await challenge.waitForDeployment();

    // Deploy the solver contract and lock in the guess
    const SolverFactory = await ethers.getContractFactory("PredictTheBlockHashSolver");
    const solver = await SolverFactory.connect(player).deploy(await challenge.getAddress(), {
      value: ethers.parseEther("1"),
    });
    await solver.waitForDeployment();

    // Advance 257 blocks to invalidate the blockhash
    for (let i = 0; i < 257; i++) {
      await network.provider.send("evm_mine");
    }

    // Settle the challenge
    await solver.connect(player).settleIfReady();

    // Expect the challenge to be complete
    const isComplete = await challenge.isComplete();
    expect(isComplete).to.be.true;
  });
});
