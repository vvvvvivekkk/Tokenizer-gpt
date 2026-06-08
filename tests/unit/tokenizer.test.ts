import { describe, it, expect } from 'vitest';
import { BPETokenizer, createBPETokenizer, getTokenStatistics, estimateTokenCost } from '@/lib/tokenizer';

describe('BPE Tokenizer', () => {
  const vocab: Record<string, number> = {
    'h': 1,
    'e': 2,
    'l': 3,
    'o': 4,
    ' ': 5,
    'w': 6,
    'r': 7,
    'd': 8,
  };

  const tokenizer = createBPETokenizer(vocab, []);

  it('should encode text to tokens', () => {
    const tokens = tokenizer.encode('hello');
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });

  it('should decode tokens back to text', () => {
    const tokens = tokenizer.encode('hello');
    const decoded = tokenizer.decode(tokens);
    expect(typeof decoded).toBe('string');
  });

  it('should return correct token count', () => {
    const count = tokenizer.tokenCount('hello world');
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThan(0);
  });

  it('should get detailed token information', () => {
    const tokens = tokenizer.getTokens('hi');
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens[0]).toHaveProperty('token');
    expect(tokens[0]).toHaveProperty('id');
  });
});

describe('Token Statistics', () => {
  it('should calculate correct statistics', () => {
    const text = 'Hello world';
    const stats = getTokenStatistics(text, 2);
    
    expect(stats.tokenCount).toBe(2);
    expect(stats.characterCount).toBe(11);
    expect(stats.wordCount).toBe(2);
    expect(stats.compressionRatio).toBeGreaterThan(0);
  });
});

describe('Cost Estimation', () => {
  it('should estimate cost for GPT-4o', () => {
    const cost = estimateTokenCost(1000, 'gpt-4o');
    
    expect(cost.model).toBe('gpt-4o');
    expect(cost.inputCostPer1kTokens).toBe(0.005);
    expect(cost.estimatedInputCost).toBe(0.005);
  });

  it('should estimate cost for different models', () => {
    const models = ['gpt-4o', 'gpt-4', 'gpt-3.5-turbo'];
    const costs = models.map(model => estimateTokenCost(1000, model));
    
    // More expensive models should have higher costs
    expect(costs[1].estimatedInputCost).toBeGreaterThan(costs[0].estimatedInputCost);
  });
});
