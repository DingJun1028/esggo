#!/bin/bash
# ESGss JunAiKey Beta - 部署驗證腳本

echo "========================================="
echo "ESGss JunAiKey Beta - Deployment Verification"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Function to check command
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 is not installed"
        ((FAILED++))
        return 1
    fi
}

# Function to check env variable
check_env() {
    if [ -z "${!1}" ]; then
        echo -e "${RED}✗${NC} $1 is not set"
        ((FAILED++))
        return 1
    else
        echo -e "${GREEN}✓${NC} $1 is set"
        ((PASSED++))
        return 0
    fi
}

echo "1. Checking Prerequisites..."
echo "-----------------------------------"
check_command docker
check_command docker-compose
check_command git
echo ""

echo "2. Checking Docker Status..."
echo "-----------------------------------"
if docker info &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker daemon is running"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Docker daemon is not running"
    ((FAILED++))
fi
echo ""

echo "3. Checking Environment File..."
echo "-----------------------------------"
if [ -f ".env.production" ]; then
    echo -e "${GREEN}✓${NC} .env.production exists"
    ((PASSED++))
    
    # Load environment variables
    export $(cat .env.production | grep -v '^#' | xargs)
    
    echo ""
    echo "4. Checking Required Environment Variables..."
    echo "-----------------------------------"
    check_env DB_PASSWORD
    check_env JWT_SECRET
    
    # Check at least one AI service
    if [ -n "$GEMINI_API_KEY" ] || [ -n "$OPENAI_API_KEY" ]; then
        echo -e "${GREEN}✓${NC} At least one AI service is configured"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} No AI service configured (GEMINI_API_KEY or OPENAI_API_KEY required)"
        ((FAILED++))
    fi
else
    echo -e "${RED}✗${NC} .env.production does not exist"
    ((FAILED++))
    echo -e "${YELLOW}ℹ${NC} Run: cp .env.example .env.production"
fi
echo ""

echo "5. Checking Docker Configuration..."
echo "-----------------------------------"
if docker-compose -f docker-compose.prod.yml config &> /dev/null; then
    echo -e "${GREEN}✓${NC} docker-compose.prod.yml is valid"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} docker-compose.prod.yml has errors"
    ((FAILED++))
fi
echo ""

echo "6. Checking Nginx Configuration..."
echo "-----------------------------------"
if [ -f "nginx.conf" ]; then
    echo -e "${GREEN}✓${NC} nginx.conf exists"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} nginx.conf not found"
    ((FAILED++))
fi
echo ""

echo "========================================="
echo "Verification Summary"
echo "========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready to deploy.${NC}"
    echo ""
    echo "To deploy, run:"
    echo "  docker-compose -f docker-compose.prod.yml up -d --build"
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Please fix the issues above.${NC}"
    exit 1
fi
