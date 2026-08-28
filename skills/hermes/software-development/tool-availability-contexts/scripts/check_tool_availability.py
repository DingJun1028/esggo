#!/usr/bin/env python3
"""
Tool Availability Checker for Hermes Agent

This script checks which tools are available in the current execution context.
Useful for cron jobs and background tasks that need to adapt to tool availability.

Usage:
    python check_tool_availability.py

Output format:
    TOOL_NAME: available|unavailable
"""

import sys
import importlib.util

TOOLS_TO_CHECK = [
    "read_terminal",
    "terminal", 
    "browser_navigate",
    "browser_click",
    "computer_use",
    "delegation",
    "mcp__*",
]

def check_tool_availability(tool_name):
    """Check if a tool is available in the current context."""
    if tool_name.startswith("mcp__"):
        # MCP tools are dynamically loaded
        return "available"  # Assume available, will fail at runtime if not
    
    try:
        # Try to import the tool module
        if tool_name == "read_terminal":
            from hermes_tools import read_terminal
            return "available"
        elif tool_name == "terminal":
            from hermes_tools import terminal
            return "available"
        elif tool_name.startswith("browser_"):
            from hermes_tools import web_search, web_extract
            return "available"
        elif tool_name == "computer_use":
            from hermes_tools import computer_use
            return "available"
        elif tool_name == "delegation":
            from hermes_tools import delegate_task
            return "available"
        else:
            return "unavailable"
    except ImportError:
        return "unavailable"
    except Exception as e:
        return f"error: {str(e)}"

def main():
    print("Hermes Tool Availability Report")
    print("=" * 40)
    
    # Check context
    try:
        import os
        context = os.environ.get('HERMES_CONTEXT', 'unknown')
        print(f"Context: {context}")
    except:
        print("Context: unknown")
    
    print()
    
    for tool in TOOLS_TO_CHECK:
        status = check_tool_availability(tool)
        print(f"{tool}: {status}")
    
    # Special note about read_terminal
    print()
    print("NOTE: read_terminal is ONLY available in Hermes Desktop App")
    print("For cron/background jobs, use: terminal() or file-based output")

if __name__ == "__main__":
    main()