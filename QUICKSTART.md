# Quick Start Guide - GPT-Style Tokenizer Platform

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A PostgreSQL database (Neon or Supabase free tier)

### Step 1: Clone & Install

```bash
cd tokenizer
npm install
```

### Step 2: Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Database (get from Neon/Supabase)
DATABASE_URL="postgresql://user:password@host/dbname"

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Optional: Google OAuth (leave blank for guest mode)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### Step 3: Setup Database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### Step 4: Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 🎯 First Time User

### Try the Main Features

1. **Tokenize Text** (`/tokenize`)
   - Paste any text
   - Select model (GPT-4, GPT-4o, Claude, etc.)
   - See token count, cost, visualization

2. **Compare Models** (`/compare`)
   - Test same text on multiple models
   - See cost differences
   - Understand tokenization variations

3. **Chat Mode** (`/chat`)
   - Tokenize system, user, assistant messages
   - Understand prompt composition
   - Calculate total context used

4. **Train Custom Tokenizer** (`/train`)
   - Upload training corpus (TXT file)
   - Set vocabulary size
   - Download trained model

---

## 📊 API Usage (Programmatic)

### Tokenize Text

```bash
curl -X POST http://localhost:3000/api/tokenize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, world!",
    "modelId": "gpt-4o"
  }'
```

Response:
```json
{
  "success": true,
  "tokens": [4, 15, 12, 12, 14, 1, 43, 1, 6, 14, 18, 12, 5],
  "tokenCount": 13,
  "stats": {
    "characterCount": 13,
    "wordCount": 2,
    "compressionRatio": 1.0
  },
  "cost": {
    "inputCost": 0.0000065,
    "outputCost": 0,
    "totalCost": 0.0000065
  },
  "model": "gpt-4o"
}
```

### Detokenize

```bash
curl -X POST http://localhost:3000/api/detokenize \
  -H "Content-Type: application/json" \
  -d '{
    "tokens": [4, 15, 12, 12, 14]
  }'
```

### Get Models

```bash
curl http://localhost:3000/api/models
```

Response:
```json
{
  "success": true,
  "models": [
    {
      "id": "gpt-4o",
      "name": "GPT-4o",
      "inputCost": 5e-6,
      "outputCost": 15e-6,
      "contextWindow": 128000,
      "description": "Latest GPT-4o model"
    },
    ...
  ]
}
```

### Train Tokenizer

```bash
curl -X POST http://localhost:3000/api/train \
  -H "Content-Type: application/json" \
  -d '{
    "corpus": "Your training text here...",
    "vocabSize": 5000,
    "modelName": "MyTokenizer"
  }'
```

---

## 🧪 Testing

### Run Unit Tests

```bash
npm run test:unit
```

### Run E2E Tests

```bash
npm run test:e2e
```

### Run All Tests

```bash
npm test
```

---

## 📦 Building for Production

### Build

```bash
npm run build
```

### Test Production Build Locally

```bash
npm run build
npm start
```

---

## 🌐 Deploying to Vercel

### Option 1: GitHub Integration (Recommended)

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Go to [Vercel.com](https://vercel.com) → Import Project
3. Select your GitHub repo
4. Set environment variables:
   - `DATABASE_URL` → Your Neon/Supabase URL
   - `NEXTAUTH_URL` → Your Vercel domain (e.g., myapp.vercel.app)
   - `NEXTAUTH_SECRET` → Generate with `openssl rand -base64 32`

5. Click Deploy

### Option 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel

# Follow the prompts, then set env vars:
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET

# Deploy
vercel --prod
```

---

## 🔧 Configuration Files

### Key Files

- **`next.config.ts`** - Next.js configuration
- **`tailwind.config.ts`** - Tailwind CSS theme
- **`tsconfig.json`** - TypeScript settings
- **`.env.example`** - Environment variable template
- **`prisma/schema.prisma`** - Database schema
- **`vercel.json`** - Vercel deployment config

---

## 🐛 Troubleshooting

### "Database connection error"
- Check `DATABASE_URL` in `.env.local`
- Ensure Neon/Supabase database is active
- Run: `npx prisma db push`

### "NEXTAUTH_SECRET missing"
- Generate: `openssl rand -base64 32`
- Add to `.env.local`

### "Build fails with TypeScript errors"
- Run: `npm run type-check`
- Fix any errors
- Try: `npm run build` again

### "Port 3000 already in use"
- Kill process: `lsof -ti:3000 | xargs kill -9`
- Or use different port: `npm run dev -- -p 3001`

---

## 📚 Learn More

- **Full README**: [README.md](./README.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Architecture**: See `/docs` folder

---

## 🎓 For Students

This project is perfect for learning:
- **Tokenization**: How LLMs break down text
- **Cost Estimation**: Why tokens matter for API pricing
- **Full-Stack Development**: Next.js, API routes, databases
- **BPE Algorithm**: Custom tokenizer training
- **Deployment**: Vercel, PostgreSQL, production builds

### Suggested Learning Path

1. Run the tokenizer on different texts → Understand token count
2. Compare models → See cost differences
3. Explore the code → `lib/tokenizer/bpe.ts`
4. Train a custom tokenizer → See BPE in action
5. Deploy to Vercel → Go live!

---

## ⚡ Next Steps

- [ ] Configure `.env.local`
- [ ] Run `npm install && npx prisma migrate dev --name init`
- [ ] Start dev server: `npm run dev`
- [ ] Visit tokenizer page: http://localhost:3000/tokenize
- [ ] Try API: `curl http://localhost:3000/api/models`
- [ ] Read [README.md](./README.md) for full feature list
- [ ] Deploy to Vercel when ready

---

**Need help?** Check the issues or create a discussion!

Happy tokenizing! 🎉
