//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// lets us use [[console.log]] to debug smart contracts
import "hardhat/console.sol";

// looks like a JS Class!
contract HelloEther {
    constructor() {
        console.log("Hello, I'm a smart contract!");
    }
}
