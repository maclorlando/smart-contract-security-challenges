import { ethers } from "hardhat";
import { expect } from "chai";

describe("Ethernaut 11 - Elevator", function () {
  it("Should reach the top floor using logic trick", async function () {
    const [attacker] = await ethers.getSigners();

    // Deploy Elevator
    const ElevatorFactory = await ethers.getContractFactory("Elevator");
    const elevator = await ElevatorFactory.deploy();
    await elevator.waitForDeployment();

    // Deploy attack contract
    const AttackFactory = await ethers.getContractFactory("ElevatorAttack");
    const attackContract = await AttackFactory.connect(attacker).deploy(elevator.target as string);
    await attackContract.waitForDeployment();

    // Run the attack
    await attackContract.connect(attacker).attack(42); // Floor number is arbitrary

    // Check if we reached the top
    const isTop = await elevator.top();
    expect(isTop).to.be.true;
  });
});
