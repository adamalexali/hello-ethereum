//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// lets us use [[console.log]] to debug smart contracts
import "hardhat/console.sol";

contract HelloEthereum {
    uint256 totalInteractions;

    // used to generate a random number
    uint256 private seed;

    event NewInteraction(
        address indexed from,
        string message,
        uint256 timestamp
    );

    // structs are custom data types
    struct Interact {
        address actor; // the address of the user who interacted with the contract
        string message; // the message the user sent
        uint256 timestamp; // the timestand when the user interacted
    }

    Interact[] interactions;

    // mapping(address => uint256) public lastInteractedAt;

    // looks like a JS Class!
    constructor() payable {
        console.log("Hello, I'm a smart contract!");

        seed = (block.timestamp + block.difficulty) % 100;
    }

    function interact(string memory _message) public {
        // make sure timestamp is at least 15 minutes apart
        // require(
        //     lastInteractedAt[msg.sender] + 5 minutes < block.timestamp,
        //     "Wait 5 minutes."
        // );

        // lastInteractedAt[msg.sender] = block.timestamp;

        totalInteractions += 1;
        console.log("%s was here!", msg.sender);

        // storing the interaction data in the array
        interactions.push(Interact(msg.sender, _message, block.timestamp));

        seed = (block.difficulty + block.timestamp + seed) % 100;

        if (seed <= 5) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewInteraction(msg.sender, _message, block.timestamp);
    }

    function getAllInteractions() public view returns (Interact[] memory) {
        return interactions;
    }

    function getTotalInteractions() public view returns (uint256) {
        return totalInteractions;
    }
}
