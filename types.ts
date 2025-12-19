
export enum ClassificationType {
  SPAM = 'SPAM',
  LEGITIMATE = 'LEGITIMATE',
  PHISHING = 'PHISHING'
}

export interface SpamFeatures {
  urgencyLevel: number; // 0-10
  suspiciousLinks: boolean;
  grammarQuality: number; // 0-10 (10 is perfect)
  financialPromises: boolean;
  senderAnonymity: number; // 0-10
}

export interface ClassificationResult {
  id: string;
  timestamp: number;
  content: string;
  classification: ClassificationType;
  confidence: number;
  reasoning: string[];
  features: SpamFeatures;
}

export interface AppState {
  history: ClassificationResult[];
  isAnalyzing: boolean;
  currentResult: ClassificationResult | null;
}
