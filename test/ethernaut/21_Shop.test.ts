import { ethers } from "hardhat";
import { expect } from "chai";

describe("Ethernaut 21 - Shop", function () {
  it("Should spoof price and trick Shop", async function () {
    const [attacker] = await ethers.getSigners();

    const ShopFactory = await ethers.getContractFactory("Shop");
    const shop = await ShopFactory.deploy();
    await shop.waitForDeployment();

    const AttackFactory = await ethers.getContractFactory("ShopAttack");
    const attack = await AttackFactory.deploy(shop.target as string);
    await attack.waitForDeployment();

    await attack.connect(attacker).attack();

    const price = await shop.price();
    const isSold = await shop.isSold();

    expect(isSold).to.be.true;
    expect(price).to.be.lt(100);
  });
});
