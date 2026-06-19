#!/bin/bash
# Docker Configuration Hardening - Verification Script
# 🌿 上善若水：驗證生產環境配置

set -e  # Exit on error

echo "🔍 ESG Docker Configuration Verification"
echo "========================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verification results
PASSED=0
FAILED=0

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
        ((FAILED++))
    fi
}

echo "📋 Phase 1: Configuration Syntax Validation"
echo "-------------------------------------------"

# Test 1: docker-compose.yml syntax
echo -n "Testing docker-compose.yml syntax... "
if docker compose config > /dev/null 2>&1; then
    print_result 0 "docker-compose.yml syntax is valid"
else
    print_result 1 "docker-compose.yml has syntax errors"
fi

# Test 2: Check for hardcoded secrets
echo -n "Checking for hardcoded secrets... "
if grep -q ":-esg-jwt-secret-key" docker-compose.yml || \
   grep -q ":-esg_password" docker-compose.yml || \
   grep -q ":-esg_redis_password" docker-compose.yml; then
    print_result 1 "Found hardcoded secrets in docker-compose.yml"
else
    print_result 0 "No hardcoded secrets found"
fi

# Test 3: Check for curl in healthchecks
echo -n "Checking healthchecks use wget... "
if grep -q "curl" docker-compose.yml; then
    print_result 1 "Found curl in healthchecks (should use wget)"
else
    print_result 0 "All healthchecks use wget"
fi

echo ""
echo "📦 Phase 2: Dockerfile Validation"
echo "-----------------------------------"

# Test 4: Dockerfile uses multi-stage build
echo -n "Checking Dockerfile multi-stage build... "
if grep -q "FROM node:20-alpine AS builder" server/Dockerfile && \
   grep -q "COPY --from=builder" server/Dockerfile; then
    print_result 0 "Dockerfile uses multi-stage build"
else
    print_result 1 "Dockerfile missing multi-stage build"
fi

# Test 5: Dockerfile uses compiled code
echo -n "Checking Dockerfile uses compiled code... "
if grep -q 'CMD \["node", "dist/server.js"\]' server/Dockerfile; then
    print_result 0 "Dockerfile runs compiled JavaScript"
else
    print_result 1 "Dockerfile not using compiled code"
fi

# Test 6: Dockerfile has TypeScript build step
echo -n "Checking TypeScript build step... "
if grep -q "RUN npm run build" server/Dockerfile; then
    print_result 0 "Dockerfile includes TypeScript build"
else
    print_result 1 "Dockerfile missing TypeScript build"
fi

echo ""
echo "🔐 Phase 3: Environment Variables"
echo "----------------------------------"

# Test 7: .env.example exists
echo -n "Checking .env.example exists... "
if [ -f ".env.example" ]; then
    print_result 0 ".env.example file exists"
else
    print_result 1 ".env.example file missing"
fi

# Test 8: Required variables in .env.example
echo -n "Checking required variables... "
if [ -f ".env.example" ]; then
    REQUIRED_VARS=("JWT_SECRET" "DB_PASSWORD" "REDIS_PASSWORD")
    MISSING_VARS=()
    
    for var in "${REQUIRED_VARS[@]}"; do
        if ! grep -q "$var" .env.example; then
            MISSING_VARS+=("$var")
        fi
    done
    
    if [ ${#MISSING_VARS[@]} -eq 0 ]; then
        print_result 0 "All required variables in .env.example"
    else
        print_result 1 "Missing variables: ${MISSING_VARS[*]}"
    fi
else
    print_result 1 "Cannot check (no .env.example)"
fi

echo ""
echo "🚀 Phase 4: Build Test (Optional)"
echo "----------------------------------"

if [ "$1" == "--build" ]; then
    echo "Building Docker image..."
    
    # Test 9: Build backend image
    echo -n "Building esg-backend image... "
    if docker build -t esg-backend:test ./server > /tmp/docker-build.log 2>&1; then
        print_result 0 "Backend image built successfully"
        
        # Check image size
        SIZE=$(docker images esg-backend:test --format "{{.Size}}")
        echo "   📦 Image size: $SIZE"
    else
        print_result 1 "Backend image build failed (see /tmp/docker-build.log)"
    fi
else
    echo -e "${YELLOW}ℹ️  Skipping build test (use --build flag to enable)${NC}"
fi

echo ""
echo "📊 Summary"
echo "=========="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Docker configuration is production-ready.${NC}"
    echo "🌿 上善若水：配置如水，適應環境，流動穩固"
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed. Please review the errors above.${NC}"
    exit 1
fi
