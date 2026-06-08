/**
 * BPE Tokenizer Trainer
 * Trains a tokenizer from a text corpus
 */

import { BPEVocabulary } from './bpe';

export interface TrainingConfig {
  vocabSize: number;
  minFrequency: number;
  maxMerges: number;
}

export interface TrainingProgress {
  completed: number;
  total: number;
  currentMerge: number;
  mergeDescription: string;
}

export class BPETrainer {
  private config: TrainingConfig;
  private vocab: Map<string, number>;
  private merges: Array<[string, string]>;
  private frequencyMap: Map<string, number>;

  constructor(config: Partial<TrainingConfig> = {}) {
    this.config = {
      vocabSize: config.vocabSize || 50257,
      minFrequency: config.minFrequency || 2,
      maxMerges: config.maxMerges || 50000,
    };
    this.vocab = new Map();
    this.merges = [];
    this.frequencyMap = new Map();
  }

  /**
   * Train tokenizer from text corpus
   */
  async train(
    corpus: string,
    onProgress?: (progress: TrainingProgress) => void
  ): Promise<BPEVocabulary> {
    // Step 1: Create initial vocabulary (all bytes + special tokens)
    await this.initializeVocabulary();

    // Step 2: Split corpus into words
    const words = this.splitIntoWords(corpus);

    // Step 3: Build initial word frequency map
    this.buildFrequencyMap(words);

    // Step 4: Iteratively merge most frequent pairs
    let mergeCount = 0;
    const totalMerges = Math.min(this.config.maxMerges, this.config.vocabSize - 256);

    while (this.vocab.size < this.config.vocabSize && mergeCount < totalMerges) {
      const stats = this.getStats(words);

      if (stats.size === 0) break;

      const mostCommon = Array.from(stats.entries()).sort((a, b) => b[1] - a[1])[0];

      if (!mostCommon || mostCommon[1] < this.config.minFrequency) break;

      const [first, second] = mostCommon[0];
      const newToken = first + second;

      // Add new token to vocabulary
      const newId = this.vocab.size;
      this.vocab.set(newToken, newId);
      this.merges.push([first, second]);

      // Merge in words
      words.forEach((word) => {
        const newWord: string[] = [];
        for (let i = 0; i < word.length; i++) {
          if (i < word.length - 1 && word[i] === first && word[i + 1] === second) {
            newWord.push(newToken);
            i++; // Skip next element
          } else {
            newWord.push(word[i]);
          }
        }
        // Update the word in place is not possible with const, so recreate it
        Object.assign(word, newWord);
      });

      mergeCount++;
      if (onProgress && mergeCount % 100 === 0) {
        onProgress({
          completed: mergeCount,
          total: totalMerges,
          currentMerge: mergeCount,
          mergeDescription: `Merged "${first}" + "${second}" (frequency: ${mostCommon[1]})`,
        });
      }
    }

    // Create decoder map
    const decoder = new Map<number, string>();
    for (const [token, id] of this.vocab) {
      decoder.set(id, token);
    }

    return {
      vocab: this.vocab,
      merges: this.merges,
      decoder,
    };
  }

  /**
   * Initialize vocabulary with byte tokens
   */
  private async initializeVocabulary(): Promise<void> {
    // Add all single-byte tokens (0-255)
    for (let i = 0; i < 256; i++) {
      this.vocab.set(String.fromCharCode(i), i);
    }

    // Add special tokens
    const specialTokens = ['<|endoftext|>', '<|padding|>', '<|unk|>'];
    specialTokens.forEach((token, idx) => {
      this.vocab.set(token, 256 + idx);
    });
  }

  /**
   * Split text into words with frequencies
   */
  private splitIntoWords(corpus: string): string[][] {
    // Split by whitespace, keeping track of frequencies
    const words = corpus.split(/\s+/).filter((w) => w.length > 0);

    // Convert to initial character splits
    const result: string[][] = [];
    for (const word of words) {
      const chars = Array.from(word);
      chars[chars.length - 1] = chars[chars.length - 1] + '</w>'; // Mark end of word
      result.push(chars);
    }

    return result;
  }

  /**
   * Build frequency map of adjacent character pairs
   */
  private buildFrequencyMap(words: string[][]): void {
    for (const word of words) {
      for (let i = 0; i < word.length - 1; i++) {
        const pair = word[i] + word[i + 1];
        this.frequencyMap.set(pair, (this.frequencyMap.get(pair) || 0) + 1);
      }
    }
  }

  /**
   * Get statistics of adjacent pairs
   */
  private getStats(words: string[][]): Map<string, number> {
    const stats = new Map<string, number>();
    for (const word of words) {
      for (let i = 0; i < word.length - 1; i++) {
        const pair = word[i] + word[i + 1];
        stats.set(pair, (stats.get(pair) || 0) + 1);
      }
    }
    return stats;
  }
}

/**
 * Train tokenizer from corpus
 */
export async function trainTokenizer(
  corpus: string,
  config: Partial<TrainingConfig> = {},
  onProgress?: (progress: TrainingProgress) => void
): Promise<BPEVocabulary> {
  const trainer = new BPETrainer(config);
  return trainer.train(corpus, onProgress);
}
