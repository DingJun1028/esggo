type LogSeverity = "DEBUG" | "INFO" | "NOTICE" | "WARNING" | "ERROR" | "CRITICAL" | "ALERT" | "EMERGENCY";

interface LogEntry {
    message: string;
    severity: LogSeverity;
    timestamp: string;
    metadata?: Record<string, unknown>;
    component?: string;
}

class Logger {
    private isDev = process.env.NODE_ENV === "development";

    private log(entry: LogEntry) {
        const { message, severity, timestamp, metadata, component } = entry;
        const formattedMessage = `[${timestamp}] [${severity}] ${component ? `[${component}] ` : ""}${message}`;

        if (this.isDev) {
            const color = this.getSeverityColor(severity);
            console.log(`%c${formattedMessage}`, color, metadata || "");
        } else {
            // In production, this would be sent to a logging service or GCP Cloud Logging via an API
            // For simulation, we'll just log it as a JSON object
            console.log(JSON.stringify(entry));
        }
    }

    private getSeverityColor(severity: LogSeverity): string {
        switch (severity) {
            case "ERROR":
            case "CRITICAL":
            case "ALERT":
            case "EMERGENCY":
                return "color: #ff4d4f; font-weight: bold;";
            case "WARNING":
                return "color: #faad14; font-weight: bold;";
            case "INFO":
            case "NOTICE":
                return "color: #1890ff;";
            default:
                return "color: #8c8c8c;";
        }
    }

    debug(message: string, metadata?: Record<string, unknown>, component?: string) {
        this.log({ message, severity: "DEBUG", timestamp: new Date().toISOString(), metadata, component });
    }

    info(message: string, metadata?: Record<string, unknown>, component?: string) {
        this.log({ message, severity: "INFO", timestamp: new Date().toISOString(), metadata, component });
    }

    warn(message: string, metadata?: Record<string, unknown>, component?: string) {
        this.log({ message, severity: "WARNING", timestamp: new Date().toISOString(), metadata, component });
    }

    error(message: string, metadata?: Record<string, unknown>, component?: string) {
        this.log({ message, severity: "ERROR", timestamp: new Date().toISOString(), metadata, component });
    }

    success(message: string, metadata?: Record<string, unknown>, component?: string) {
        this.log({ message, severity: "NOTICE", timestamp: new Date().toISOString(), metadata: { ...metadata, isSuccess: true } as Record<string, unknown>, component });
    }
}

export const logger = new Logger();
