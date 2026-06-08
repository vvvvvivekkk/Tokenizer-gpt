/**
 * Tokenizer utilities for statistics and cost estimation
 */

export interface TokenStatistics {
  tokenCount: number;
  characterCount: number;
  wordCount: number;
  compressionRatio: number;
  averageTokenLength: number;
}

export interface CostEstimate {
  model: string;
  inputCostPer1kTokens: number;
  outputCostPer1kTokens: number;
  estimatedInputCost: number;
  estimatedOutputCost: number;
  totalEstimatedCost: number;
}

export const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  'claude-3-opus': { input: 0.015, output: 0.075 },
  'claude-3-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-haiku': { input: 0.00025, output: 0.00125 },
};

/**
 * Calculate token statistics
 */
export function getTokenStatistics(
  text: string,
  tokenCount: number
): TokenStatistics {
  const characterCount = text.length;
  const wordCount = text.trim().split(/\s+/).length;
  const compressionRatio = (1 - tokenCount / characterCount) * 100;
  const averageTokenLength = characterCount / tokenCount;

  return {
    tokenCount,
    characterCount,
    wordCount,
    compressionRatio: Math.round(compressionRatio * 100) / 100,
    averageTokenLength: Math.round(averageTokenLength * 100) / 100,
  };
}

/**
 * Estimate token cost for a given model
 */
export function estimateTokenCost(
  inputTokens: number,
  model: string = 'gpt-4o',
  outputTokens: number = 0
): CostEstimate {
  const cost = MODEL_COSTS[model] || MODEL_COSTS['gpt-4o'];

  const estimatedInputCost = (inputTokens / 1000) * cost.input;
  const estimatedOutputCost = (outputTokens / 1000) * cost.output;
  const totalEstimatedCost = estimatedInputCost + estimatedOutputCost;

  return {
    model,
    inputCostPer1kTokens: cost.input,
    outputCostPer1kTokens: cost.output,
    estimatedInputCost,
    estimatedOutputCost,
    totalEstimatedCost,
  };
}

/**
 * Estimate context window usage
 */
export function estimateContextUsage(
  inputTokens: number,
  model: string = 'gpt-4'
): { usedTokens: number; remainingTokens: number; percentageUsed: number } {
  const contextWindows: Record<string, number> = {
    'gpt-4': 8192,
    'gpt-4-turbo': 128000,
    'gpt-4o': 128000,
    'gpt-3.5-turbo': 4096,
    'claude-3-opus': 200000,
    'claude-3-sonnet': 200000,
    'claude-3-haiku': 200000,
  };

  const contextSize = contextWindows[model] || 4096;
  const usedTokens = Math.min(inputTokens, contextSize);
  const remainingTokens = Math.max(0, contextSize - inputTokens);
  const percentageUsed = (usedTokens / contextSize) * 100;

  return {
    usedTokens,
    remainingTokens,
    percentageUsed: Math.round(percentageUsed * 100) / 100,
  };
}

/**
 * Format number as currency
 */
export function formatCurrency(value: number): string {
  if (value === 0) return '$0.00';
  if (value < 0.00001) return `$${value.toExponential(2)}`;
  return `$${value.toFixed(6)}`;
}

/**
 * Format bytes
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
