// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ESGRegistry
 * @dev Simple registry to anchor ESG data hashes for immutability.
 */
contract ESGRegistry {
    // Mapping from hash to boolean (existence)
    mapping(bytes32 => bool) public records;
    
    // Mapping from hash to timestamp
    mapping(bytes32 => uint256) public timestamps;

    event RecordRegistered(bytes32 indexed hash, address indexed sender, uint256 timestamp);

    /**
     * @dev Registers a new record hash.
     * @param hash The keccak256 hash of the ESG data or Merkle Root.
     */
    function registerRecord(bytes32 hash) public {
        require(!records[hash], "Record already exists");
        
        records[hash] = true;
        timestamps[hash] = block.timestamp;
        
        emit RecordRegistered(hash, msg.sender, block.timestamp);
    }

    /**
     * @dev Verifies if a record exists.
     * @param hash The hash to query.
     */
    function verifyRecord(bytes32 hash) public view returns (bool) {
        return records[hash];
    }
}
