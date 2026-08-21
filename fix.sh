#!/bin/bash
export DATABASE_URL="postgresql://dummy"
pnpm turbo run lint typecheck test build
