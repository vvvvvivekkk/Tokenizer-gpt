# Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ /tokenize    │  │ /compare     │  │ /chat, /train, /api  │  │
│  │ Main page    │  │ Model compare│  │ Advanced features    │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└────────────────────────────┬──────────────────────────────────┘
                             │ API Calls
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js App Router)             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ POST /tokenize   │  POST /train │  │ GET /models      │  │
│  │ Tokenization     │ Model training│  │ List models      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────────────────┬──────────────────────┐            │
│  │ POST /detokenize         │ POST /upload         │            │
│  │ Decode tokens            │ File handling        │            │
│  └──────────────────────────┴──────────────────────┘            │
└────────────────────────────┬──────────────────────────────────┘
                             │ Business Logic
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Tokenizer Engine (lib/tokenizer)             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ BPETokenizer                                             │  │
│  │  ├── encode(text) → token IDs                            │  │
│  │  ├── decode(tokens) → text                               │  │
│  │  ├── getStats(tokens) → statistics                       │  │
│  │  └── train(corpus) → vocabulary                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Utilities                                                │  │
│  │  ├── getTokenStatistics() → count, compression, coverage │  │
│  │  ├── estimateTokenCost() → cost by model                │  │
│  │  └── estimateContextUsage() → remaining tokens          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬──────────────────────────────────┘
                             │ Data Persistence
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Database (PostgreSQL)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ User         │  │ TokenizerModel   │  │ UsageLog         │  │
│  │ - email      │  │ - vocabulary     │  │ - tokenCount     │  │
│  │ - profile    │  │ - merges         │  │ - costEstimate   │  │
│  │ - createdAt  │  │ - trainingData   │  │ - timestamp      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Account      │  │ Session      │  │ SavedTokenization   │  │
│  │ - OAuth      │  │ - sessionToken   │  │ - results        │  │
│  │ - provider   │  │ - expiresAt  │  │ - metadata       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

```
tokenizer/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout with Navbar/Footer
│   ├── page.tsx                   # Homepage
│   ├── api/                       # API Routes
│   │   ├── tokenize/route.ts      # POST - Encode text
│   │   ├── detokenize/route.ts    # POST - Decode tokens
│   │   ├── models/route.ts        # GET - List available models
│   │   └── train/route.ts         # POST - Train custom tokenizer
│   ├── tokenize/page.tsx          # Main tokenizer interface
│   ├── compare/page.tsx           # Model comparison
│   ├── train/page.tsx             # Training interface
│   ├── chat/page.tsx              # Chat tokenization mode
│   └── auth/                      # Authentication routes (future)
│
├── components/                    # React Components
│   ├── layout/
│   │   ├── Navbar.tsx             # Navigation header
│   │   ├── Footer.tsx             # Page footer
│   │   └── Sidebar.tsx            # Sidebar menu (future)
│   ├── features/                  # Domain-specific components
│   │   ├── TextInput.tsx          # Text area with file upload
│   │   ├── TokenVisualization.tsx # Token display with colors
│   │   ├── Statistics.tsx         # Stats cards
│   │   ├── ModelSelector.tsx      # Model dropdown
│   │   └── CostEstimator.tsx      # Cost breakdown
│   ├── ui/                        # Generic UI components
│   │   ├── Button.tsx             # Reusable button
│   │   ├── Input.tsx              # Text input
│   │   ├── Card.tsx               # Card container
│   │   └── Badge.tsx              # Status badge
│   └── auth/                      # Auth components (future)
│       └── LoginButton.tsx
│
├── lib/                           # Utilities & Logic
│   ├── tokenizer/                 # Core tokenizer engine
│   │   ├── bpe.ts                 # BPE Tokenizer class
│   │   ├── trainer.ts             # Training algorithm
│   │   ├── utils.ts               # Stats & cost calculation
│   │   ├── vocabulary.ts          # Default vocabularies (future)
│   │   ├── special-tokens.ts      # Special token definitions (future)
│   │   └── index.ts               # Public exports
│   ├── auth.ts                    # NextAuth configuration (future)
│   ├── db.ts                      # Database client
│   └── constants.ts               # App constants
│
├── prisma/                        # Database
│   ├── schema.prisma              # Database schema
│   ├── migrations/                # Migration history
│   └── seed.ts                    # Seed script (future)
│
├── tests/                         # Testing
│   ├── unit/
│   │   ├── tokenizer.test.ts      # Tokenizer logic tests
│   │   └── cost-estimator.test.ts # Cost calculation tests
│   ├── integration/
│   │   └── api.test.ts            # API endpoint tests
│   └── e2e/
│       └── user-flow.spec.ts      # End-to-end Playwright tests
│
├── public/                        # Static files
│   ├── favicon.ico
│   └── vocabularies/              # Pre-trained vocab files (future)
│
├── styles/
│   └── globals.css                # Global styles & Tailwind
│
├── Configuration Files
│   ├── next.config.ts             # Next.js config
│   ├── tailwind.config.ts         # Tailwind CSS
│   ├── tsconfig.json              # TypeScript
│   ├── vitest.config.ts           # Unit test config
│   ├── playwright.config.ts       # E2E test config
│   ├── postcss.config.mjs         # PostCSS
│   ├── vercel.json                # Vercel deployment
│   └── .env.example               # Environment template
│
├── CI/CD
│   └── .github/workflows/ci.yml   # GitHub Actions pipeline
│
├── Documentation
│   ├── README.md                  # Main README
│   ├── QUICKSTART.md              # Quick start guide
│   ├── API.md                     # API documentation
│   ├── STUDENT_GUIDE.md           # Educational guide
│   ├── DEPLOYMENT.md              # Deployment instructions
│   ├── CONTRIBUTING.md            # Contribution guidelines
│   ├── ARCHITECTURE.md            # Architecture (this file)
│   └── TRAINING_CORPUS.md         # Sample training data
│
└── Other
    ├── package.json
    ├── package-lock.json
    ├── .gitignore
    └── LICENSE
```

---

## 🔄 Data Flow

### Tokenization Flow

```
1. User Input (UI)
   └─► TextInput component
       └─► Text area or file upload
           
2. API Request
   └─► POST /api/tokenize
       └─► Request validation (Zod)
           
3. Processing
   └─► BPETokenizer.encode(text)
       └─► Pattern matching (regex)
       └─► Character-to-ID mapping
       └─► Return token array
           
4. Statistics Calculation
   └─► getTokenStatistics()
       └─► Token count
       └─► Character count
       └─► Compression ratio
       └─► Vocabulary coverage
           
5. Cost Estimation
   └─► estimateTokenCost()
       └─► Lookup model pricing
       └─► Calculate (tokens / 1000) * rate
       └─► Return cost breakdown
           
6. Response (UI)
   └─► TokenVisualization (colored blocks)
   └─► Statistics (cards)
   └─► CostEstimator (breakdown)
   └─► Copy/export buttons
```

### Training Flow

```
1. User Upload (UI)
   └─► Training page form
       └─► Text area or file input
       └─► Vocabulary size slider
       └─► Model name input
           
2. API Request
   └─► POST /api/train
       └─► Request validation (Zod)
           
3. Training Algorithm
   └─► BPETrainer.train(corpus, vocabSize)
       └─► Initialize vocabulary (chars)
       └─► Count pair frequencies
       └─► Merge most common pairs
       └─► Repeat until vocabSize reached
           
4. Model Creation
   └─► Save to database (Prisma)
       └─► Store vocabulary
       └─► Store merge rules
       └─► Store metadata
           
5. Response (UI)
   └─► Success confirmation
   └─► Model ID
   └─► Download vocabulary (JSON)
   └─► Test new tokenizer
```

---

## 🗄️ Database Schema

### User
```sql
CREATE TABLE "User" (
  id              String @id @default(cuid())
  email           String @unique
  name            String?
  image           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  accounts        Account[]
  sessions        Session[]
  models          TokenizerModel[]
  datasets        TrainingDataset[]
  usageLogs       UsageLog[]
  savedTokens     SavedTokenization[]
)
```

### TokenizerModel
```sql
CREATE TABLE "TokenizerModel" (
  id              String @id @default(cuid())
  name            String
  vocabulary      Json
  merges          Json
  vocabSize       Int
  createdBy       String
  isPublic        Boolean @default(false)
  downloads       Int @default(0)
  rating          Float?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  creator         User @relation(fields: [createdBy], references: [id])
  usageLogs       UsageLog[]
)
```

### TrainingDataset
```sql
CREATE TABLE "TrainingDataset" (
  id              String @id @default(cuid())
  name            String
  content         String
  size            Int
  language        String
  createdBy       String
  isPublic        Boolean @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  creator         User @relation(fields: [createdBy], references: [id])
)
```

### UsageLog
```sql
CREATE TABLE "UsageLog" (
  id              String @id @default(cuid())
  userId          String
  modelId         String
  textLength      Int
  tokenCount      Int
  cost            Decimal
  timestamp       DateTime @default(now())
  
  user            User @relation(fields: [userId], references: [id])
  model           TokenizerModel @relation(fields: [modelId], references: [id])
}
```

---

## 🔐 Authentication Flow (Future)

```
1. User Clicks "Login"
   └─► Redirects to /auth/signin
   
2. Select Provider
   └─► Google OAuth
   └─► Guest Mode
   
3. OAuth Flow (if Google)
   └─► NextAuth redirects to Google
   └─► User grants permission
   └─► Google redirects back with code
   └─► NextAuth exchanges code for token
   
4. Session Creation
   └─► Create session in database
   └─► Set session cookie
   └─► Redirect to dashboard
   
5. Protected Routes
   └─► useSession() hook checks session
   └─► Redirect to login if not authenticated
   └─► Allow access if authenticated
```

---

## 🚀 Deployment Architecture

### Local Development
```
Your Machine (Windows/Mac/Linux)
└── npm run dev
    └── Next.js server (localhost:3000)
    └── API routes (localhost:3000/api/*)
    └── Database (Neon connection)
```

### Vercel Production
```
GitHub Repository
├── Push to main
└── GitHub Actions (CI/CD)
    ├── Lint
    ├── Type-check
    ├── Test
    └── Build
        └── Vercel Auto-Deploy
            └── Vercel Serverless Functions
                ├── /api/tokenize
                ├── /api/train
                └── Page rendering
```

---

## 🔌 Integration Points

### External Services

```
┌─────────────────────────────────────────┐
│        Tokenizer Application            │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Neon (PostgreSQL Database)       │  │
│  │ Connection: DATABASE_URL         │  │
│  │ Tables: User, TokenizerModel...  │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Google OAuth (Future)            │  │
│  │ Credentials: GOOGLE_CLIENT_*     │  │
│  │ Flow: NextAuth integration       │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Vercel Deployment                │  │
│  │ Env: Vercel dashboard            │  │
│  │ Logs: Vercel analytics           │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

---

## ⚡ Performance Considerations

### Frontend
- **Code Splitting**: Next.js App Router auto-splits code per page
- **Image Optimization**: next/image for responsive images
- **CSS-in-JS**: Tailwind CSS with PostCSS pruning
- **State Management**: React hooks (no Redux needed)

### Backend
- **Database**: Connection pooling via Prisma
- **Caching**: Potential for Redis (future)
- **API Response Time**: Target < 500ms for tokenization
- **Scalability**: Vercel handles autoscaling

### Tokenizer Engine
- **Algorithm**: O(n log n) for BPE encoding
- **Memory**: Vocabulary stored in Map<string, number>
- **Web Workers**: Thread-safe for large documents (future)

---

## 🧪 Testing Strategy

### Unit Tests
```
lib/tokenizer/bpe.ts
├── encode() - text to token IDs
├── decode() - token IDs to text
├── getStats() - statistics calculation
└── special tokens handling

lib/tokenizer/utils.ts
├── getTokenStatistics()
├── estimateTokenCost()
└── formatCurrency()
```

### Integration Tests
```
app/api/tokenize/route.ts
├── Request validation
├── Response format
└── Cost calculation

app/api/train/route.ts
├── Training process
└── Model creation
```

### E2E Tests
```
/tokenize page
├── Text input
├── Model selection
├── Results display
└── Export functionality

/compare page
├── Multiple models
└── Cost comparison

/train page
├── Corpus upload
├── Training
└── Model download
```

---

## 🔄 Development Workflow

```
1. Feature Branch
   └─► git checkout -b feature/my-feature
   
2. Local Development
   └─► npm run dev
   └─► Code changes
   └─► Manual testing
   
3. Testing
   └─► npm run test:unit
   └─► npm run test:e2e
   └─► npm run type-check
   
4. Commit & Push
   └─► git add .
   └─► git commit -m "Add feature"
   └─► git push origin feature/my-feature
   
5. GitHub Actions
   └─► Lint
   └─► Type-check
   └─► Test
   └─► Build
   
6. Pull Request
   └─► Code review
   └─► Merge to main
   
7. Vercel Deployment
   └─► Auto-deploy on main
   └─► Live on production
```

---

## 📊 Monitoring & Analytics

### Metrics to Track
- API response times
- Token processing throughput
- Cost per request
- User engagement
- Model popularity
- Training frequency

### Logging
- API request/response logs
- Error logs
- Performance metrics
- User actions

---

## 🛣️ Future Architecture Enhancements

1. **Caching Layer**
   - Redis for vocabulary caching
   - Response caching for common texts

2. **Message Queue**
   - Bull queue for async training
   - Background job processing

3. **ML Pipeline**
   - Model versioning
   - A/B testing
   - Performance metrics

4. **Real-time Features**
   - WebSockets for streaming tokenization
   - Live training progress

5. **Microservices** (advanced)
   - Separate tokenizer service
   - Separate training service
   - API gateway

---

**Last Updated**: 2024-02-07

For detailed implementation, see individual documentation files (QUICKSTART.md, API.md, etc.)
