// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * ZKP 驗證智能合約
 * --------------------------------------------------
 * [標準] Groth16 zk-SNARK
 * [網路] Polygon (Mumbai Testnet / Mainnet)
 * [用途] 鏈上驗證 ZKP 證明
 * 
 * [4T 協議整合]
 * - T1 Traceable: 記錄所有驗證歷史
 * - T2 Trackable: 事件日誌追蹤
 * - T3 Tallyable: 公開驗證邏輯
 * - T4 Tamper-proof: 不可篡改的鏈上記錄
 */

interface IVerifier {
    function verifyProof(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[2] calldata _pubSignals
    ) external view returns (bool);
}

/**
 * ZKP 誠信驗證合約
 */
contract ZKPIntegrityVerifier {
    // Groth16 驗證器合約地址
    IVerifier public verifier;
    
    // 驗證記錄
    struct VerificationRecord {
        bytes32 dataHash;      // 數據雜湊
        uint256 threshold;     // 閾值
        uint256 timestamp;     // 驗證時間
        address verifier;      // 驗證者地址
        bool valid;            // 驗證結果
    }
    
    // 驗證歷史（dataHash => VerificationRecord[]）
    mapping(bytes32 => VerificationRecord[]) public verificationHistory;
    
    // 總驗證次數
    uint256 public totalVerifications;
    
    // 事件
    event ProofVerified(
        bytes32 indexed dataHash,
        address indexed verifier,
        bool valid,
        uint256 timestamp
    );
    
    event VerifierUpdated(
        address indexed oldVerifier,
        address indexed newVerifier
    );
    
    // 管理員
    address public admin;
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    constructor(address _verifier) {
        verifier = IVerifier(_verifier);
        admin = msg.sender;
    }
    
    /**
     * 驗證 ZKP 證明
     * 
     * @param _pA Proof point A
     * @param _pB Proof point B
     * @param _pC Proof point C
     * @param _dataHash 數據雜湊（公開輸入）
     * @param _threshold 閾值（公開輸入）
     * @return valid 驗證結果
     */
    function verifyProof(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        bytes32 _dataHash,
        uint256 _threshold
    ) external returns (bool valid) {
        // 構建公開信號
        uint[2] memory pubSignals = [
            uint256(_dataHash),
            _threshold
        ];
        
        // 調用 Groth16 驗證器
        valid = verifier.verifyProof(_pA, _pB, _pC, pubSignals);
        
        // 記錄驗證歷史
        verificationHistory[_dataHash].push(VerificationRecord({
            dataHash: _dataHash,
            threshold: _threshold,
            timestamp: block.timestamp,
            verifier: msg.sender,
            valid: valid
        }));
        
        totalVerifications++;
        
        // 發出事件
        emit ProofVerified(_dataHash, msg.sender, valid, block.timestamp);
        
        return valid;
    }
    
    /**
     * 批次驗證多個證明
     */
    function batchVerifyProofs(
        uint[2][] calldata _pA,
        uint[2][2][] calldata _pB,
        uint[2][] calldata _pC,
        bytes32[] calldata _dataHashes,
        uint256[] calldata _thresholds
    ) external returns (bool[] memory results) {
        require(
            _pA.length == _pB.length &&
            _pB.length == _pC.length &&
            _pC.length == _dataHashes.length &&
            _dataHashes.length == _thresholds.length,
            "Array length mismatch"
        );
        
        results = new bool[](_pA.length);
        
        for (uint i = 0; i < _pA.length; i++) {
            uint[2] memory pubSignals = [
                uint256(_dataHashes[i]),
                _thresholds[i]
            ];
            
            results[i] = verifier.verifyProof(
                _pA[i],
                _pB[i],
                _pC[i],
                pubSignals
            );
            
            // 記錄驗證歷史
            verificationHistory[_dataHashes[i]].push(VerificationRecord({
                dataHash: _dataHashes[i],
                threshold: _thresholds[i],
                timestamp: block.timestamp,
                verifier: msg.sender,
                valid: results[i]
            }));
            
            totalVerifications++;
            
            emit ProofVerified(
                _dataHashes[i],
                msg.sender,
                results[i],
                block.timestamp
            );
        }
        
        return results;
    }
    
    /**
     * 查詢驗證歷史
     */
    function getVerificationHistory(bytes32 _dataHash)
        external
        view
        returns (VerificationRecord[] memory)
    {
        return verificationHistory[_dataHash];
    }
    
    /**
     * 查詢最新驗證結果
     */
    function getLatestVerification(bytes32 _dataHash)
        external
        view
        returns (VerificationRecord memory)
    {
        VerificationRecord[] memory history = verificationHistory[_dataHash];
        require(history.length > 0, "No verification history");
        return history[history.length - 1];
    }
    
    /**
     * 更新驗證器合約地址
     */
    function updateVerifier(address _newVerifier) external onlyAdmin {
        address oldVerifier = address(verifier);
        verifier = IVerifier(_newVerifier);
        emit VerifierUpdated(oldVerifier, _newVerifier);
    }
    
    /**
     * 轉移管理員權限
     */
    function transferAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid address");
        admin = _newAdmin;
    }
}
