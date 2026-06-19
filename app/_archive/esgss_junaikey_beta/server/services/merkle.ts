import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

class MerkleService {
  /**
   * Generate Merkle Tree from a list of data strings (e.g. Report IDs or JSON hashes)
   * @param {string[]} dataArray
   * @returns {MerkleTree}
   */
  generateTree(dataArray) {
    // Hash leaves using keccak256
    const leaves = dataArray.map(x => keccak256(x));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    return tree;
  }

  /**
   * Get Root Hash as Hex String
   * @param {MerkleTree} tree
   * @returns {string} 0x...
   */
  getRoot(tree) {
    return tree.getHexRoot();
  }

  /**
   * Generate Proof for a specific item
   * @param {MerkleTree} tree
   * @param {string} item
   * @returns {string[]} Array of hex proofs
   */
  getProof(tree, item) {
    const leaf = keccak256(item);
    return tree.getHexProof(leaf);
  }

  /**
   * Verify a proof locally
   * @param {string} root
   * @param {string} item
   * @param {string[]} proof
   * @returns {boolean}
   */
  verify(root, item, proof) {
    const leaf = keccak256(item);
    const tree = new MerkleTree([], keccak256, { sortPairs: true }); // Empty tree helper
    return tree.verify(proof, leaf, root);
  }
}

export default new MerkleService();
