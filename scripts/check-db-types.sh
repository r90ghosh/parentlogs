#!/bin/bash
# Check if database types are up to date
# Usage: ./scripts/check-db-types.sh

set -e

TYPES_FILE="packages/shared/src/types/database.ts"
PROJECT_ID="oeeeiquclwfpypojjigx"

echo "Generating fresh database types..."
TEMP_FILE=$(mktemp)

npx supabase gen types typescript --project-id "$PROJECT_ID" > "$TEMP_FILE" 2>/dev/null || {
  echo "Warning: Could not generate types (supabase CLI not available or not logged in)"
  echo "Skipping type check."
  rm -f "$TEMP_FILE"
  exit 0
}

echo "Comparing with committed types..."
if diff -q "$TEMP_FILE" "$TYPES_FILE" > /dev/null 2>&1; then
  echo "Database types are up to date"
  rm -f "$TEMP_FILE"
  exit 0
else
  echo "Database types are outdated!"
  echo "Run 'pnpm db:generate-types' to update them."
  diff --color "$TYPES_FILE" "$TEMP_FILE" | head -50
  rm -f "$TEMP_FILE"
  exit 1
fi
