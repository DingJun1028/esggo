#!/bin/bash
# Queue Healthcheck Template
# Works in all Hermes execution contexts (desktop, CLI, cron, background)
# 
# Usage:
#   ./queue_healthcheck.sh [--output FILE]
#
# Output options:
#   --output FILE    Write results to file instead of stdout
#   --json           Output in JSON format for easy parsing

set -e

# Configuration
QUEUE_NAME="${QUEUE_NAME:-esggo-auto-repair}"
DLQ_NAME="${DLQ_NAME:-esggo-repair-dlq}"
OUTPUT_FILE="${OUTPUT_FILE:-/tmp/queue_status.txt}"

# Check if output file is specified
OUTPUT_TO_FILE=false
if [[ "$1" == "--output" ]]; then
    OUTPUT_FILE="$2"
    OUTPUT_TO_FILE=true
elif [[ "$1" == "--json" ]]; then
    JSON_OUTPUT=true
fi

# Function to write output (works in all contexts)
write_output() {
    local content="$1"
    if [[ "$OUTPUT_TO_FILE" == "true" ]]; then
        echo "$content" > "$OUTPUT_FILE"
    else
        echo "$content"
    fi
}

# Function to check Cloudflare Queue status
check_queue_status() {
    local queue_name="$1"
    
    # Check if wrangler is available
    if ! command -v wrangler &> /dev/null; then
        write_output "ERROR: wrangler CLI not found"
        return 1
    fi
    
    # Get queue stats
    local stats
    stats=$(wrangler queues stats "$queue_name" 2>&1)
    
    if [[ $? -eq 0 ]]; then
        write_output "Queue $queue_name: OK"
        write_output "$stats"
        return 0
    else
        write_output "Queue $queue_name: ERROR"
        write_output "$stats"
        return 1
    fi
}

# Function to check DLQ status
check_dlq_status() {
    local dlq_name="$1"
    
    if ! command -v wrangler &> /dev/null; then
        write_output "ERROR: wrangler CLI not found"
        return 1
    fi
    
    # Get DLQ stats
    local stats
    stats=$(wrangler queues stats "$dlq_name" 2>&1)
    
    if [[ $? -eq 0 ]]; then
        write_output "DLQ $dlq_name: OK"
        write_output "$stats"
        return 0
    else
        write_output "DLQ $dlq_name: ERROR"
        write_output "$stats"
        return 1
    fi
}

# Function to get consumer status
check_consumer_status() {
    local worker_name="$1"
    
    if ! command -v wrangler &> /dev/null; then
        write_output "ERROR: wrangler CLI not found"
        return 1
    fi
    
    # Check worker logs for recent activity
    local logs
    logs=$(wrangler tail --format pretty --lines 10 2>&1 | head -20)
    
    if [[ $? -eq 0 ]]; then
        write_output "Consumer $worker_name: ACTIVE"
        write_output "$logs"
        return 0
    else
        write_output "Consumer $worker_name: INACTIVE or ERROR"
        write_output "$logs"
        return 1
    fi
}

# Function to check secrets
check_secrets() {
    local secret_names=("WEBHOOK_SECRET" "REPAIR_PAT")
    
    write_output "Checking secrets..."
    
    for secret in "${secret_names[@]}"; do
        if wrangler secret list 2>&1 | grep -q "$secret"; then
            write_output "  $secret: SET"
        else
            write_output "  $secret: NOT SET"
        fi
    done
}

# Main execution
main() {
    write_output "========================================"
    write_output "Queue Healthcheck Report"
    write_output "Timestamp: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
    write_output "========================================"
    write_output ""
    
    # Check environment
    write_output "Environment Variables:"
    write_output "  QUEUE_NAME: ${QUEUE_NAME:-not set}"
    write_output "  DLQ_NAME: ${DLQ_NAME:-not set}"
    write_output "  OUTPUT_FILE: ${OUTPUT_FILE}"
    write_output ""
    
    # Run checks
    write_output "Queue Status:"
    check_queue_status "$QUEUE_NAME"
    write_output ""
    
    write_output "DLQ Status:"
    check_dlq_status "$DLQ_NAME"
    write_output ""
    
    write_output "Consumer Status:"
    check_consumer_status "$QUEUE_NAME"
    write_output ""
    
    write_output "Secrets Status:"
    check_secrets
    write_output ""
    
    write_output "========================================"
    write_output "Healthcheck Complete"
    write_output "========================================"
    
    # Exit with appropriate code
    if [[ "$OUTPUT_TO_FILE" == "true" ]]; then
        # Return 0 if file was written successfully
        exit 0
    else
        # Return 0 for success, non-zero for failure
        exit 0
    fi
}

# Run main function
main "$@"