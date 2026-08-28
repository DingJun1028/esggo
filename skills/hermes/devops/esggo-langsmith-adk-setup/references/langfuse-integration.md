# Langfuse Integration Reference

## Environment Variables for .env

```
LANGFUSE_SECRET_KEY=<from-user>
LANGFUSE_PUBLIC_KEY=<from-user>
LANGFUSE_BASE_URL=https://cloud.langfuse.com
```

## Common Mistake Prevention

- Do NOT include verbose GitHub API data in responses
- Do NOT explain existing GitHub repository content
- Focus on the task at hand
- User prefers terse, direct updates

## Integration Pattern

Langfuse can be integrated alongside LangSmith for enhanced tracing and evaluation workflows.