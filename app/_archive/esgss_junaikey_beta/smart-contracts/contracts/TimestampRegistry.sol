// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TimestampRegistry
 * @dev A simple smart contract to anchor data hashes on the blockchain.
 * It acts as a decentralized notary, providing a tamper-proof timestamp
 * for any given piece of data.
 * Only the owner of the contract can anchor new hashes.
 */
contract TimestampRegistry is Ownable {
    // Event emitted when a new hash is anchored
    event Anchored(bytes32 indexed dataHash, uint256 timestamp);

    // Mapping from a data hash to the timestamp it was anchored
    mapping(bytes32 => uint256) public timestamps;

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Anchors a data hash to the blockchain.
     * Records the block timestamp for the given hash.
     * Can only be called by the owner.
     * @param dataHash The SHA-256 hash of the data to be anchored.
     */
    function anchor(bytes32 dataHash) public onlyOwner {
        // Require that the hash has not been anchored before to save gas and prevent replay.
        require(timestamps[dataHash] == 0, "TimestampRegistry: Hash already anchored.");

        uint256 currentTime = block.timestamp;
        timestamps[dataHash] = currentTime;
        
        emit Anchored(dataHash, currentTime);
    }
}
