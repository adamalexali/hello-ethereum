//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// lets us use [[console.log]] to debug smart contracts
import "hardhat/console.sol";

// looks like a JS Class!
contract HelloEther {
    uint256 totalInteracts;

    constructor() {
        console.log("Hello, I'm a smart contract!");
    }

    function interact() public {
        totalInteracts += 1;
        console.log("%s was here!", msg.sender);
    }

    function getTotalInteracts() public view returns (uint256) {
        console.log(
            "There have been %d interactions with this contract :)",
            totalInteracts
        );
        return totalInteracts;
    }
}
