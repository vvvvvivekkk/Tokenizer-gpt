import { NextRequest, NextResponse } from 'next/server';
import { trainTokenizer } from '@/lib/tokenizer';
import { z } from 'zod';

const trainSchema = z.object({
  corpus: z.string().min(100),
  vocabSize: z.number().min(256).max(100000).optional().default(10000),
  modelName: z.string().min(1).max(100),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { corpus, vocabSize, modelName } = trainSchema.parse(body);

    // Train tokenizer
    const vocabulary = await trainTokenizer(corpus, {
      vocabSize,
      minFrequency: 2,
      maxMerges: vocabSize - 256,
    });

    return NextResponse.json({
      success: true,
      model: {
        id: `model_${Date.now()}`,
        name: modelName,
        vocabSize,
        vocabulary: Object.fromEntries(vocabulary.vocab),
        merges: vocabulary.merges,
        trainingCompleted: new Date().toISOString(),
      },
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
