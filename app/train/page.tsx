'use client';

import { useState } from 'react';
import { TextInput } from '@/components/features/TextInput';

export default function TrainPage() {
  const [corpus, setCorpus] = useState('');
  const [modelName, setModelName] = useState('');
  const [vocabSize, setVocabSize] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrain = async () => {
    if (!corpus.trim() || !modelName.trim()) {
      setError('Please provide both corpus and model name');
      return;
    }

    if (corpus.length < 100) {
      setError('Corpus must be at least 100 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          corpus,
          modelName,
          vocabSize,
        }),
      });

      if (!response.ok) {
        throw new Error('Training failed');
      }

      const data = await response.json();
      setResult(data.model);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Training failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const dataStr = JSON.stringify(result, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${result.name}.json`;
      link.click();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Train Tokenizer</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Model Name</label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="e.g., My Custom Tokenizer"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Vocabulary Size</label>
            <input
              type="number"
              value={vocabSize}
              onChange={(e) => setVocabSize(Number(e.target.value))}
              min={256}
              max={100000}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          <TextInput
            value={corpus}
            onChange={setCorpus}
            placeholder="Enter your training corpus (at least 100 characters)..."
            maxLength={10000000}
          />

          <button
            onClick={handleTrain}
            disabled={loading || !corpus.trim() || !modelName.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
          >
            {loading ? 'Training...' : 'Train Tokenizer'}
          </button>

          {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}
        </div>

        {result && (
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4">Training Complete</h2>
              <div className="space-y-2 mb-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Model Name</span>
                  <p className="font-semibold">{result.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Vocabulary Size</span>
                  <p className="font-semibold">{result.vocabSize.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Model ID</span>
                  <p className="font-mono text-xs break-all">{result.id}</p>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Download Model
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
