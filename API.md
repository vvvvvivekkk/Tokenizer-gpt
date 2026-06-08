# API Documentation

## Overview

RESTful API for tokenization, detokenization, model listing, and custom tokenizer training.

**Base URL**: `http://localhost:3000/api` (development) or `https://your-domain.vercel.app/api` (production)

---

## Endpoints

### 1. Tokenize Text

**Endpoint**: `POST /api/tokenize`

Encode text into token IDs using a specified model's tokenizer.

#### Request

```json
{
  "text": "Hello, world!",
  "modelId": "gpt-4o"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `text` | string | ✅ | Text to tokenize (max 1M characters) |
| `modelId` | string | ❌ | Model ID (default: `gpt-4o`) |

#### Response (Success)

```json
{
  "success": true,
  "tokens": [4, 15, 12, 12, 14, 1, 43, 1, 6, 14, 18, 12, 5],
  "tokenCount": 13,
  "stats": {
    "characterCount": 13,
    "wordCount": 2,
    "compressionRatio": 1.0,
    "vocabulary_coverage": 0.95
  },
  "cost": {
    "inputCost": 0.0000065,
    "outputCost": 0,
    "totalCost": 0.0000065,
    "currency": "USD"
  },
  "model": "gpt-4o"
}
```

#### Response (Error)

```json
{
  "success": false,
  "error": "text is required"
}
```

#### Status Codes

- `200` - Success
- `400` - Invalid input
- `500` - Server error

#### Examples

**cURL**
```bash
curl -X POST http://localhost:3000/api/tokenize \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","modelId":"gpt-4o"}'
```

**JavaScript/Fetch**
```javascript
const response = await fetch('/api/tokenize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Hello world',
    modelId: 'gpt-4o'
  })
});
const data = await response.json();
console.log(data.tokenCount); // Output: 2
```

**Python/Requests**
```python
import requests

response = requests.post('http://localhost:3000/api/tokenize', json={
    'text': 'Hello world',
    'modelId': 'gpt-4o'
})
print(response.json()['tokenCount'])  # Output: 2
```

---

### 2. Detokenize

**Endpoint**: `POST /api/detokenize`

Decode token IDs back to text.

#### Request

```json
{
  "tokens": [4, 15, 12, 12, 14]
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `tokens` | number[] | ✅ | Array of token IDs |

#### Response (Success)

```json
{
  "success": true,
  "text": "hello",
  "tokenCount": 5
}
```

#### Response (Error)

```json
{
  "success": false,
  "error": "tokens must be an array"
}
```

#### Status Codes

- `200` - Success
- `400` - Invalid input
- `500` - Server error

#### Examples

**cURL**
```bash
curl -X POST http://localhost:3000/api/detokenize \
  -H "Content-Type: application/json" \
  -d '{"tokens":[4,15,12,12,14]}'
```

**JavaScript**
```javascript
const response = await fetch('/api/detokenize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ tokens: [4, 15, 12, 12, 14] })
});
const { text } = await response.json();
console.log(text); // Output: "hello"
```

---

### 3. Get Available Models

**Endpoint**: `GET /api/models`

List all available tokenizer models with pricing and context information.

#### Request

```
GET /api/models
```

#### Response

```json
{
  "success": true,
  "models": [
    {
      "id": "gpt-4o",
      "name": "GPT-4o",
      "provider": "OpenAI",
      "inputCost": 0.000005,
      "outputCost": 0.000015,
      "contextWindow": 128000,
      "description": "Latest GPT-4 Omni model with vision",
      "releaseDate": "2024-05-13"
    },
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "provider": "OpenAI",
      "inputCost": 0.00003,
      "outputCost": 0.00006,
      "contextWindow": 8192,
      "description": "GPT-4 base model"
    },
    {
      "id": "gpt-3.5-turbo",
      "name": "GPT-3.5 Turbo",
      "provider": "OpenAI",
      "inputCost": 0.0000005,
      "outputCost": 0.0000015,
      "contextWindow": 4096,
      "description": "Fast and cost-effective"
    },
    {
      "id": "claude-3-opus",
      "name": "Claude 3 Opus",
      "provider": "Anthropic",
      "inputCost": 0.000015,
      "outputCost": 0.000075,
      "contextWindow": 200000,
      "description": "Most capable Claude model"
    },
    {
      "id": "claude-3-sonnet",
      "name": "Claude 3 Sonnet",
      "provider": "Anthropic",
      "inputCost": 0.000003,
      "outputCost": 0.000015,
      "contextWindow": 200000,
      "description": "Balanced Claude model"
    },
    {
      "id": "claude-3-haiku",
      "name": "Claude 3 Haiku",
      "provider": "Anthropic",
      "inputCost": 0.00000025,
      "outputCost": 0.00000125,
      "contextWindow": 200000,
      "description": "Fastest Claude model"
    },
    {
      "id": "gemini-pro",
      "name": "Gemini Pro",
      "provider": "Google",
      "inputCost": 0.00000125,
      "outputCost": 0.00000375,
      "contextWindow": 32768,
      "description": "Google's reasoning model"
    }
  ]
}
```

#### Status Codes

- `200` - Success
- `500` - Server error

#### Examples

**cURL**
```bash
curl http://localhost:3000/api/models
```

**JavaScript**
```javascript
const response = await fetch('/api/models');
const { models } = await response.json();
models.forEach(m => {
  console.log(`${m.name}: $${m.inputCost}/1K tokens`);
});
```

---

### 4. Train Custom Tokenizer

**Endpoint**: `POST /api/train`

Train a new BPE tokenizer on a custom corpus.

#### Request

```json
{
  "corpus": "Your training text here...",
  "vocabSize": 5000,
  "modelName": "MyCustomTokenizer"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `corpus` | string | ✅ | Training text (min 100 chars) |
| `vocabSize` | number | ❌ | Vocabulary size (256-100000, default: 10000) |
| `modelName` | string | ✅ | Name for model (1-100 chars) |

#### Response (Success)

```json
{
  "success": true,
  "model": {
    "id": "model_1707362400000",
    "name": "MyCustomTokenizer",
    "vocabSize": 5000,
    "vocabulary": {
      "a": 0,
      "b": 1,
      "ab": 256,
      ...
    },
    "merges": [
      ["a", "b"],
      ["c", "d"],
      ...
    ],
    "trainingCompleted": "2024-02-07T12:00:00Z"
  }
}
```

#### Response (Error)

```json
{
  "success": false,
  "error": "corpus must be at least 100 characters"
}
```

#### Status Codes

- `200` - Success
- `400` - Invalid input
- `500` - Server error

#### Examples

**cURL**
```bash
curl -X POST http://localhost:3000/api/train \
  -H "Content-Type: application/json" \
  -d '{
    "corpus": "Your training text here... (must be 100+ chars)",
    "vocabSize": 5000,
    "modelName": "MyTokenizer"
  }'
```

**JavaScript**
```javascript
const corpus = `Lorem ipsum dolor sit amet, consectetur adipiscing elit...`; // 100+ chars

const response = await fetch('/api/train', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    corpus,
    vocabSize: 5000,
    modelName: 'MyTokenizer'
  })
});

const { model } = await response.json();
console.log(`Model created: ${model.id}`);
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `text is required` | Text field missing | Include `text` in request body |
| `tokens must be an array` | Invalid tokens field | Pass array of numbers: `[1, 2, 3]` |
| `corpus must be at least 100 characters` | Corpus too short | Provide training text ≥ 100 chars |
| `vocabSize must be between 256 and 100000` | Invalid vocab size | Use range 256-100000 |
| `modelId not found` | Unknown model | Check `/api/models` for valid IDs |

---

## Rate Limiting

The API currently has **no rate limits** in development mode.

For production deployment, consider implementing:
- 100 requests/minute per IP
- 10,000 tokens/hour per user
- Database-backed rate limiting

---

## Cost Calculation

Costs are per 1,000 tokens (standard for LLM APIs):

```
Total Cost = (Input Tokens / 1000) * Input Cost per 1K + (Output Tokens / 1000) * Output Cost per 1K
```

Example:
- GPT-4o: $0.005 per 1K input, $0.015 per 1K output
- 100 input tokens: (100/1000) * 0.005 = $0.0000005
- 50 output tokens: (50/1000) * 0.015 = $0.00000075
- **Total**: $0.00000575

---

## Authentication

The API currently supports **guest mode** (unauthenticated).

For authenticated requests (when available):

```javascript
fetch('/api/tokenize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ text: 'Hello' })
});
```

---

## Rate Limiting & Quotas

Current limits (development):
- **Text size**: Max 1,000,000 characters
- **Tokens per request**: Max 10,000 tokens
- **Requests/minute**: Unlimited (dev mode)
- **Training corpus**: Max 10MB

---

## Webhook Events (Future)

When webhooks are implemented, you'll receive events for:

```json
{
  "event": "tokenization.completed",
  "data": {
    "id": "tokenize_123",
    "tokenCount": 100,
    "model": "gpt-4o",
    "timestamp": "2024-02-07T12:00:00Z"
  }
}
```

---

## SDK Examples

### JavaScript/Node.js

```javascript
class TokenizerAPI {
  constructor(baseURL = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
  }

  async tokenize(text, modelId = 'gpt-4o') {
    const res = await fetch(`${this.baseURL}/tokenize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, modelId })
    });
    return res.json();
  }

  async detokenize(tokens) {
    const res = await fetch(`${this.baseURL}/detokenize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokens })
    });
    return res.json();
  }

  async getModels() {
    const res = await fetch(`${this.baseURL}/models`);
    return res.json();
  }
}

// Usage
const api = new TokenizerAPI();
const { tokenCount } = await api.tokenize('Hello world');
console.log(tokenCount); // 2
```

### Python

```python
import requests

class TokenizerAPI:
    def __init__(self, base_url='http://localhost:3000/api'):
        self.base_url = base_url

    def tokenize(self, text, model_id='gpt-4o'):
        res = requests.post(f'{self.base_url}/tokenize', json={
            'text': text,
            'modelId': model_id
        })
        return res.json()

    def detokenize(self, tokens):
        res = requests.post(f'{self.base_url}/detokenize', json={
            'tokens': tokens
        })
        return res.json()

    def get_models(self):
        res = requests.get(f'{self.base_url}/models')
        return res.json()

# Usage
api = TokenizerAPI()
result = api.tokenize('Hello world')
print(result['tokenCount'])  # 2
```

---

## FAQ

**Q: Can I use this API without authentication?**
A: Yes, guest mode is available. Authentication is optional.

**Q: What's the maximum text size?**
A: 1,000,000 characters (1MB) per request.

**Q: Can I train multiple tokenizers?**
A: Yes, each training creates a new model with a unique ID.

**Q: How accurate is the tokenization?**
A: The simplified BPE implementation provides accurate character-level tokenization. For production use with OpenAI models, use the official `tiktoken` library.

**Q: Can I export trained models?**
A: Yes, the training response includes the full vocabulary and merge rules.

---

## Changelog

### v1.0.0 (2024-02-07)
- Initial API release
- Tokenize, detokenize, models, train endpoints
- 7 LLM models supported
- Production-ready

---

**Last Updated**: 2024-02-07

For issues or feature requests, create a GitHub issue!
