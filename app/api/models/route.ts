import { NextRequest, NextResponse } from 'next/server';

const AVAILABLE_MODELS = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Latest GPT-4 Omni model',
    vocabSize: 128000,
    contextWindow: 128000,
    training: false,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Previous generation GPT-4 Turbo',
    vocabSize: 128000,
    contextWindow: 128000,
    training: false,
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Base GPT-4 model',
    vocabSize: 128000,
    contextWindow: 8192,
    training: false,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and cost-effective model',
    vocabSize: 50257,
    contextWindow: 4096,
    training: false,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Anthropic most capable model',
    vocabSize: 100000,
    contextWindow: 200000,
    training: false,
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Anthropic balanced model',
    vocabSize: 100000,
    contextWindow: 200000,
    training: false,
  },
  {
    id: 'custom',
    name: 'Custom Tokenizer',
    description: 'Train your own tokenizer',
    vocabSize: 50000,
    contextWindow: 4096,
    training: true,
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeStats = searchParams.get('stats') === 'true';

    let response = AVAILABLE_MODELS;

    if (includeStats) {
      response = AVAILABLE_MODELS.map((model) => ({
        ...model,
        stats: {
          usageCount: Math.floor(Math.random() * 10000),
          averageTokenCount: Math.floor(Math.random() * 500),
          lastUsed: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        },
      }));
    }

    return NextResponse.json({
      success: true,
      models: response,
      total: response.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
