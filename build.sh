#!/usr/bin/env bash
set -o errexit

# Build frontend
cd frontend
npm install
npm run build

# Copy into backend/static
rm -rf ../backend/static
cp -r dist ../backend/static

# Install backend dependencies using pip directly
cd ../backend
pip install -r requirements.txt