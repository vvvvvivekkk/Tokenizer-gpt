'use client';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export function TextInput({ value, onChange, placeholder, maxLength }: TextInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Input Text
        </label>
        <span className="text-sm text-gray-500">
          {value.length} / {maxLength?.toLocaleString()}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
}
