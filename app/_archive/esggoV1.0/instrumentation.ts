export async function register() {
    // 暫時在測試時禁用 OpenTelemetry 以排除啟動故障
    /*
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { NodeTracerProvider } = await import('@opentelemetry/sdk-trace-node');
        // ...
    }
    */
}
