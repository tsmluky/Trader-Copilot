#!/bin/bash
set -x # Print commands for debugging

echo "Starting TraderCopilot Backend..."
pwd
ls -la

# Ensure we are in the directory of the script
cd "$(dirname "$0")"
echo "Changed to directory: $(pwd)"

# 1. Scheduler is auto-started by main.py (Daemon Thread)
# No need to run python scheduler.py separately

# 2. Start the API
echo "Using PORT: ${PORT:-8000}"
uvicorn main:app --host 0.0.0.0 --port "${PORT:-8000}" --proxy-headers --forwarded-allow-ips '*'
