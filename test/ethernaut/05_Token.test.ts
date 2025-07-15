import { ethers } from "hardhat";
import { expect } from "chai";

describe("Ethernaut 5 - Token", function () {
  it("Should transfer tokens successfully without underflow", async function () {
    const [attacker, receiver] = await ethers.getSigners();

    // Deploy Token contract with 20 tokens initial supply
    const TokenFactory = await ethers.getContractFactory("Token");
    const token = await TokenFactory.deploy(20);
    await token.waitForDeployment();

    // Check initial balance
    const initialBalance = await token.balanceOf(attacker.address);
    expect(initialBalance).to.equal(20);

    // Transfer 5 tokens to another address (valid transfer)
    await token.connect(attacker).transfer(receiver.address, 5);

    // Verify balances
    const attackerBalanceAfter = await token.balanceOf(attacker.address);
    const receiverBalanceAfter = await token.balanceOf(receiver.address);

    expect(attackerBalanceAfter).to.equal(15);
    expect(receiverBalanceAfter).to.equal(5);
  });
});
