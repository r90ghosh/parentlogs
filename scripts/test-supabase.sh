#!/bin/bash
cd "$(dirname "$0")/.."

# Read service key from .env.local
SERVICE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d'=' -f2)
SUPABASE_URL="https://oeeeiquclwfpypojjigx.supabase.co"

echo "Testing Supabase connection..."

# Test articles table
echo -e "\n=== Testing articles table ==="
curl -s "${SUPABASE_URL}/rest/v1/articles?select=slug&limit=1" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}"

echo -e "\n\n=== Testing videos table ==="
curl -s "${SUPABASE_URL}/rest/v1/videos?select=slug&limit=1" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}"

echo -e "\n"
