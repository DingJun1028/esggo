# LiteLLM Proxy Dockerfile
# ==================================================
# AI Gateway for ESGss x JunAiKey Beta
# ==================================================

FROM ghcr.io/berriai/litellm:main-stable

# Copy configuration
COPY config.yaml /app/config.yaml

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4000/health || exit 1

# Run proxy with configuration
CMD ["--config", "/app/config.yaml", "--port", "4000", "--host", "0.0.0.0"]
