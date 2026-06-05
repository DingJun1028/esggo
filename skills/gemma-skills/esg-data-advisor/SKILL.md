---
uuid: "ff055f95-e2e6-4583-9fdb-ee5c6dc9e004"
version: "1.0.0"
timestamp: "2026-06-04T10:36:12.392Z"
evidence: "skills\gemma-skills\esg-data-advisor\SKILL.md"
---
# ESG Data Processing and Compliance Advisor Skill

This skill assists with processing ESG-related data, checking for compliance with various standards (like GRI), and providing actionable insights. It is designed to be extensible and iterative, allowing for continuous improvement and addition of new functionalities.

## Capabilities:

*   **Data Analysis:** Analyze raw ESG data from various sources.
*   **Compliance Check:** Verify data against specified ESG compliance frameworks (e.g., GRI, ISO 14064-1).
*   **Report Generation:** Generate summarized reports or specific data points based on analysis.
*   **Recommendation:** Provide recommendations for improving ESG performance or compliance.

## Input:

The skill can accept various forms of ESG-related input, including but not limited to:
*   Structured data (JSON, CSV).
*   Unstructured text (company reports, news articles).
*   Specific queries regarding compliance or data points.

## Output:

The skill can produce various forms of output, including but not limited to:
*   JSON object with analyzed data and compliance scores.
*   Markdown formatted summary reports.
*   Specific answers to compliance-related questions.
*   Recommendations for action.

## Memory Principle: Skill-Fragmented Knowledge

This skill adheres to the principle of "memory as skill fragments," operating largely without persistent, internal state between invocations. All necessary context or "memory" for an action must either be:
1.  **Provided explicitly as input** for each invocation.
2.  **Encapsulated directly within the skill's logic** (e.g., hardcoded standards, internal lookup tables).

This design promotes statelessness, reproducibility, and prevents reliance on external, mutable agent memory, allowing for robust and independent operation.

## Actions:

### `analyzeESGData`
*   **Description:** Analyzes provided ESG data and extracts key metrics.
*   **Input:**
    ```json
    {
        "data": "string", // Raw ESG data (can be JSON string, CSV string, or plain text)
        "dataType": "string", // "json", "csv", "text"
        "focusAreas": ["string"] // Optional: e.g., ["environmental", "social", "governance"]
    }
    ```
*   **Output:**
    ```json
    {
        "metrics": {}, // Key-value pairs of extracted metrics
        "summary": "string" // A brief summary of the analysis
    }
    ```

### `checkGRICompliance`
*   **Description:** Checks provided data against GRI compliance standards.
*   **Input:**
    ```json
    {
        "esgReportSegment": "string", // A segment of an ESG report or specific data point
        "griStandard": "string" // e.g., "GRI 2-7", "GRI 305-1"
    }
    ```
*   **Output:**
    ```json
    {
        "complianceStatus": "string", // "compliant", "non-compliant", "partially-compliant"
        "details": "string", // Explanation of compliance status
        "recommendations": ["string"] // Suggestions for improving compliance
    }
    ```