'use client';

import { useState, useEffect } from 'react';
import { TextInput } from '@/components/features/TextInput';
import { formatCurrency } from '@/lib/tokenizer';

interface ModelComparison {
  model: string;
  tokenCount: number;
  estimatedCost: number;
}

export default function ComparePage() {
  const [text, setText] = useState('');
  const [comparisons, setComparisons] = useState<ModelComparison[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const models = ['gpt-4o', 'gpt-4', 'gpt-3.5-turbo', 'claude-3-opus'];
      const results: ModelComparison[] = [];

      for (const model of models) {
        const response = await fetch('/api/tokenize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, modelId: model }),
        });

        if (response.ok) {
          const data = await response.json();
          results.push({
            model,
            tokenCount: data.tokenCount,
            estimatedCost: data.cost.estimatedInputCost,
          });
        }
      }

      setComparisons(results);
    } catch (error) {
      console.error('Comparison failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Compare Tokenizers</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TextInput
            value={text}
            onChange={setText}
            placeholder="Enter text to compare tokenizers..."
            maxLength={100000}
          />

          <button
            onClick={handleCompare}
            disabled={loading || !text.trim()}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
          >
            {loading ? 'Comparing...' : 'Compare'}
          </button>
        </div>

        {comparisons.length > 0 && (
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4">Results</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left font-semibold py-2">Model</th>
                      <th className="text-right font-semibold py-2">Tokens</th>
                      <th className="text-right font-semibold py-2">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((comp) => (
                      <tr key={comp.model} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-2 font-medium capitalize">{comp.model}</td>
                        <td className="text-right">{comp.tokenCount.toLocaleString()}</td>
                        <td className="text-right text-blue-600 font-semibold">
                          {formatCurrency(comp.estimatedCost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
