'use client';

import { useState } from 'react';
import { ModelSelector } from '@/components/features/ModelSelector';
import { TextInput } from '@/components/features/TextInput';
import { TokenVisualization } from '@/components/features/TokenVisualization';
import { Statistics } from '@/components/features/Statistics';
import { CostEstimator } from '@/components/features/CostEstimator';

interface TokenResult {
  tokens: number[];
  tokenCount: number;
  stats: {
    tokenCount: number;
    characterCount: number;
    wordCount: number;
    compressionRatio: number;
    averageTokenLength: number;
  };
  cost: {
    model: string;
    estimatedInputCost: number;
  };
}

export default function TokenizePage() {
  const [text, setText] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [result, setResult] = useState<TokenResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTokenize = async () => {
    if (!text.trim()) {
      setError('Please enter some text to tokenize');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tokenize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, modelId: selectedModel }),
      });

      if (!response.ok) {
        throw new Error('Failed to tokenize');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-6">Tokenizer</h1>

          <div className="space-y-4">
            <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />

            <TextInput
              value={text}
              onChange={setText}
              placeholder="Enter text to tokenize..."
              maxLength={1000000}
            />

            <button
              onClick={handleTokenize}
              disabled={loading || !text.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
            >
              {loading ? 'Tokenizing...' : 'Tokenize'}
            </button>

            {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}

            {result && <TokenVisualization tokens={result.tokens} />}
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <Statistics stats={result.stats} />
              <CostEstimator model={selectedModel} tokenCount={result.tokenCount} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
