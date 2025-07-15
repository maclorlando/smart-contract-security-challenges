# 🛡️ Smart Contract Security Challenges – Ethernaut & Capture the Ether

This repository contains solutions to selected **smart contract security challenges** from [Ethernaut](https://ethernaut.openzeppelin.com/) and [Capture the Ether](https://capturetheether.com/).

These exercises demonstrate how to identify and exploit common vulnerabilities in Solidity contracts, such as reentrancy, integer overflows, delegatecall misuse, and more.

---

## 📋 Overview

✅ Original challenge contracts (unaltered)  
✅ Hardhat test files demonstrating exploits  
✅ Optional helper “Solver” contracts to assist with complex scenarios

Each solution:
- Deploys the vulnerable contract
- Executes the exploit step-by-step
- Verifies the success condition

---

## 📜 Notes

- The **Ethernaut** challenges interact with simulated levels based on original Ethernaut contracts.
- The **Capture the Ether** challenges are ported locally based on the [CaptureTheEtherHardhat](https://github.com/nicobevilacqua/CaptureTheEtherHardhat) project.
- Tests are written to simulate exploiting vulnerable contracts and achieving the goal state.

Each solution includes:
- The original **challenge contract** (unaltered),
- A **Hardhat test** file that demonstrates the exploit,
- In some cases, a **Solver contract** to assist with the exploit logic.

All solutions are verified by calling final state-checking functions like `isComplete()` or asserting changes in contract ownership.

---

## 🔧 Project Structure

- `contracts/`:  
  - Challenge contracts (copied as-is)  
  - Custom **solver contracts** where needed

- `test/ethernaut/`:  
  - Test files for Ethernaut challenges

- `test/captureTheEther/`:  
  - Test files for Capture the Ether challenges

---

## ✅ Ethernaut Challenges

### 📞 Level 4 – Telephone
- **Vulnerability:** Uses `tx.origin` instead of `msg.sender` to validate ownership.
- **Exploit:** We deploy a contract that calls `Telephone.changeOwner()`. Because `msg.sender` will now be the contract (not the EOA), `tx.origin != msg.sender`, and ownership transfer is allowed.

### 🪙 Level 5 – Token
- **Vulnerability:** Underflow in `transfer()` before SafeMath was standard.
- **Exploit:** We transfer more tokens than we own, causing the sender’s balance to underflow to a huge value due to `uint256` wraparound. This gives us millions of tokens instantly.

### 🪜 Level 10 – Reentrancy
- **Vulnerability:** `withdraw()` calls `msg.sender.call.value()` before updating the user’s balance.
- **Exploit:** A contract re-enters `withdraw()` multiple times before the balance is updated, draining the entire contract.

### 🏢 Level 11 – Elevator
- **Vulnerability:** Relies on a user-supplied contract's `isLastFloor()` response without verifying its accuracy.
- **Exploit:** Our malicious contract returns `false` once and then `true`, tricking the contract into thinking it reached the top floor.

### ⛓️ Level 15 – NaughtCoin
- **Vulnerability:** `transfer()` is locked by a time restriction, but `transferFrom()` is not.
- **Exploit:** We use `approve()` and `transferFrom()` to transfer all tokens, bypassing the lock.

### 💀 Level 17 – Recovery
- **Vulnerability:** Tokens deployed via a factory contract have predictable addresses.
- **Exploit:** We compute the token contract's address using the deployer’s address and nonce, then call `selfdestruct()` to recover leftover ETH.

### 🛍️ Level 21 – Shop
- **Vulnerability:** External `Buyer` contract determines item price and floor logic using a faulty `>=` check.
- **Exploit:** We return a fake price that satisfies the condition, changing our response after the first call to manipulate behavior.

---

## ✅ Capture the Ether Challenges

### 🔢 Guess the Number
- **Vulnerability:** The number is hardcoded to `42` in the contract.
- **Exploit:** Just submit `42` using the contract’s `guess()` function.

### 🧮 Guess the Random Number
- **Vulnerability:** Relies on `blockhash(block.number - 1)` which is predictable.
- **Exploit:** Use Hardhat to simulate the same environment and compute the same hash-based random number.

### 🎲 Guess the New Number
- **Vulnerability:** Uses `now` and `blockhash` to generate number.
- **Exploit:** Lock in the guess and then mine a block locally until the generated number matches your guess.

### 🔐 Guess the Secret Number
- **Vulnerability:** The number is stored in contract storage.
- **Exploit:** Use `ethers.provider.getStorageAt()` to read the secret number directly.

### ⏳ Predict the Future
- **Vulnerability:** Outcome depends on future block hash.
- **Exploit:** Lock in a guess, then mine blocks until the result matches and settle the guess.

### ⛓️ Predict the Block Hash
- **Vulnerability:** `blockhash(blockNumber)` returns `0x0` if queried after 256 blocks.
- **Exploit:** Wait 257+ blocks and then guess `0x0`.

### 🏦 Token Bank
- **Vulnerability:** Reentrancy in withdraw.
- **Exploit:** Create a contract that calls `withdraw()` recursively to empty all funds.

### 💰 Token Sale
- **Vulnerability:** `numTokens * 1 ether` overflows due to no SafeMath.
- **Exploit:** We send a small amount of ETH but use a large `numTokens` value so the multiplication overflows and the contract thinks we paid enough.

### 🐋 Token Whale
- **Vulnerability:** No check on `from != to` in `transferFrom()`.
- **Exploit:** Repeatedly call `transferFrom(player, player, 1)` which bypasses checks and causes overflow in `balanceOf[player]`.

---

## 🧪 How Tests Prove Exploits Work

Each test:
- Deploys the unaltered challenge contract
- Uses a helper contract (if needed) to simulate the attack
- Asserts that the goal condition is met (`isComplete() == true` or balance/ownership check)

---

## 🧰 Running the Tests

Install dependencies and run:

```bash
npm install
npx hardhat test
```

All challenges will run and report pass/fail status.

---

## 📝 Notes

- Solidity version and environment are chosen to match challenge behavior.
- No contract logic was modified.
- Exploits demonstrate real-world issues like reentrancy, unchecked math, storage exposure, and contract logic flaws.

This project provides a hands-on approach to mastering smart contract security through practical, verifiable exploits.
