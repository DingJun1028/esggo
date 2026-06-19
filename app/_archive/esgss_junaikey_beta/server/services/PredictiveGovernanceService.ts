import { ambientDataService, AmbientMeasurement } from './AmbientDataService.js';
import { omniLogger, LogCategory } from './omni/infrastructure/logging/OmniLogger.js';
import { EventEmitter } from 'events';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { type IComponentCore } from './OmniComponentCore.js';
import crypto from 'crypto';

export interface PredictiveAlert {
    id: string;
    type: 'RISK' | 'OPPORTUNITY' | 'NEUTRAL';
    impactArea: 'E' | 'S' | 'G';
    confidence: number;
    description: string;
    recommendation: string;
    timestamp: number;
    core?: IComponentCore; // 5T standard core
}

/**
 * Phase 45: Predictive Governance Service
 * This service consumes real-time ambient data and uses AI to forecast ESG trends.
 */
export class PredictiveGovernanceService extends EventEmitter {
    private history: AmbientMeasurement[] = [];
    private maxHistory: number = 100;
    private genAI: GoogleGenerativeAI;
    private model: any;
    private isAnalyzing: boolean = false;
    private alerts: PredictiveAlert[] = [];

    constructor() {
        super();
        const apiKey = process.env.GEMINI_API_KEY || '';
        this.genAI = new GoogleGenerativeAI(apiKey);
        // ✅ Model upgrade: gemini-1.5-pro → gemini-2.0-flash (stable and available)
        this.model = this.genAI.getGenerativeModel({ 
            model: 'gemini-2.0-flash',
            generationConfig: {
                temperature: 0.4,
                topK: 32,
                topP: 0.95,
                maxOutputTokens: 8192,
            }
        });
        this.subscribeToFlux();
        omniLogger.info(LogCategory.AI, 'Predictive Governance Service initialized with raw Neural Engine.');
    }

    private subscribeToFlux() {
        ambientDataService.on('measurement', (m: AmbientMeasurement) => {
            const prev = this.history[this.history.length - 1];
            this.history.push(m);
            if (this.history.length > this.maxHistory) {
                this.history.shift();
            }

            // Volatility Detection: Rapid change check
            if (prev && Math.abs(m.value - prev.value) > prev.value * 0.5) {
                omniLogger.warn(`[Predictive-Governance] High Volatility Detected in ${m.type}. Triggering priority analysis.`);
                this.analyzeTrends(true);
            }
            // Regular Pulse: Trigger analysis after enough data
            else if (m.isAnomaly || (this.history.length > 0 && this.history.length % 15 === 0)) {
                this.analyzeTrends();
            }
        });

        ambientDataService.on('anomaly', (m: AmbientMeasurement) => {
            omniLogger.info(LogCategory.AI, `Critical Anomaly in ${m.type} triggering immediate prophetic analysis.`);
            this.analyzeTrends(true);
        });
    }

    private async analyzeTrends(isCritical: boolean = false) {
        if (this.isAnalyzing && !isCritical) return;
        this.isAnalyzing = true;

        try {
            const context = JSON.stringify(this.history.slice(-20)); // Last 20 data points
            const prompt = `
                As an AI ESG Guardian, analyze the following real-time sensor data pulse:
                ${context}
                
                Identify any potential ESG risks or opportunities based on these trends.
                Return ONLY a JSON object with this schema:
                {
                    "type": "RISK" | "OPPORTUNITY" | "NEUTRAL",
                    "impactArea": "E" | "S" | "G",
                    "confidence": number (0-1),
                    "description": "Short summary in Traditional Chinese",
                    "recommendation": "Suggested action in Traditional Chinese",
                    "logic": "Step-by-step reasoning for the prediction"
                }
            `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

            let analysis;
            try {
                analysis = JSON.parse(text);
            } catch (e) {
                // Fallback if AI output is not perfect JSON
                analysis = {
                    type: 'NEUTRAL',
                    impactArea: 'E',
                    confidence: 0.5,
                    description: '數據波動偵測，AI 推理進行中。',
                    recommendation: '持續監控環境數據流。'
                };
            }

            if (analysis) {
                const traceId = `prophecy-${crypto.randomUUID()}`;

                // Construct v10.1 5T Core for the Prophecy
                const core: IComponentCore = {
                    uuid: traceId,
                    version: '10.1.0-sentient',
                    timestamp: Date.now(),
                    status: 'Calculated',
                    evidence: {
                        tangible: {
                            metric: `Confidence: ${(analysis.confidence * 100).toFixed(1)}%`,
                            verified_at: Date.now(),
                            visual_grade: analysis.confidence > 0.8 ? 'SOVEREIGN' : (analysis.confidence > 0.6 ? 'PLATINUM' : 'GOLD')
                        },
                        traceable: {
                            source_origin: 'PredictiveGovernanceService:Neural_Engine',
                            owner: 'ESGss_Sentinel'
                        },
                        transparent: {
                            formula: 'Gemini-1.5-Flash:ESG_Prophecy_V2',
                            validation_standard: analysis.logic || 'Neural pattern matching based on rolling window history.'
                        },
                        trustworthy: {
                            hash_lock: crypto.createHash('sha256').update(text).digest('hex'),
                            is_frozen: true
                        }
                    }
                };

                const alert: PredictiveAlert = {
                    id: traceId,
                    type: analysis.type,
                    impactArea: analysis.impactArea,
                    confidence: analysis.confidence,
                    description: analysis.description,
                    recommendation: analysis.recommendation,
                    timestamp: Date.now(),
                    core
                };

                this.alerts.unshift(alert);
                if (this.alerts.length > 50) this.alerts.pop();

                this.emit('alert', alert);
                omniLogger.info(LogCategory.AI, `Prophetic Insight Generated: ${alert.description}`);
            }
        } catch (error: any) {
            omniLogger.error(LogCategory.AI, `Failed to perform prophetic analysis: ${error.message}`);
        } finally {
            this.isAnalyzing = false;
        }
    }

    public getLatestAlerts(): PredictiveAlert[] {
        return this.alerts;
    }
}

export const predictiveGovernanceService = new PredictiveGovernanceService();
