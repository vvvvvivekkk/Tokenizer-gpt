'use client';

interface StatisticsProps {
  stats: {
    tokenCount: number;
    characterCount: number;
    wordCount: number;
    compressionRatio: number;
    averageTokenLength: number;
  };
}

export function Statistics({ stats }: StatisticsProps) {
  const items = [
    { label: 'Tokens', value: stats.tokenCount.toLocaleString() },
    { label: 'Characters', value: stats.characterCount.toLocaleString() },
    { label: 'Words', value: stats.wordCount.toLocaleString() },
    { label: 'Compression', value: `${stats.compressionRatio}%` },
    { label: 'Avg Length', value: `${stats.averageTokenLength.toFixed(2)} chars` },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">Statistics</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
