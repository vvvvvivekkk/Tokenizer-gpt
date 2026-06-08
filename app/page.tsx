import Link from 'next/link';
import { BarChart3, Zap, BookOpen, FileText } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: 'Fast Tokenization',
      description: 'Instantly tokenize your text using industry-standard BPE algorithm',
      href: '/tokenize',
    },
    {
      icon: BarChart3,
      title: 'Compare Models',
      description: 'Compare tokenization across different LLM models',
      href: '/compare',
    },
    {
      icon: BookOpen,
      title: 'Train Custom',
      description: 'Train your own custom tokenizer on your corpus',
      href: '/train',
    },
    {
      icon: FileText,
      title: 'Chat Tokenizer',
      description: 'Analyze token usage in multi-turn conversations',
      href: '/chat',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          GPT-Style Tokenizer Platform
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Understand how LLMs break down text into tokens. Compare models, estimate costs, and train custom tokenizers.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/tokenize"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Get Started
          </Link>
          <Link
            href="/compare"
            className="bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 font-bold py-3 px-8 rounded-lg border border-blue-200 dark:border-blue-800 transition"
          >
            Compare Models
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition hover:scale-105"
              >
                <Icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">10M+</div>
            <p className="text-gray-600 dark:text-gray-400">Tokens Processed</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">7</div>
            <p className="text-gray-600 dark:text-gray-400">LLM Models</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <p className="text-gray-600 dark:text-gray-400">Free to Use</p>
          </div>
        </div>
      </section>
    </div>
  );
}
