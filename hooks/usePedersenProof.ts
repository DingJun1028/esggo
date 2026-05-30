import { useState, useCallback } from 'react';
import { 
  generateCommitment, 
  verifyCommitment, 
  verifyHomomorphicSum, 
  aggregateCommitments,
  PedersenCommitment 
} from '@/lib/crypto/pedersen-core';

/**
 * 🔗 usePedersenProof Hook
 * 提供 React 元件使用的 Pedersen 承諾操作介面。
 * 用於實作「深度刻印 (Deep Engraving)」與同態加總驗證。
 */
export function usePedersenProof() {
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * 封印單一數值
   */
  const sealValue = useCallback(async (value: number) => {
    setIsProcessing(true);
    try {
      const commitment = await generateCommitment(value);
      return commitment;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  /**
   * 驗證單一封印
   */
  const verifySeal = useCallback((commitment: string, value: number, blindingFactor: string) => {
    return verifyCommitment(commitment, value, blindingFactor);
  }, []);

  /**
   * 驗證多個子項目的總和是否與總額承諾相符
   */
  const verifySum = useCallback((childCommitments: string[], totalCommitment: string) => {
    return verifyHomomorphicSum(childCommitments, totalCommitment);
  }, []);

  /**
   * 自動生成聚合承諾 (用於第三方驗證場景)
   */
  const calculateAggregate = useCallback((commitments: string[]) => {
    return aggregateCommitments(commitments);
  }, []);

  return {
    sealValue,
    verifySeal,
    verifySum,
    calculateAggregate,
    isProcessing
  };
}
