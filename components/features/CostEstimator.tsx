'use client';

import { useEffect, useState } from 'react';
import { estimateTokenCost, formatCurrency } from '@/lib/tokenizer';

interface CostEstimatorProps {
  model: string;
  tokenCount: number;
}

export function CostEstimator({ model, tokenCount }: CostEstimatorProps) {
  const [cost, setCost] = useState<any>(null);

  useEffect(() => {
    const estimate = estimateTokenCost(tokenCount, model);
    setCost(estimate);
  }, [tokenCount, model]);

  if (!cost) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">Cost Estimate</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Model</span>
          <span className="font-semibold capitalize">{cost.model}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Input Tokens</span>
          <span className="font-semibold">{tokenCount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Cost per 1K</span>
          <span className="font-semibold">{formatCurrency(cost.inputCostPer1kTokens)}</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Total Cost</span>
            <span className="font-bold text-blue-600">{formatCurrency(cost.estimatedInputCost)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
