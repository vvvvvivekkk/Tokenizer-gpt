'use client';

import { useState } from 'react';
import Link from 'next/link';

const colors = [
  'bg-blue-100 text-blue-900',
  'bg-green-100 text-green-900',
  'bg-red-100 text-red-900',
  'bg-yellow-100 text-yellow-900',
  'bg-purple-100 text-purple-900',
  'bg-pink-100 text-pink-900',
  'bg-indigo-100 text-indigo-900',
  'bg-cyan-100 text-cyan-900',
];

interface TokenVisualizationProps {
  tokens: number[];
}

export function TokenVisualization({ tokens }: TokenVisualizationProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">Token Visualization</h2>
      <div className="flex flex-wrap gap-2">
        {tokens.map((tokenId, index) => (
          <div
            key={index}
            className={`relative ${colors[index % colors.length]} px-3 py-2 rounded cursor-pointer transition hover:scale-110`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span className="font-semibold">Token</span>
            {hoveredIndex === index && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                ID: {tokenId}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Total Tokens: <span className="font-bold">{tokens.length}</span>
      </div>
    </div>
  );
}
