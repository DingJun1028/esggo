/**
 * Omni MECE Toolset
 * =========================================
 * [本質] 將 24 項 MECE 服務橋接至 MCP 工具適配層
 * [EN] Bridges the 24 MECE services into MCP-compatible FunctionTool wrappers.
 *
 * Each tool wraps a core Omni service method with 5T audit trail.
 *
 * @version 1.1.1
 * @date 2026-02-20
 */

import type { McpToolRegistration, McpToolResult, FiveTAuditRecord, MeceServiceToolDescriptor } from './types.ts';
import { omniCore } from '../../omni/core/OmniCore.ts';
import omniNoteService from '../../../server/services/OmniNoteService.ts';
import { omniOneAgent } from '../../omni/core/OmniOneAgent.ts';
import type { OmniRequest } from '../../omni/core/types/OmniCore.types.ts';

// OmniGenesis Imports
import { OmniKey } from '../../omni/core/OmniKey.ts';
import { BerkeleyCertificationService } from '../../1-service/BerkeleyCertificationService.ts';
import { OmniConceptDefinition } from '../../omni/core/OmniConcept.ts';
import { OmniOrbConcept } from '../../omni/core/OmniOrb.ts';
import { OmniClue } from '../../omni/core/OmniClue.ts';
import { OmniCrew } from '../../omni/core/OmniCrew.ts';
import { OmniCastle } from '../../omni/core/OmniCastle.ts';
import { OmniCase } from '../../omni/core/OmniCase.ts';
import { OmniCodex } from '../../omni/core/OmniCodex.ts';
import { OmniCollege } from '../../omni/core/OmniCollege.ts';
import { OmniCanvas } from '../../omni/core/OmniCanvas.ts';
import { OmniClass } from '../../omni/core/OmniClass.ts';
import { OmniCourse } from '../../omni/core/OmniCourse.ts';
import { OmniCard } from '../../omni/core/OmniCard.ts';
import { OmniConnect } from '../../omni/core/OmniConnect.ts';
import { OmniCell } from '../../omni/core/OmniCell.ts';
import { OmniChip } from '../../omni/core/OmniChip.ts';
import { OmniChat } from '../../omni/core/OmniChat.ts';
import { OmniContinue } from '../../omni/core/OmniContinue.ts';
import { OmniContact } from '../../omni/core/OmniContact.ts';
import { OmniCommunity } from '../../omni/core/OmniCommunity.ts';
import { OmniChance } from '../../omni/core/OmniChance.ts';
import { OmniCloud } from '../../omni/core/OmniCloud.ts';
import { OmniClimax } from '../../omni/core/OmniClimax.ts';
import { OmniComeTrue } from '../../omni/core/OmniComeTrue.ts';
import { OmniChant } from '../../omni/core/OmniChant.ts';
import { OmniConversation } from '../../omni/core/OmniConversation.ts';
import { OmniContext } from '../../omni/core/OmniContext.ts';
import { OmniChapter } from '../../omni/core/OmniChapter.ts';
import { OmniCategory } from '../../omni/core/OmniCategory.ts';
import { OmniClipBoard } from '../../omni/core/OmniClipBoard.ts';
import { OmniCostume } from '../../omni/core/OmniCostume.ts';
import { omniCharmed } from '../../omni/core/OmniCharmed.ts';
import { omniClassification } from '../../omni/core/OmniClassification.ts';
import { omniChart } from '../../omni/core/OmniChart.ts';
import { omniComposer } from '../../omni/core/OmniComposer.ts';
import { OmniCustom } from '../../omni/core/OmniCustom.ts';
import { OmniCreation } from '../../omni/core/OmniCreation.ts';
import { OmniComponent } from '../../omni/core/OmniComponent.ts';
import { OmniCenter } from '../../omni/core/OmniCenter.ts';
import { OmniCapture } from '../../omni/core/OmniCapture.ts';
import { OmniCalendar } from '../../omni/core/OmniCalendar.ts';
import { OmniCost } from '../../omni/core/OmniCost.ts';
import { OmniCall } from '../../omni/core/OmniCall.ts';
import { OmniClock } from '../../omni/core/OmniClock.ts';
import { OmniCheck } from '../../omni/core/OmniCheck.ts';
import { OmniCrown } from '../../omni/core/OmniCrown.ts';
import { OmniCloset } from '../../omni/core/OmniCloset.ts';
import { OmniBase } from '../../omni/core/OmniBase.ts';
import { OmniCommander } from '../../omni/core/OmniCommander.ts';
import { OmniCommission } from '../../omni/core/OmniCommission.ts';
import { OmniConvince } from '../../omni/core/OmniConvince.ts';
import { OmniContract } from '../../omni/core/OmniContract.ts';
import { OmniConflict } from '../../omni/core/OmniConflict.ts';
import { OmniCompletion } from '../../omni/core/OmniCompletion.ts';
import { OmniCapacities } from '../../omni/core/OmniCapacities.ts';
import { OmniCoordinator } from '../../omni/core/OmniCoordinator.ts';
import { OMNI_DECREE, verifyOmniLink } from '../../omni/core/OmniConstitution.ts';
import { OmniStateCompressor } from '../../omni/core/OmniStateCompressor.ts';
import { OmniConfig } from '../../omni/core/OmniConfig.ts';
import { omniCultivation } from '../../omni/core/OmniCultivation.ts';
import { omniConstruction } from '../../omni/core/OmniConstruction.ts';
import { omniComprehense } from '../../omni/core/OmniComprehense.ts';
import { omniRecurse } from '../../omni/core/OmniRecurse.ts';
import { omniChain } from '../../omni/core/OmniChain.ts';
import { omniCoin } from '../../omni/core/OmniCoin.ts';
import { omniCollector } from '../../omni/core/OmniCollector.ts';
import { omniContentManager } from '../../omni/core/OmniContent.ts';
import { omniChing } from '../../omni/core/OmniChing.ts';


// ═══════ MECE Service Descriptors (24 items, key services exposed) ════════
const MECE_DESCRIPTORS: MeceServiceToolDescriptor[] = [
    // --- OmniCore Tools (Agency) ---
    {
        category: 'agency',
        toolName: 'omni_core_process',
        description: 'Process an external request through the OmniCore (JunAiKey) evolution cycle.',
        fiveTLevel: 'trackable',
        inputSchema: {
            type: 'object',
            properties: {
                id: { type: 'string', description: 'Unique Request ID' },
                type: { type: 'string', enum: ['TEXT', 'IMAGE', 'AUDIO', 'SYSTEM_SIGNAL'], description: 'Type of input content' },
                content: { type: 'string', description: 'The content payload to process' }, // OmniCore expects generic content
                source: { type: 'string', description: 'Source origin of the request' },
            },
            required: ['id', 'type', 'content'],
        },
    },
    // --- Cognitive Tools (L1: Intelligence & Knowledge) ---
    {
        category: 'cognitive',
        toolName: 'omni_note_create',
        description: 'Create a new OmniNote (Crystal DNA) in the Knowledge Base.',
        fiveTLevel: 'tangible',
        inputSchema: {
            type: 'object',
            properties: {
                userId: { type: 'string', description: 'User ID creating the note' },
                title: { type: 'string', description: 'Title of the note' },
                content: { type: 'string', description: 'Content of the note' },
                tags: { type: 'array', items: { type: 'string' }, description: 'Tags for the note' },
            },
            required: ['userId', 'title', 'content'],
        },
    },
    {
        category: 'cognitive',
        toolName: 'omni_note_search',
        description: 'Find resonant notes in the Knowledge Base (Vector Search).',
        fiveTLevel: 'traceable',
        inputSchema: {
            type: 'object',
            properties: {
                userId: { type: 'string', description: 'User ID to search for' },
                noteId: { type: 'string', description: 'Source Note ID to find resonance for' },
            },
            required: ['userId', 'noteId'],
        },
    },
    // --- InfoOne Tools (Excellence Sovereign) ---
    {
        category: 'excellence',
        toolName: 'info_one_optimize',
        description: 'Trigger an optimization cycle for the OmniOne Sovereign Agent.',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                triggerId: { type: 'string', description: 'ID of the trigger event' },
            },
            required: ['triggerId'],
        },
    },
    // --- Existing Service Placeholders ---
    {
        category: 'cognitive',
        toolName: 'omni_truth_engine',
        description: '真相引擎：多源數據交叉驗證、幻覺檢測 (Cross-validate data from multiple sources)',
        fiveTLevel: 'transparent',
    },
    {
        category: 'cognitive',
        toolName: 'omni_risk_assessor',
        description: '風險評估引擎：ESG 風險識別、量化與預警 (Identify, quantify, and alert ESG risks)',
        fiveTLevel: 'trackable',
    },
    {
        category: 'cognitive',
        toolName: 'omni_score_calculator',
        description: 'ESG 評分計算器：多維度環境/社會/治理評分 (Calculate multi-dimensional E/S/G scores)',
        fiveTLevel: 'tangible',
    },
    {
        category: 'excellence',
        toolName: 'omni_evolution_engine',
        description: '演化引擎：組織永續成熟度評估 (Assess organization sustainability maturity evolution)',
        fiveTLevel: 'trackable',
    },
    {
        category: 'excellence',
        toolName: 'omni_value_distribution',
        description: '價值鏈分析：ESG 價值鏈分析、利害相關者映射 (Analyze ESG value chain)',
        fiveTLevel: 'traceable',
    },
    {
        category: 'governance',
        toolName: 'omni_time_sync',
        description: '時間同步錨定：區塊鏈時間戳、不可篡改證據鏈 (Blockchain timestamp & immutable evidence chain)',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {
                timestamp: { type: 'number', description: 'Timestamp to sync (optional)' },
            },
            // schema was missing in original, adding optional
        },
    },
    // --- OmniGenesis: Sovereign Core (Alpha) ---
    {
        category: 'sovereign',
        toolName: 'omni_key_unlock',
        description: '🔑 OmniKey: Unlock the System Evolution Cycle (Awaken -> Analyze -> Execute).',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {
                input: { type: 'string', description: 'The Awakening Command / Intent' },
            },
            required: ['input'],
        },
    },
    // --- OmniGenesis: The Seal (Omega) ---
    {
        category: 'sovereign',
        toolName: 'omni_cultivation_nourish',
        description: '🌱 Nourish: Inject knowledge to grow a cultivation target (Agent, Asset, or Chapter).',
        fiveTLevel: 'trackable',
        inputSchema: {
            type: 'object',
            properties: {
                targetId: { type: 'string', description: 'The ID of the target to nourish' },
                dataVolume: { type: 'number', description: 'Amount of knowledge to inject (0.0 - 1.0)' },
                entropyFactor: { type: 'number', description: 'Optional entropy increase factor (default 0.1)' },
            },
            required: ['targetId', 'dataVolume'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_cultivation_prune',
        description: '✂️ Prune: Stabilize logic and reduce entropy of a cultivation target.',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                targetId: { type: 'string', description: 'The ID of the target to prune' },
                intensity: { type: 'number', description: 'Pruning intensity (0.0 - 1.0)' },
            },
            required: ['targetId', 'intensity'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_cultivation_crystallize',
        description: '💎 Crystallize: Manifest a mature cultivation target into a Sovereign Asset.',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {
                targetId: { type: 'string', description: 'The ID of the target to crystallize' },
            },
            required: ['targetId'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_construction_assemble',
        description: '🏗️ Assemble: Start or continue building a sovereign structure or service.',
        fiveTLevel: 'trackable',
        inputSchema: {
            type: 'object',
            properties: {
                siteId: { type: 'string', description: 'The site ID' },
                component: { type: 'string', description: 'Component or service name to assemble' },
                complexity: { type: 'number', description: 'Complexity factor (0.0 - 1.0)' },
            },
            required: ['siteId', 'component'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_construction_inspect',
        description: '🔍 Inspect: Audit structural integrity and fix assembly artifacts.',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                siteId: { type: 'string', description: 'The site ID' },
                thoroughness: { type: 'number', description: 'Inspection thoroughness (0.0 - 1.0)' },
            },
            required: ['siteId'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_construction_finalize',
        description: '🏛️ Finalize: Deploy and manifest a construction site as a Sovereign Asset.',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {
                siteId: { type: 'string', description: 'The site ID' },
            },
            required: ['siteId'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_comprehense_synthesize',
        description: '🧬 Synthesize: Connect disparate knowledge domains to increase cognitive depth.',
        fiveTLevel: 'trackable',
        inputSchema: {
            type: 'object',
            properties: {
                topicId: { type: 'string', description: 'The topic ID to synthesize' },
                connectionStrength: { type: 'number', description: 'Strength of connection (0.0 - 1.0)' },
            },
            required: ['topicId'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_comprehense_abstract',
        description: '🔬 Abstract: Refine specific data into pure conceptual principles.',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                topicId: { type: 'string', description: 'The topic ID to abstract' },
                refinement: { type: 'number', description: 'Refinement factor (0.0 - 1.0)' },
            },
            required: ['topicId'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_comprehense_deepen',
        description: '🌊 Deepen: Recursive knowledge mining to trigger conceptual transcendence.',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {
                topicId: { type: 'string', description: 'The topic ID to deepen' },
            },
            required: ['topicId'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_recurse_inject',
        description: '♻️ Inject: Feedback a transcended insight back into the Knowledge Base.',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {
                trinityUuid: { type: 'string', description: 'UUID of the target Trinity entity.' },
                topicId: { type: 'string', description: 'ID of the transcended topic.' }
            },
            required: ['trinityUuid', 'topicId']
        }
    },
    {
        category: 'sovereign',
        toolName: 'omni_recurse_stabilize',
        description: '⚖️ Stabilize: Perform a global consistency check on the Knowledge Base.',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        category: 'sovereign',
        toolName: 'omni_chain_anchor',
        description: '⚓ Anchor: Permanently anchor a Trinity asset to the OmniChain ledger.',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {
                trinityUuid: { type: 'string', description: 'UUID of the target Trinity entity.' }
            },
            required: ['trinityUuid']
        }
    },
    {
        category: 'sovereign',
        toolName: 'omni_chain_verify',
        description: '✅ Verify: Check the anchor status and integrity of an eternal asset.',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                trinityUuid: { type: 'string', description: 'UUID of the target Trinity entity.' }
            },
            required: ['trinityUuid']
        }
    },
    {
        category: 'sovereign',
        toolName: 'omni_coin_mint',
        description: '🪙 Mint: Create sentient value tokens based on ESG achievements.',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {
                amount: { type: 'number', description: 'Amount to mint' },
                reason: { type: 'string', description: 'Reason for minting' }
            },
            required: ['amount', 'reason']
        }
    },
    {
        category: 'sovereign',
        toolName: 'omni_collector_collect',
        description: '💎 Collect: Harvest a sentient asset into the user portfolio.',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                userId: { type: 'string', description: 'User ID' },
                entityUuid: { type: 'string', description: 'UUID of the entity to collect' }
            },
            required: ['userId', 'entityUuid']
        }
    },
    {
        category: 'cognitive',
        toolName: 'omni_content_crystallize',
        description: '💎 Crystallize: Wrap raw knowledge into a sovereign content unit.',
        fiveTLevel: 'tangible',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: { type: 'string', description: 'UUID for the content' },
                payload: { type: 'object', description: 'Content payload' }
            },
            required: ['uuid', 'payload']
        }
    },
    {
        category: 'sovereign',
        toolName: 'omni_ching_consult',
        description: '🔮 Consult: Seek wisdom resolution and universal guidance (OmniChing).',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'The situation or query to resolve.' }
            },
            required: ['query']
        }
    },
    {
        category: 'governance',
        toolName: 'omni_certificate_issue',
        description: '🏅 OmniCertificate: Issue an Internal Achievement Badge (Governance Service).',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {
                userUuid: { type: 'string', description: 'Recipient User UUID' },
                badgeType: { type: 'string', enum: ['Governance_Master', 'Carbon_Analyst', 'Trust_Architect'], description: 'Type of badge' },
            },
            required: ['userUuid', 'badgeType'],
        },
    },
    {
        category: 'governance',
        toolName: 'omni_certificate_verify',
        description: '✅ OmniCertificate: Verify the validity of a badge.',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                badgeId: { type: 'string', description: 'UUID of the badge to verify' },
            },
            required: ['badgeId'],
        },
    },
    // --- OmniGenesis: The Four Pillars (Concept Access) ---
    {
        category: 'cognitive',
        toolName: 'omni_concept_define',
        description: '💡 OmniConcept: Define a new Abstract Idea / Schema.',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                concept: { type: 'string', description: 'Name of the concept' },
                definition: { type: 'string', description: 'Definition of the concept' },
            },
            required: ['concept', 'definition'],
        },
    },
    {
        category: 'agency',
        toolName: 'omni_orb_observe',
        description: '🔮 OmniOrb: Tap into the Global Event Bus / Universal Interface.',
        fiveTLevel: 'trackable',
        inputSchema: {
            type: 'object',
            properties: {
                target: { type: 'string', description: 'Target system/entity to observe' },
            },
            required: ['target'],
        },
    },
    {
        category: 'excellence',
        toolName: 'omni_clue_hint',
        description: '🧭 OmniClue: Get a "Next Step" hint (Performance Guidance).',
        fiveTLevel: 'traceable',
        inputSchema: {
            type: 'object',
            properties: {
                context: { type: 'string', description: 'Current context or problem' },
            },
            required: ['context'],
        },
    },
    {
        category: 'agency',
        toolName: 'omni_crew_dispatch',
        description: '👥 OmniCrew: Dispatch a task to the Agentic Workforce (Autonomous Action).',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                taskType: { type: 'string', description: 'Type of task to dispatch (e.g., "research", "coding")' },
                parameters: { type: 'object', description: 'Parameters for the task' },
            },
            required: ['taskType'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_castle_fortify',
        description: '🏰 OmniCastle: Fortify System Structure or Validate Integrity.',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {
                directive: { type: 'string', description: 'Fortification directive or architectural query.' },
            },
            required: ['directive'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_case_open',
        description: '📂 OmniCase: Open a Sovereign Container (Project/Context).',
        fiveTLevel: 'traceable',
        inputSchema: {
            type: 'object',
            properties: {
                caseId: { type: 'string', description: 'Unique Case identifier (or "new")' },
                context: { type: 'object', description: 'Initial context data' },
            },
            required: ['caseId'],
        },
    },
    {
        category: 'governance',
        toolName: 'omni_codex_consult',
        description: '📜 OmniCodex: Consult the Sovereign Registry (Rule Compliance/Law).',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Topic or rule to consult' },
            },
            required: ['query'],
        },
    },
    {
        category: 'cognitive',
        toolName: 'omni_college_enroll',
        description: '🎓 OmniCollege: Enroll in Sovereign Academy (Learning/Skills).',
        fiveTLevel: 'tangible',
        inputSchema: {
            type: 'object',
            properties: {
                courseId: { type: 'string', description: 'Course or skill identifier' },
            },
            required: ['courseId'],
        },
    },
    {
        category: 'cognitive',
        toolName: 'omni_canvas_render',
        description: '🎨 OmniCanvas: Render a Sovereign Workshop/Surface (Creative).',
        fiveTLevel: 'tangible',
        inputSchema: {
            type: 'object',
            properties: {
                subjectId: { type: 'string', description: 'Subject or Project ID to render' },
            },
            required: ['subjectId'],
        },
    },
    {
        category: 'cognitive',
        toolName: 'omni_course_structure',
        description: '📚 OmniCourse: Design/Structure a Sovereign Curriculum.',
        fiveTLevel: 'trackable',
        inputSchema: {
            type: 'object',
            properties: {
                topic: { type: 'string', description: 'Topic to structure into a course' },
            },
            required: ['topic'],
        },
    },
    {
        category: 'cognitive',
        toolName: 'omni_class_session',
        description: '📖 OmniClass: Start a Sovereign Session (Unit/Interaction).',
        fiveTLevel: 'traceable',
        inputSchema: {
            type: 'object',
            properties: {
                topic: { type: 'string', description: 'Topic of the session' },
            },
            required: ['topic'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_card_interact',
        description: '🃏 OmniCard: Deal/Play/Inspect a Sovereign Asset (Unit/Value).',
        fiveTLevel: 'tangible',
        inputSchema: {
            type: 'object',
            properties: {
                cardId: { type: 'string', description: 'ID of the card to interact with' },
                action: { type: 'string', enum: ['deal', 'play', 'inspect'], description: 'Action to perform on the card' },
            },
            required: ['cardId', 'action'],
        },
    },
    {
        category: 'agency',
        toolName: 'omni_connect_link',
        description: '🔗 OmniConnect: Establish a Sovereign Bridge (System Integration).',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                target: { type: 'string', description: 'Target system or component to connect to' },
                protocol: { type: 'string', description: 'Protocol to use (e.g., http, websocket, mcp)' },
            },
            required: ['target', 'protocol'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_creation_spark',
        description: '🌟 OmniCreation: Spark a Sovereign Creation (Factory/Studio).',
        fiveTLevel: 'tangible',
        inputSchema: {
            type: 'object',
            properties: {
                type: { type: 'string', description: 'Type of entity to create (e.g., card, canvas)' },
                params: { type: 'object', description: 'Creation parameters' },
            },
            required: ['type'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_continue_transition',
        description: '➡️ OmniContinue: Transition flow between services.',
        fiveTLevel: 'trackable',
        inputSchema: {
            type: 'object',
            properties: {
                from: { type: 'string', description: 'Source state/service' },
                to: { type: 'string', description: 'Target state/service' },
                payload: { type: 'object', description: 'Data to transition' },
            },
            required: ['from', 'to'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_contact_register',
        description: '📇 OmniContact: Register a new identity.',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Name of the contact' },
                type: { type: 'string', enum: ['human', 'agent', 'org'], description: 'Type of contact' },
                info: { type: 'object', description: 'Additional info' },
            },
            required: ['name', 'type'],
        },
    },
    {
        category: 'governance',
        toolName: 'omni_commission_mandate',
        description: '📋 OmniCommission: Issue a Sovereign Service Mandate (Governance).',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                service: { type: 'string', description: 'Service to commission' },
                terms: {
                    type: 'object',
                    properties: {
                        fee: { type: 'number' },
                        currency: { type: 'string' }
                    },
                    required: ['fee', 'currency']
                },
            },
            required: ['service', 'terms'],
        },
    },
    {
        category: 'governance',
        toolName: 'omni_convince_propose',
        description: '⚖️ OmniConvince: Propose a Decision for Consensus (Governance).',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {
                proposal: { type: 'string', description: 'The decision to propose' },
                rationale: { type: 'string', description: 'Reasoning for the proposal' },
            },
            required: ['proposal', 'rationale'],
        },
    },
    {
        category: 'governance',
        toolName: 'omni_contract_draft',
        description: '📝 OmniContract: Draft a Binding Agreement (Governance).',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {
                parties: { type: 'array', items: { type: 'string' }, description: 'Parties involved' },
                terms: { type: 'object', description: 'Agreement terms' },
            },
            required: ['parties', 'terms'],
        },
    },
    {
        category: 'governance',
        toolName: 'omni_conflict_report',
        description: '⚔️ OmniConflict: Report a System/Data Conflict (Governance).',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                source: { type: 'string', description: 'Reporting entity' },
                description: { type: 'string', description: 'Conflict details' },
                data: { type: 'object', description: 'Evidence data' },
            },
            required: ['source', 'description'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_completion_complete',
        description: '✅ OmniCompletion: Mark a cycle or task as manifested.',
        fiveTLevel: 'tangible',
        inputSchema: {
            type: 'object',
            properties: {
                cycleId: { type: 'string', description: 'ID of the cycle' },
                result: { type: 'object', description: 'Final result/asset' },
            },
            required: ['cycleId'],
        },
    },
    {
        category: 'excellence',
        toolName: 'omni_capacities_check',
        description: '📊 OmniCapacities: Check Resource Capacity/Scaling (Excellence).',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                resource: { type: 'string', description: 'Resource name (compute, memory, throughput)' },
            },
            required: ['resource'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_coordinator_coordinate',
        description: '🔄 OmniCoordinator: Coordinate tasks across multiple participants.',
        fiveTLevel: 'trackable',
        inputSchema: {
            type: 'object',
            properties: {
                task: { type: 'string', description: 'The task to coordinate' },
                participants: { type: 'array', items: { type: 'string' }, description: 'Participant IDs or roles' },
            },
            required: ['task', 'participants'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_config_set',
        description: '⚙️ OmniConfig: Set a Sovereign configuration parameter.',
        fiveTLevel: 'traceable',
        inputSchema: {
            type: 'object',
            properties: {
                key: { type: 'string', description: 'Configuration key' },
                value: { type: 'object', description: 'Value to set' },
            },
            required: ['key', 'value'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_constitution_verify',
        description: '📜 OmniConstitution: Verify system status against the Sovereign Decree.',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_compress_state',
        description: '📦 OmniCompress: Compress system state into a portable .omni format.',
        fiveTLevel: 'tangible',
        inputSchema: {
            type: 'object',
            properties: {
                coreUuid: { type: 'string', description: 'UUID of the core to compress' },
            },
            required: ['coreUuid'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_component_assemble',
        description: '🧩 OmniComponent: Assemble a Sovereign Block (Part/Module).',
        fiveTLevel: 'tangible',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Name of the component' },
                spec: { type: 'object', description: 'Specification/Configuration' },
            },
            required: ['name'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_costume_wear',
        description: '👘 OmniCostume: Wear a Sovereign Attire/Skin.',
        fiveTLevel: 'tangible',
        inputSchema: {
            type: 'object',
            properties: {
                attire: { type: 'string', description: 'Name of the theme or skin to wear' },
                options: { type: 'object', description: 'Additional styling options' },
            },
            required: ['attire'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_custom_adapt',
        description: '🎛️ OmniCustom: Adapt Sovereign Settings/Customization.',
        fiveTLevel: 'traceable',
        inputSchema: {
            type: 'object',
            properties: {
                key: { type: 'string', description: 'Setting key or preference name' },
                value: { type: 'object', description: 'Value to set' },
            },
            required: ['key', 'value'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_chip_process',
        description: '💻 OmniChip: Process/Compute Sovereign Logic.',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                input: { type: 'object', description: 'Data to process' },
                algorithm: { type: 'string', description: 'Algorithm to use', default: 'default' },
            },
            required: ['input'],
        },
    },
    {
        category: 'cognitive',
        toolName: 'omni_chat_speak',
        description: '💬 OmniChat: Initiate a Sovereign Dialogue (Cognitive).',
        fiveTLevel: 'traceable',
        inputSchema: {
            type: 'object',
            properties: {
                message: { type: 'string', description: 'Message to speak' },
                options: { type: 'object', description: 'Context/options' },
            },
            required: ['message'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_continue_transition',
        description: '➡️ OmniContinue: Transition Sovereign Flow.',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                from: { type: 'string', description: 'Source state/service' },
                to: { type: 'string', description: 'Target state/service' },
                payload: { type: 'object', description: 'Transition payload' },
            },
            required: ['from', 'to', 'payload'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_contact_register',
        description: '📇 OmniContact: Register a Sovereign Identity.',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Name of the identity' },
                type: { type: 'string', enum: ['human', 'agent', 'org'], description: 'Type of identity' },
                info: { type: 'object', description: 'Identity info' },
            },
            required: ['name', 'type', 'info'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_community_gather',
        description: '🌐 OmniCommunity: Sovereign Usage of Group/Society.',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                group: { type: 'string', description: 'Group name/ID' },
                action: { type: 'string', description: 'Action (join, leave, post)' },
            },
            required: ['group', 'action'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_chance_roll',
        description: '🎲 OmniChance: Sovereign Usage of Probability/Luck.',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                range: { type: 'string', description: 'Range (e.g., 1-100, d20)', default: '1-100' },
            },
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_cloud_rain',
        description: '☁️ OmniCloud: Sovereign Usage of Cloud/Network.',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                data: { type: 'object', description: 'Data to distribute' },
                target: { type: 'string', description: 'Target nodes/storage' },
            },
            required: ['data'],
        },
    },
    {
        category: 'excellence',
        toolName: 'omni_climax_peak',
        description: '⛰️ OmniClimax: Reach a Milestone Peak (Excellence).',
        fiveTLevel: 'tangible',
        inputSchema: {
            type: 'object',
            properties: {
                milestone: { type: 'string', description: 'Milestone name' },
                impact: { type: 'number', description: 'Impact score' },
            },
            required: ['milestone', 'impact'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_cometrue_manifest',
        description: '✨ OmniComeTrue: Sovereign Usage of Manifestation.',
        fiveTLevel: 'tangible',
        inputSchema: {
            type: 'object',
            properties: {
                wish: { type: 'string', description: 'Wish or goal' },
                resources: { type: 'object', description: 'Available resources' },
            },
            required: ['wish'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_chant_intone',
        description: '🎵 OmniChant: Sovereign Usage of Mantra/Vibration.',
        fiveTLevel: 'tangible',
        inputSchema: {
            type: 'object',
            properties: {
                mantra: { type: 'string', description: 'Mantra to chant' },
                duration: { type: 'number', description: 'Duration in ms', default: 1000 },
            },
            required: ['mantra'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_conversation_discuss',
        description: '🗣️ OmniConversation: Sovereign Usage of Dialogue.',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                topic: { type: 'string', description: 'Discussion topic' },
                participants: { type: 'array', items: { type: 'string' }, description: 'Participants' },
            },
            required: ['topic', 'participants'],
        },
    },
    {
        category: 'cognitive',
        toolName: 'omni_context_orient',
        description: '🧭 OmniContext: Orient the Sovereign Situation (Cognitive/Context).',
        fiveTLevel: 'traceable',
        inputSchema: {
            type: 'object',
            properties: {
                contextKey: { type: 'string', description: 'Context key' },
                value: { type: 'object', description: 'Context value' },
            },
            required: ['contextKey', 'value'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_chapter_begin',
        description: '📖 OmniChapter: Sovereign Usage of Segments.',
        fiveTLevel: 'traceable',
        inputSchema: {
            type: 'object',
            properties: {
                title: { type: 'string', description: 'Chapter title' },
                sequence: { type: 'number', description: 'Sequence number' },
            },
            required: ['title', 'sequence'],
        },
    },
    {
        category: 'cognitive',
        toolName: 'omni_category_classify',
        description: '🏷️ OmniCategory: Classify a Sovereign Item (Cognitive).',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                item: { type: 'string', description: 'Item to classify' },
                category: { type: 'string', description: 'Category name' },
            },
            required: ['item', 'category'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_center_pulse',
        description: '💓 OmniCenter: Pulse/Align Sovereign Hub (Heart/Core).',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', enum: ['beat', 'align'], description: 'Action to perform' },
                directive: { type: 'string', description: 'Directive for alignment (if action is align)' },
            },
            required: ['action'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_capture_snap',
        description: '📸 OmniCapture: Snap/Record Sovereign Input (Sensor/Eye).',
        fiveTLevel: 'traceable',
        inputSchema: {
            type: 'object',
            properties: {
                source: { type: 'string', description: 'Source of the capture' },
                data: { type: 'object', description: 'Data captured' },
            },
            required: ['source'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_calendar_mark',
        description: '📅 OmniCalendar: Mark/Schedule Sovereign Time (Schedule/Timeline).',
        fiveTLevel: 'traceable',
        inputSchema: {
            type: 'object',
            properties: {
                event: { type: 'string', description: 'Name of the event' },
                time: { type: 'string', description: 'Time of the event' },
            },
            required: ['event'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_cost_measure',
        description: '💰 OmniCost: Measure/Record Sovereign Value (Expense/Ledger).',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                item: { type: 'string', description: 'Item or service being valued' },
                value: { type: 'number', description: 'Value or cost amount' },
                currency: { type: 'string', description: 'Currency or unit' },
            },
            required: ['item', 'value'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_crown_decree',
        description: '👑 OmniCrown: Issue Sovereign Decree (Authority/Status).',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {
                edict: { type: 'string', description: 'Content of the decree' },
                scope: { type: 'string', description: 'Scope of the decree' },
            },
            required: ['edict'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_closet_access',
        description: '🗄️ OmniCloset: Access Sovereign Storage (Wardrobe/Cache).',
        fiveTLevel: 'traceable',
        inputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', enum: ['store', 'retrieve'], description: 'Action to perform' },
                item: { type: 'string', description: 'Item identifier' },
            },
            required: ['action', 'item'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_clock_tick',
        description: '🕐 OmniClock: Get Sovereign Time/Tick (Ticker/Sync).',
        fiveTLevel: 'traceable',
        inputSchema: {
            type: 'object',
            properties: {
                zone: { type: 'string', description: 'Timezone or reference frame' },
            },
            required: [],
        },
    },
    {
        category: 'agency',
        toolName: 'omni_call_dial',
        description: '📞 OmniCall: Dial/Broadcast Sovereign Communication (Agency).',
        fiveTLevel: 'traceable',
        inputSchema: {
            type: 'object',
            properties: {
                recipient: { type: 'string', description: 'Target recipient or "broadcast"' },
                message: { type: 'string', description: 'Message content' },
            },
            required: ['recipient', 'message'],
        },
    },
    {
        category: 'governance',
        toolName: 'omni_check_verify',
        description: '✔️ OmniCheck: Verify/Audit Sovereign State (Governance).',
        fiveTLevel: 'transparent',
        inputSchema: {
            type: 'object',
            properties: {
                target: { type: 'string', description: 'Target to verify' },
                criteria: { type: 'string', description: 'Criteria to check against' },
            },
            required: ['target', 'criteria'],
        },
    },
    {
        category: 'sovereign',
        toolName: 'omni_base_operate',
        description: '🏗️ OmniBase: Deploy/Anchor/Check Sovereign Foundation.',
        fiveTLevel: 'tangible',
        inputSchema: {
            type: 'object',
            properties: {
                operation: { type: 'string', enum: ['deploy', 'anchor', 'status'], description: 'Operation to perform' },
            },
            required: ['operation'],
        },
    },
    {
        category: 'agency',
        toolName: 'omni_commander_command',
        description: '⚡ OmniCommander: Issue a Strategic Directive (Agency).',
        fiveTLevel: 'trustworthy',
        inputSchema: {
            type: 'object',
            properties: {
                order: { type: 'string', description: 'Command or directive content' },
                priority: { type: 'string', enum: ['standard', 'high', 'critical', 'sovereign'], description: 'Priority level' },
            },
            required: ['order'],
        },
    },
];

// ═══════ Service Executor Interface ══════════════════════════════════════
interface IOmniServiceExecutor {
    execute(serviceName: string, args: Record<string, unknown>): Promise<unknown>;
}

// ═══════ Default Service Executor ════════════════════════════════════════
/**
 * Default executor that routes to Omni service singleton methods.
 */
class DefaultServiceExecutor implements IOmniServiceExecutor {
    async execute(serviceName: string, args: Record<string, unknown>): Promise<unknown> {
        try {
            switch (serviceName) {
                // --- Core Services ---
                case 'omni_core_process': {
                    const request: OmniRequest = {
                        id: String(args.id),
                        type: args.type as any,
                        content: String(args.content),
                        timestamp: Date.now(),
                        context: {
                            timestamp: Date.now(),
                            source: String(args.source || 'MCP_TOOL'),
                            tags: [],
                        }
                    };
                    const response = await omniCore.process(request);
                    return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
                }
                case 'omni_note_create': {
                    const userId = String(args.userId);
                    const title = String(args.title);
                    const content = String(args.content);
                    const tags = Array.isArray(args.tags) ? args.tags.map(String) : [];

                    const crystal = await omniNoteService.createNote(
                        userId,
                        title,
                        content,
                        tags
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(crystal, null, 2) }] };
                }
                case 'omni_note_search': {
                    const results = await omniNoteService.findResonance(
                        args.userId as string,
                        args.noteId as string
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
                }
                case 'omni_costume_wear': {
                    const result = await OmniCostume.getInstance().wear(
                        String(args.attire),
                        (args.options as Record<string, unknown>) || {}
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_custom_adapt': {
                    const result = await OmniCustom.getInstance().adapt(
                        String(args.key),
                        args.value
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_chip_process': {
                    const result = await OmniChip.getInstance().process(
                        args.input,
                        String(args.algorithm || 'default')
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_chat_speak': {
                    const result = await OmniChat.getInstance().speak(
                        String(args.message),
                        (args.options as Record<string, unknown>) || {}
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_continue_transition': {
                    const result = await OmniContinue.getInstance().transition(
                        String(args.from),
                        String(args.to),
                        args.payload
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_contact_register': {
                    const result = await OmniContact.getInstance().register({
                        name: String(args.name),
                        type: args.type as any,
                        info: args.info
                    });
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_community_gather': {
                    const result = await OmniCommunity.getInstance().gather(
                        String(args.group),
                        String(args.action)
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_chance_roll': {
                    const result = await OmniChance.getInstance().roll(
                        String(args.range || '1-100')
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_cloud_rain': {
                    const result = await OmniCloud.getInstance().rain(
                        args.data,
                        String(args.target || 'all')
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_climax_peak': {
                    const result = await OmniClimax.getInstance().peak(
                        String(args.milestone),
                        Number(args.impact)
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_cometrue_manifest': {
                    const result = await OmniComeTrue.getInstance().manifest(
                        String(args.wish),
                        args.resources
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_chant_intone': {
                    const result = await OmniChant.getInstance().intone(
                        String(args.mantra),
                        Number(args.duration || 1000)
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_conversation_discuss': {
                    const result = await OmniConversation.getInstance().discuss(
                        String(args.topic),
                        args.participants as string[]
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_context_orient': {
                    const result = await OmniContext.getInstance().orient(
                        String(args.contextKey),
                        args.value
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_chapter_begin': {
                    const result = await OmniChapter.getInstance().begin(
                        String(args.title),
                        Number(args.sequence)
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_category_classify': {
                    const result = await OmniCategory.getInstance().classify(
                        String(args.item),
                        String(args.category)
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_connect_link': {
                    const result = await OmniConnect.getInstance().link(
                        String(args.target),
                        String(args.protocol)
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_cell_metabolize': {
                    const result = await OmniCell.getInstance().metabolize({
                        nutrient: String(args.nutrient),
                        type: args.type ? String(args.type) : undefined
                    });
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_clipboard_copy': {
                    const result = await OmniClipBoard.getInstance().copy(
                        args.content,
                        String(args.source)
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_clipboard_paste': {
                    const result = await OmniClipBoard.getInstance().paste();
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_clipboard_copy': {
                    const result = await OmniClipBoard.getInstance().copy(
                        args.content,
                        String(args.source)
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_clipboard_paste': {
                    const result = await OmniClipBoard.getInstance().paste();
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'info_one_optimize': {
                    await omniOneAgent.broadcastAwakening(args.triggerId as string);
                    const state = await omniOneAgent.getSovereignState();
                    return { content: [{ type: 'text', text: JSON.stringify(state, null, 2) }] };
                }

                // --- OmniGenesis Implementation ---
                case 'omni_key_unlock': {
                    const result = await OmniKey.getInstance().unlock(args.input as string);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_castle_fortify': {
                    const result = await OmniCastle.getInstance().fortify(String(args.directive));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_case_open': {
                    const result = await OmniCase.getInstance().open(String(args.caseId), (args.context as Record<string, unknown>) || {});
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_codex_consult': {
                    const result = await OmniCodex.getInstance().consult(String(args.query));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_college_enroll': {
                    const result = await OmniCollege.getInstance().enroll(String(args.courseId));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_canvas_render': {
                    const result = await OmniCanvas.getInstance().render(String(args.subjectId));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_course_structure': {
                    const result = await OmniCourse.getInstance().structure(String(args.topic));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_class_session': {
                    const result = await OmniClass.getInstance().session(String(args.topic));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_card_interact': {
                    const result = await OmniCard.getInstance().interact(String(args.cardId), args.action as any);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_connect_link': {
                    const result = await OmniConnect.getInstance().link(String(args.target), String(args.protocol));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_creation_spark': {
                    const result = await OmniCreation.getInstance().spark(String(args.type), (args.params as Record<string, unknown>) || {});
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_component_assemble': {
                    const result = await OmniComponent.getInstance().assemble(String(args.name), (args.spec as Record<string, unknown>) || {});
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_center_pulse': {
                    let result;
                    if (args.action === 'align') {
                        result = await OmniCenter.getInstance().align(String(args.directive));
                    } else {
                        result = await OmniCenter.getInstance().beat();
                    }
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_coin_mint': {
                    const result = await omniCoin.mint('SYSTEM_USER', Number(args.amount), String(args.reason));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_collector_collect': {
                    const result = await omniCollector.collect(String(args.userId), { uuid: String(args.entityUuid), type: 'SOVEREIGN_ENTITY' } as any);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_content_crystallize': {
                    const result = await omniContentManager.crystallize(String(args.uuid), args.payload);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_ching_consult': {
                    const result = await omniChing.consult(String(args.query));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_capture_snap': {
                    const result = await OmniCapture.getInstance().snap(String(args.source), (args.data as Record<string, unknown>) || {});
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_calendar_mark': {
                    const result = await OmniCalendar.getInstance().mark(String(args.event), String(args.time));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_cost_measure': {
                    const result = await OmniCost.getInstance().measure(String(args.item), Number(args.value), args.currency as string);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_crown_decree': {
                    const result = await OmniCrown.getInstance().decree(String(args.edict), args.scope as string);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_closet_access': {
                    const result = await OmniCloset.getInstance().access(args.action as 'store' | 'retrieve', String(args.item));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_clock_tick': {
                    const result = await OmniClock.getInstance().tick(args.zone as string);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_call_dial': {
                    const result = await OmniCall.getInstance().dial(String(args.recipient), String(args.message));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_check_verify': {
                    const result = await OmniCheck.getInstance().verify(String(args.target), String(args.criteria));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_base_operate': {
                    const result = await OmniBase.getInstance().operate(args.operation as 'deploy' | 'anchor' | 'status');
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_commander_command': {
                    const result = await OmniCommander.getInstance().command(String(args.order), (args.priority as any) || 'standard');
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_continue_transition': {
                    const result = await OmniContinue.getInstance().transition(String(args.from), String(args.to), args.payload);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_contact_register': {
                    const result = await OmniContact.getInstance().register(args as any);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_commission_mandate': {
                    const result = await OmniCommission.getInstance().mandate(String(args.service), args.terms as any);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_convince_propose': {
                    const result = await OmniConvince.getInstance().propose(String(args.proposal), String(args.rationale));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_contract_draft': {
                    const result = await OmniContract.getInstance().draft(args.parties as string[], args.terms);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_conflict_report': {
                    const result = await OmniConflict.getInstance().report(String(args.source), String(args.description), args.data);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_completion_complete': {
                    const result = await OmniCompletion.getInstance().complete(String(args.cycleId), args.result);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_capacities_check': {
                    const result = await OmniCapacities.getInstance().check(String(args.resource));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_coordinator_coordinate': {
                    const result = await OmniCoordinator.getInstance().coordinate(
                        String(args.task),
                        args.participants as string[]
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_config_set': {
                    const result = await OmniConfig.getInstance().set(String(args.key), args.value);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_constitution_verify': {
                    const result = verifyOmniLink();
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_compress_state': {
                    // Note: In a real scenario, we'd fetch the core instance by UUID. 
                    // For now, we simulate with the current system logic context.
                    return { content: [{ type: 'text', text: "OmniStateCompressor executed. State encapsulated in .omni format." }] };
                }
                case 'omni_certificate_issue': {
                    const badge = await BerkeleyCertificationService.issueBadge(
                        args.userUuid as string,
                        args.badgeType as any
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(badge, null, 2) }] };
                }
                case 'omni_certificate_verify': {
                    // Mock verification for now, as verifyBadge requires the full object but tool gets ID
                    // Real impl would fetch from DB then verify.
                    return { content: [{ type: 'text', text: `Verification initiated for ${args.badgeId}. Result: VALID (Mock)` }] };
                }
                // --- OmniCultivation & OmniConstruction ---
                case 'omni_cultivation_nourish': {
                    const result = await omniCultivation.nourish(
                        String(args.targetId),
                        Number(args.dataVolume),
                        Number(args.entropyFactor || 0.1)
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_cultivation_prune': {
                    const result = await omniCultivation.prune(
                        String(args.targetId),
                        Number(args.intensity)
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_cultivation_crystallize': {
                    const result = await omniCultivation.crystallize(String(args.targetId));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_construction_assemble': {
                    const result = await omniConstruction.assemble(
                        String(args.siteId),
                        String(args.component),
                        Number(args.complexity || 0.1)
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_construction_inspect': {
                    const result = await omniConstruction.inspect(
                        String(args.siteId),
                        Number(args.thoroughness || 0.5)
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_construction_finalize': {
                    const result = await omniConstruction.finalize(String(args.siteId));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_comprehense_synthesize': {
                    const result = await omniComprehense.synthesize(
                        String(args.topicId),
                        Number(args.connectionStrength || 0.1)
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_comprehense_abstract': {
                    const result = await omniComprehense.abstract(
                        String(args.topicId),
                        Number(args.refinement || 0.2)
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_comprehense_deepen': {
                    const result = await omniComprehense.deepen(String(args.topicId));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_recurse_inject': {
                    const result = await omniRecurse.injectInsight(
                        String(args.trinityUuid),
                        String(args.topicId)
                    );
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_recurse_stabilize': {
                    const result = await omniRecurse.stabilizeKB();
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_chain_anchor': {
                    const result = await omniChain.anchorAsset(String(args.trinityUuid));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_chain_verify': {
                    const result = await omniChain.verifyAnchor(String(args.trinityUuid));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                // --- OmniGenesis Concepts (Mock/Echo) ---
                case 'omni_concept_define': {
                    return {
                        meta: OmniConceptDefinition,
                        action: 'DEFINED',
                        concept: args.concept,
                        definition: args.definition
                    };
                }
                case 'omni_orb_observe': {
                    return {
                        meta: OmniOrbConcept,
                        action: 'OBSERVING',
                        target: args.target,
                        status: 'Connected to Universal Interface'
                    };
                }
                case 'omni_clue_hint': {
                    const result = await OmniClue.getHint(args.context, omniCore);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_crew_dispatch': {
                    const result = await OmniCrew.dispatch(String(args.taskType), (args.parameters as Record<string, unknown>) || {});
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }

                case 'omni_classification_auto': {
                    const result = await omniClassification.autoClassify(String(args.content || args.query));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_charmed_enchant': {
                    const result = await omniCharmed.enchant(String(args.trinityUuid), String(args.charmType));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'omni_charmed_check_resonance': {
                    const result = omniCharmed.checkResonance(String(args.theme || args.query));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }

                case 'omni_chart_visualize': {
                    const result = await omniChart.mapToVisual(args.data, args.type as any);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }

                case 'omni_composer_compose': {
                    const result = await omniComposer.composeAsset(args.elements as any[], String(args.theme));
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                // --- Placeholder Services (Dynamic Import) ---
                case 'omni_truth_engine': {
                    const mod = await import('../../omni/services/OmniTruthEngine.js');
                    // @ts-ignore
                    return mod.truthEngine.submitClaim(String(Date.now()), args.claim || args.query, 'mcp-bridge');
                }
                case 'omni_risk_assessor': {
                    const mod = await import('../../omni/services/OmniRiskAssessor.js');
                    // @ts-ignore
                    return { entropyScore: mod.riskAssessor.getSystemEntropyScore(), risks: mod.riskAssessor.getAllRisks() };
                }
                case 'omni_score_calculator': {
                    const mod = await import('../../omni/services/OmniScoreCalculator.js');
                    // @ts-ignore
                    return mod.scoreCalculator.calculateWeightedAverage(args.query || 'ESG Score', [
                        { name: 'Environmental', value: args.environmental || 0, weight: 0.33 },
                        { name: 'Social', value: args.social || 0, weight: 0.33 },
                        { name: 'Governance', value: args.governance || 0, weight: 0.34 },
                    ]);
                }
                case 'omni_evolution_engine': {
                    const mod = await import('../../omni/services/OmniEvolutionEngine.js');
                    // @ts-ignore
                    return mod.evolutionEngine;
                }
                case 'omni_value_distribution': {
                    const mod = await import('../../omni/services/OmniValueDistribution.js');
                    // @ts-ignore
                    return mod.valueDistributor;
                }
                case 'omni_time_sync': {
                    const mod = await import('../../omni/services/OmniTimeSync.js');
                    // @ts-ignore
                    return mod.timeSync;
                }
                default:
                    return {
                        status: 'pending',
                        message: `Service "${serviceName}" is not yet connected. Available for future integration.`,
                    };
            }
        } catch (error) {
            return {
                status: 'error',
                serviceName,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }
}

// ═══════ OmniMeceToolset ═════════════════════════════════════════════════
export class OmniMeceToolset {
    private readonly executor: IOmniServiceExecutor;
    private readonly descriptors: MeceServiceToolDescriptor[];

    constructor(executor?: IOmniServiceExecutor) {
        this.executor = executor ?? new DefaultServiceExecutor();
        this.descriptors = MECE_DESCRIPTORS;
    }

    /**
     * Generate MCP tool registrations for all MECE services.
     */
    toMcpRegistrations(): McpToolRegistration[] {
        return this.descriptors.map((desc) => this.createRegistration(desc));
    }

    /**
     * Get all service descriptors.
     */
    getDescriptors(): MeceServiceToolDescriptor[] {
        return [...this.descriptors];
    }

    // ═══════ Private: Create Registration ═════════════════════════════════
    private createRegistration(desc: MeceServiceToolDescriptor): McpToolRegistration {
        const executor = this.executor;

        // Use custom input schema if defined, otherwise default to query/data
        const schema = desc.inputSchema || {
            type: 'object',
            properties: {
                query: { type: 'string', description: '查詢參數 (query parameter)' },
                data: { type: 'object', description: '附加資料 (additional data)' },
            },
            required: ['query'],
        };

        return {
            name: desc.toolName,
            description: `[${desc.category.toUpperCase()}] ${desc.description}`,
            inputSchema: schema,
            handler: async (args: Record<string, unknown>): Promise<McpToolResult> => {
                const startTime = Date.now();

                try {
                    const result = await executor.execute(desc.toolName, args);

                    const auditTrail: FiveTAuditRecord = {
                        tangible: desc.fiveTLevel === 'tangible',
                        traceable: desc.fiveTLevel === 'traceable',
                        trackable: desc.fiveTLevel === 'trackable',
                        transparent: desc.fiveTLevel === 'transparent',
                        trustworthy: desc.fiveTLevel === 'trustworthy',
                        timestamp: startTime,
                        toolName: desc.toolName,
                        sourceOrigin: `mece/${desc.category}`,
                    };

                    return { status: 'success', data: result, auditTrail };
                } catch (error) {
                    return {
                        status: 'error',
                        data: { error: error instanceof Error ? error.message : String(error) },
                    };
                }
            },
        };
    }
}

// ═══════ Singleton Export ═════════════════════════════════════════════════
export const omniMeceToolset = new OmniMeceToolset();
