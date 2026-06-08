# Student Guide to LLM Tokenization

## 🎓 What is Tokenization?

Tokenization is how AI models understand text. Large Language Models (LLMs) like GPT-4 don't read text character-by-character. Instead, they break text into **tokens** — small chunks that can be numbers, words, or parts of words.

### Simple Example

```
Text: "Hello world"
Tokens: ["Hello", " ", "world"]
Token IDs: [4, 0, 14]
```

Each token is converted to a unique ID that the model can process.

---

## 🔑 Key Concepts

### 1. Token ID
A unique number representing a token. For example:
- Token ID `4` = "Hello"
- Token ID `0` = " " (space)
- Token ID `14` = "world"

### 2. Vocabulary
A dictionary mapping tokens to IDs. Each model has a different vocabulary:
- GPT-4o: 128,000 tokens
- Claude: 100,000 tokens
- Custom: 1,000-100,000 tokens

### 3. Compression Ratio
How efficiently a model compresses text into tokens.

```
Compression Ratio = Character Count / Token Count

"Hello world" = 11 characters, 3 tokens
Ratio = 11 / 3 = 3.67 (good compression)
```

Lower ratio = more tokens = higher cost.

### 4. Context Window
Maximum tokens a model can process in one request.

```
GPT-4o: 128,000 tokens (can handle ~96,000 words)
GPT-4: 8,192 tokens (can handle ~6,000 words)
Claude: 200,000 tokens (can handle ~150,000 words)
```

---

## 💰 Why Tokenization Matters for Cost

You're charged **per token**, not per character!

### Cost Example

```
Prompt: "What is machine learning?"
GPT-4o pricing: $0.005 per 1,000 input tokens

Tokens used: 5
Cost: (5 / 1,000) * $0.005 = $0.000025 (0.0025 cents)
```

Longer text = More tokens = Higher cost.

### Comparing Models

```
Text: "Explain quantum computing in detail"

Model         Tokens    Cost per 1K    Total Cost
GPT-4o        8         $0.005         $0.00004
Claude        7         $0.015         $0.000105
GPT-3.5       9         $0.0005        $0.0000045
```

---

## 🤖 How Tokenization Works (BPE Algorithm)

The **Byte Pair Encoding (BPE)** algorithm works in 3 steps:

### Step 1: Start with Characters

```
Text: "hello"
Characters: ['h', 'e', 'l', 'l', 'o']
```

### Step 2: Find Common Pairs

```
Count pairs:
('h', 'e') = 1 time
('e', 'l') = 1 time
('l', 'l') = 1 time
('l', 'o') = 1 time

Most common: Tie, so pick one: ('l', 'l')
```

### Step 3: Merge Common Pairs

```
Before: ['h', 'e', 'l', 'l', 'o']
Merge: Replace ('l', 'l') with 'll'
After: ['h', 'e', 'll', 'o']
```

### Repeat

Keep merging until you reach desired vocabulary size.

```
Final: ['he', 'll', 'o']  OR  ['hel', 'lo']  (depends on merges)
```

---

## 📊 Examples & Visualization

### Example 1: Different Tokenization Styles

```
Text: "AI is amazing"

Character-level:
['A', 'I', ' ', 'i', 's', ' ', 'a', 'm', 'a', 'z', 'i', 'n', 'g']
Tokens: 13

Word-level:
['AI', 'is', 'amazing']
Tokens: 3

BPE (mixed):
['AI', ' ', 'is', ' ', 'am', 'az', 'ing']
Tokens: 7
```

### Example 2: Cost Comparison

Training a 10,000 token chatbot response:

```
Model         Tokens    Cost
GPT-4o        10,000    (10/1) * $0.015 = $0.15
GPT-3.5       12,000    (12/1) * $0.0015 = $0.018
Claude Opus   10,500    (10.5/1) * $0.075 = $0.7875

Cheapest: GPT-3.5 at $0.018
```

### Example 3: Context Usage

You have 8,000 token limit. How much space for your prompt?

```
System message: 100 tokens
User prompt: 500 tokens
Response space: 8,000 - 100 - 500 = 7,400 tokens available
```

---

## 🧪 Hands-On Experiments

### Experiment 1: Test Different Texts

Try tokenizing different types of text:

```
1. English: "The quick brown fox"
   → Likely fewer tokens

2. Numbers: "123456789"
   → Might be 1-2 tokens (efficient)

3. Code: "def hello(): pass"
   → More tokens (special characters)

4. Emoji: "😀🎉🚀"
   → Many tokens (Unicode)
```

**Goal**: Notice which text types are more efficient.

### Experiment 2: Cost Comparison

```
Text: "Write a detailed essay on climate change (500 words)"

Compare on /compare page:
- Which model is cheapest?
- Which is fastest?
- Which context window fits?
```

### Experiment 3: Train Custom Tokenizer

```
1. Upload training corpus (your favorite book)
2. Train with vocab size 1,000
3. Test your custom tokenizer
4. Compare with GPT-4o
5. Notice differences!
```

### Experiment 4: System Message Impact

```
Chat tokenizer test:

Short system: "You are helpful"        → 3 tokens
Long system: "You are a helpful AI..." → 50 tokens

Impact: Every system message token counts against your limit!
```

---

## 💡 Real-World Scenarios

### Scenario 1: Building a Chatbot

```
Context: 8,000 tokens (GPT-4)
System message: 50 tokens
Chat history (5 exchanges): 1,000 tokens
User query: 100 tokens

Available for response: 8,000 - 50 - 1,000 - 100 = 6,850 tokens

Max response: ~5,000 words
```

### Scenario 2: Processing Large Documents

```
Document: 50,000 words
GPT-4 context: 8,192 tokens (~6,000 words)

Solution: Split into chunks:
Chunk 1: 6,000 words → Process → Get summary (500 tokens)
Chunk 2: 6,000 words → Process → Get summary (500 tokens)
Combine summaries → Process (1,000 tokens)

Total API calls: 3
Total tokens: ~2,000 (vs. impossible 50,000 tokens)
```

### Scenario 3: Cost Optimization

```
Want to summarize 100 documents:

Option A (GPT-4o):
100 docs × 500 tokens × ($0.005/1K) = $0.25
Fast, accurate

Option B (GPT-3.5):
100 docs × 600 tokens × ($0.0005/1K) = $0.03
Slower, less accurate

Savings: $0.22 (88% cheaper!)
```

---

## 🎯 Learning Outcomes

By the end, you'll understand:

- ✅ How models read text (tokenization)
- ✅ Why tokens cost money
- ✅ How to optimize costs
- ✅ How to estimate token usage
- ✅ How BPE works
- ✅ How to train custom tokenizers
- ✅ Context window constraints
- ✅ Real-world deployment decisions

---

## 📚 Resources

### Inside This Project

1. **Tokenizer Engine** (`lib/tokenizer/bpe.ts`)
   - Explore the BPE implementation
   - See encode/decode logic
   - Understand merge tracking

2. **Cost Estimator** (`lib/tokenizer/utils.ts`)
   - Real pricing data
   - Cost calculation formulas
   - Model comparison logic

3. **Test Cases** (`tests/unit/tokenizer.test.ts`)
   - Real examples
   - Edge cases
   - Verification patterns

### External Resources

- **OpenAI Tokenizer**: https://platform.openai.com/tokenizer (try it!)
- **tiktoken Library**: https://github.com/openai/tiktoken (official tokenizer)
- **BPE Paper**: https://arxiv.org/abs/1508.07909 (original research)
- **LLM Cost Calculator**: https://www.librecalc.com/ (compare costs)

---

## ❓ FAQ

**Q: Why do different models tokenize the same text differently?**
A: Each model has a different vocabulary trained on different data. GPT-4o's vocab is optimized for modern language, older models might tokenize emojis differently.

**Q: Can I use this for production LLM calls?**
A: For estimates yes! For exact counts, use the official `tiktoken` library (for OpenAI) or model-specific tokenizers.

**Q: What's the BPE algorithm?**
A: Byte Pair Encoding finds the most common character pairs and merges them, building larger tokens over time. It balances compression and vocabulary size.

**Q: How do special tokens work?**
A: Special tokens like `<|endoftext|>` are reserved IDs that mark structure (start, end, padding). They don't map to regular text.

**Q: Can I train a tokenizer for my domain?**
A: Yes! Upload your domain-specific corpus and train a custom tokenizer. Works great for technical, medical, or specialized text.

---

## 🚀 Next Steps

1. **Start Simple**: Tokenize some text on `/tokenize`
2. **Compare**: Use `/compare` to see differences
3. **Deep Dive**: Read `lib/tokenizer/bpe.ts` 
4. **Experiment**: Train a custom tokenizer on `/train`
5. **Build**: Use the API to build your own tool
6. **Share**: Deploy to Vercel and show your friends!

---

**Happy learning! 🎓**

Questions? Create an issue on GitHub or start a discussion!

---

## Glossary

| Term | Definition |
|------|-----------|
| **Token** | A unit of text (word, subword, character) |
| **Vocabulary** | Complete set of unique tokens a model knows |
| **BPE** | Byte Pair Encoding algorithm for tokenization |
| **Context Window** | Maximum tokens a model can handle in one request |
| **Compression Ratio** | Characters per token (higher = better) |
| **Token ID** | Numeric representation of a token |
| **Special Token** | Reserved ID for structural markers |
| **Merge** | Combining two tokens into one (BPE operation) |
| **Embedding** | Converting tokens to numerical vectors |
| **Prompt Tokens** | Tokens in your input (user pays for these) |

---

Created for students learning about LLM tokenization and deployment! 🎉
