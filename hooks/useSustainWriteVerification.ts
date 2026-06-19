import { useState, useCallback, useEffect } from 'react';

interface VerificationResult {
  isTrustworthy: boolean;
  score: number;
  missingIndicators: string[];
  feedback: string[];
  hashLock?: string;
}

export function useSustainWriteVerification(initialContent: string = '') {
  const [content, setContent] = useState(initialContent);
  const [result, setResult] = useState<VerificationResult>({
    isTrustworthy: false,
    score: 0,
    missingIndicators: [],
    feedback: [],
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyText = useCallback(async (text: string) => {
    setIsVerifying(true);
    // Simulate real-time 5T Verification (Truth & Goodness)
    // In a real implementation, this would call a server action or local NLP model
    
    // Simple heuristic-based verification for demonstration
    const griIndicators = ['GRI-302', 'GRI-305', 'GRI-401', 'GRI-403'];
    const foundIndicators = griIndicators.filter(indicator => text.includes(indicator));
    const missingIndicators = griIndicators.filter(indicator => !text.includes(indicator));
    
    let score = 0;
    const feedback: string[] = [];
    
    if (text.length > 500) score += 20;
    else feedback.push('內容字數過少，建議擴充以符合永續報告深度。');

    if (foundIndicators.length > 0) {
      score += foundIndicators.length * 20;
    } else {
      feedback.push('缺少標準 GRI 指標引用，建議加入對應的指標。');
    }
    
    // Truth validation (basic keyword check)
    const truthKeywords = ['數據來源', '查證', '第三方', '確信'];
    const hasTruth = truthKeywords.some(keyword => text.includes(keyword));
    if (hasTruth) {
      score += 20;
    } else {
      feedback.push('尚未提及數據查證來源，請補充以提升 Truth 等級。');
    }

    const isTrustworthy = score >= 80;
    
    // Trust/Transfer Hash-Lock simulation
    let hashLock;
    if (isTrustworthy) {
      // Create a dummy hash-lock for the trustworthy content
      hashLock = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    }

    setResult({
      isTrustworthy,
      score: Math.min(100, score),
      missingIndicators,
      feedback,
      hashLock
    });
    
    setIsVerifying(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      verifyText(content);
    }, 1000); // Debounce verification
    return () => clearTimeout(timer);
  }, [content, verifyText]);

  return {
    content,
    setContent,
    result,
    isVerifying,
    verifyText
  };
}
