#!/usr/bin/env bash

set -e

BACKEND_URL="$1"

echo "Checking backend..."

curl --fail \
  --silent \
  --show-error \
  "$BACKEND_URL/health"

echo ""

echo "Backend health check passed."

echo "Checking products..."

curl --fail \
  --silent \
  --show-error \
  "$BACKEND_URL/api/products?page=1"

echo ""

echo "Product API check passed."
