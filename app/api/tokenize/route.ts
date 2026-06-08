import { NextRequest, NextResponse } from 'next/server';
import { createBPETokenizer, getTokenStatistics, estimateTokenCost } from '@/lib/tokenizer';
import { z } from 'zod';

const tokenizeSchema = z.object({
  text: z.string().min(1).max(1000000),
  modelId: z.string().optional().default('default'),
});

// Default GPT-4o-like vocabulary (simplified)
const DEFAULT_VOCAB: Record<string, number> = {
  ' ': 0,
  'a': 1,
  'b': 2,
  'c': 3,
  'd': 4,
  'e': 5,
  'f': 6,
  'g': 7,
  'h': 8,
  'i': 9,
  'j': 10,
  'k': 11,
  'l': 12,
  'm': 13,
  'n': 14,
  'o': 15,
  'p': 16,
  'q': 17,
  'r': 18,
  's': 19,
  't': 20,
  'u': 21,
  'v': 22,
  'w': 23,
  'x': 24,
  'y': 25,
  'z': 26,
  '0': 27,
  '1': 28,
  '2': 29,
  '3': 30,
  '4': 31,
  '5': 32,
  '6': 33,
  '7': 34,
  '8': 35,
  '9': 36,
  '.': 37,
  ',': 38,
  '!': 39,
  '?': 40,
  '"': 41,
  "'": 42,
  '-': 43,
  ':': 44,
  ';': 45,
  '(': 46,
  ')': 47,
  '[': 48,
  ']': 49,
  '{': 50,
  '}': 51,
  '<|endoftext|>': 52,
  '<|padding|>': 53,
  '<|unk|>': 54,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, modelId } = tokenizeSchema.parse(body);

    // Create tokenizer with default vocabulary
    const tokenizer = createBPETokenizer(DEFAULT_VOCAB, [], {
      '<|endoftext|>': 52,
      '<|padding|>': 53,
    });

    // Tokenize
    const tokens = tokenizer.encode(text);
    const stats = getTokenStatistics(text, tokens.length);
    const cost = estimateTokenCost(tokens.length, modelId || 'gpt-4o');

    return NextResponse.json({
      success: true,
      tokens,
      tokenCount: tokens.length,
      stats,
      cost,
      model: modelId || 'gpt-4o',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues[0]?.message || 'Validation error';
      return NextResponse.json(
        { success: false, error: message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
