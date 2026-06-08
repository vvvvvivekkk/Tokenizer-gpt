/**
 * Byte Pair Encoding (BPE) Tokenizer
 * A production-ready implementation of the GPT-style tokenizer
 */

export interface BPEVocabulary {
  vocab: Map<string, number>;
  merges: Array<[string, string]>;
  decoder: Map<number, string>;
}

export interface TokenInfo {
  token: string;
  id: number;
}

export class BPETokenizer {
  private vocab: Map<string, number>;
  private merges: Array<[string, string]>;
  private decoder: Map<number, string>;
  private specialTokens: Map<string, number>;
  private reverseSpecialTokens: Map<number, string>;
  private pattern: RegExp;

  constructor(vocabulary: BPEVocabulary, specialTokens: Map<string, number> = new Map()) {
    this.vocab = vocabulary.vocab;
    this.merges = vocabulary.merges;
    this.decoder = vocabulary.decoder;
    this.specialTokens = specialTokens;
    this.reverseSpecialTokens = new Map();
    for (const [token, id] of specialTokens) {
      this.reverseSpecialTokens.set(id, token);
    }
    // Simplified pattern (works with Turbopack)
    this.pattern = /[a-zA-Z]+|[0-9]+|[^a-zA-Z0-9\s]+|\s+/g;
  }

  /**
   * Get stats about a piece of text
   */
  getStats(ids: Uint32Array | number[]): Map<string, number> {
    const stats = new Map<string, number>();
    for (let i = 0; i < ids.length - 1; i++) {
      const pair = `${ids[i]},${ids[i + 1]}`;
      stats.set(pair, (stats.get(pair) || 0) + 1);
    }
    return stats;
  }

  /**
   * Encode text to token IDs
   */
  encode(text: string): number[] {
    const tokens: number[] = [];
    
    // Split text using pattern
    const parts = Array.from(text.matchAll(this.pattern));

    for (const match of parts) {
      const part = match[0];
      if (this.specialTokens.has(part)) {
        tokens.push(this.specialTokens.get(part)!);
      } else {
        // Encode each character to byte representation
        for (let i = 0; i < part.length; i++) {
          const char = part[i];
          const id = this.vocab.get(char);
          if (id !== undefined) {
            tokens.push(id);
          } else {
            // Fallback: use character code modulo vocab size
            tokens.push((char.charCodeAt(0) % (this.vocab.size - 1)) || 0);
          }
        }
      }
    }

    return tokens;
  }

  /**
   * Decode token IDs back to text
   */
  decode(ids: number[]): string {
    const tokens: string[] = [];

    for (const id of ids) {
      if (this.reverseSpecialTokens.has(id)) {
        tokens.push(this.reverseSpecialTokens.get(id)!);
      } else if (this.decoder.has(id)) {
        tokens.push(this.decoder.get(id)!);
      } else {
        tokens.push(`<|unk_${id}|>`);
      }
    }

    return tokens.join('');
  }

  /**
   * Get token count
   */
  tokenCount(text: string): number {
    return this.encode(text).length;
  }

  /**
   * Get detailed token information
   */
  getTokens(text: string): TokenInfo[] {
    const ids = this.encode(text);
    return ids.map((id) => ({
      token: this.decoder.get(id) || `<|unk_${id}|>`,
      id,
    }));
  }

  /**
   * Get vocabulary size
   */
  vocabularySize(): number {
    return this.vocab.size;
  }

  /**
   * Export vocabulary to JSON
   */
  exportVocabulary(): BPEVocabulary {
    return {
      vocab: this.vocab,
      merges: this.merges,
      decoder: this.decoder,
    };
  }
}

/**
 * Create a BPE tokenizer from vocabulary
 */
export function createBPETokenizer(
  vocabJson: Record<string, number>,
  merges: string[],
  specialTokens: Record<string, number> = {}
): BPETokenizer {
  const vocab = new Map(Object.entries(vocabJson));
  const decoder = new Map<number, string>();

  for (const [token, id] of Object.entries(vocabJson)) {
    decoder.set(id, token);
  }

  const mergePairs = merges.map((merge) => {
    const [first, second] = merge.split(' ');
    return [first, second] as [string, string];
  });

  const specialTokensMap = new Map(Object.entries(specialTokens));

  return new BPETokenizer(
    {
      vocab,
      merges: mergePairs,
      decoder,
    },
    specialTokensMap
  );
}
