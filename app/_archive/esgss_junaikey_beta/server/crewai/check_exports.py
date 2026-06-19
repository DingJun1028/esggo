try:
    import crewai.tools
    print("crewai.tools dir:", dir(crewai.tools))
except ImportError as e:
    print(f"Error importing crewai.tools: {e}")

try:
    from crewai.tools import tool
    print("Found 'tool' in crewai.tools")
except ImportError:
    print("'tool' NOT found in crewai.tools")

import crewai_tools
print("crewai_tools dir:", dir(crewai_tools))
