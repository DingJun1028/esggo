'use client';

import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

/**
 * 🏛️ Swagger UI Page
 * Renders the interactive API documentation using the OpenAPI spec from /api/docs/swagger-json.
 */
export default function ApiDocsPage() {
    return (
        <div className="min-h-screen bg-[#050510] py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#63a6b0]/20 to-transparent">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        InfoOne <span className="text-[#63a6b0]">API Forge</span>
                    </h1>
                    <p className="mt-2 text-white/60 text-sm">
                        Sentient Unified API Dashboard • 5T Protocol Compliant
                    </p>
                </div>

                <div className="swagger-theme-wrapper p-4 bg-white rounded-b-2xl">
                    <style jsx global>{`
                        /* Simple override to match the theme slightly better without full custom CSS */
                        .swagger-ui .topbar { display: none; }
                        .swagger-ui .info .title { color: #050510 !important; }
                        .swagger-ui .scheme-container { background: transparent !important; box-shadow: none !important; border-bottom: 1px solid #eee; }
                    `}</style>
                    <SwaggerUI url="/api/docs/swagger-json" />
                </div>
            </div>
        </div>
    );
}
