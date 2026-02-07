# Environment Variables Validation
# This file validates required environment variables

# Required Supabase variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "❌ NEXT_PUBLIC_SUPABASE_URL is required"
  exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is required"
  exit 1
fi

# Optional but recommended
if [ -z "$NEXT_PUBLIC_APP_URL" ]; then
  echo "⚠️  NEXT_PUBLIC_APP_URL not set, using default: http://localhost:3000"
  export NEXT_PUBLIC_APP_URL=http://localhost:3000
fi

echo "✅ Environment variables validated"
