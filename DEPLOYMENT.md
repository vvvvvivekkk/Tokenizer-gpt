#!/usr/bin/env bash

# Deployment guide for Vercel

echo "🚀 Deploying GPT-Style Tokenizer to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm i -g vercel
fi

# Create .env.production with required variables
echo "Setting up environment variables..."
cat > .env.production << 'EOF'
# Database
DATABASE_URL="your-postgresql-url"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="generate-a-secure-secret"

# OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
EOF

echo "✅ Environment file created (.env.production)"
echo "Please edit .env.production with your actual values"
echo ""
echo "Next steps:"
echo "1. Update DATABASE_URL with your PostgreSQL connection string"
echo "2. Update NEXTAUTH_URL with your Vercel domain"
echo "3. Update NEXTAUTH_SECRET with: openssl rand -base64 32"
echo "4. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET if using OAuth"
echo ""
echo "Then run: vercel deploy --prod"
