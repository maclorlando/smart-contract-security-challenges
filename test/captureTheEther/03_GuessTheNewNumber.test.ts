import { ethers } from "hardhat";
import { expect } from "chai";

describe("CaptureTheEther - GuessTheNewNumberChallenge", function () {
  it("Should solve the challenge via helper contract", async function () {
    const [player] = await ethers.getSigners();

    // Deploy challenge contract with 1 ether
    const ChallengeFactory = await ethers.getContractFactory("GuessTheNewNumberChallenge");
    const challenge = await ChallengeFactory.connect(player).deploy({
      value: ethers.parseEther("1"),
    });
    await challenge.waitForDeployment();

    // Deploy the solver
    const SolverFactory = await ethers.getContractFactory("GuessTheNewNumberSolver");
    const solver = await SolverFactory.connect(player).deploy();
    await solver.waitForDeployment();

    // Wait one block so challenge and solver run on same block.number
    await ethers.provider.send("evm_mine", []);

    // Call the solver to execute the attack
    await solver.connect(player).solve(await challenge.getAddress(), {
      value: ethers.parseEther("1"),
    });

    // Confirm challenge is solved
    const balance = await ethers.provider.getBalance(await challenge.getAddress());
    expect(balance).to.equal(0n);
  });
});
