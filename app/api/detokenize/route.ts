import { NextRequest, NextResponse } from 'next/server';
import { createBPETokenizer } from '@/lib/tokenizer';

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
    const { tokens } = await req.json();

    if (!Array.isArray(tokens)) {
      return NextResponse.json(
        { success: false, error: 'tokens must be an array' },
        { status: 400 }
      );
    }

    const tokenizer = createBPETokenizer(DEFAULT_VOCAB, [], {
      '<|endoftext|>': 52,
      '<|padding|>': 53,
    });

    const text = tokenizer.decode(tokens);

    return NextResponse.json({
      success: true,
      text,
      tokenCount: tokens.length,
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
