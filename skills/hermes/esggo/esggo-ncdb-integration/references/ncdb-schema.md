# NCBDB Schema Reference (from 2026-02-27 build report)

## Database
- Instance ID: `54686_esg_go_userdb`
- Owner: DingJunHong1028@gmail.com
- Max 10 databases; this one is the shared esggo DB. Unlimited tables & columns per DB.

## Root esggo tables (already built)
| Table | Purpose |
|-------|---------|
| ncba_user / ncba_session / ncba_account | Auth system |
| sustainability_reports | Sustainability report master |
| evidence_vault | 5T evidence vault |
| audit_trail | Change audit log |
| compliance_checks | GRI/SASB/TCFD compliance |
| benchmark_data | Peer benchmark data |
| esg_metrics | MECE KPI (E10, S8, G6), 24 rows seeded |
| materiality_matrix | Double materiality matrix |
| stakeholders | Stakeholder management |
| supply_chain_data | Supply chain Tier1-3 scoring |
| service_modules | UUID map (8 rows) — see below |
| user_profiles | User basic data (wallet, email, role) |
| digital_twins | Digital twin (persona prompt, knowledge ctx) |
| knowledge_chunks | Knowledge chunks (with Vector ID) |
| rag_sessions | RAG chat sessions |
| report_sections | Report sections |
| report_citations | Source citations + confidence |
| gri_knowledge_base | GRI standard KB |
| validation_logs | AI agent validation log |
| village_members | Village members + contribution points |
| impact_projects | Impact fundraising projects |
| community_posts | Community posts |
| votes | Project votes |

## Service Modules UUID map (service_modules table)
| Domain | UUID | Module | Route |
|--------|-------|--------|-------|
| Hub | mod-omni-hub-0000 | ESG GO 萬能中樞 | /omni |
| Hub | mod-src-hub-0001 | 永續報告中心 | /omni/esg-reports |
| Core | mod-core-met-0002 | ESG 指標儀表板 | /omni/metrics |
| Core | mod-core-car-0003 | 碳足跡管理中心 | /omni/carbon |
| Core | mod-core-rep-0004 | 永續報告書 | /omni/reports |
| Adv | mod-adv-age-0005 | AI 代理分身 | /omni/agentic-twin |
| Adv | mod-adv-bi-0006 | 商業智能分析 | /omni/analytics |
| Comm | mod-comm-vil-0007 | 影響力村社區 | /omni/impact-village |

## RLS policies (examples)
- evidence_vault: shared_read, public_scoped_read (admin cross-read; public endpoint needs owner_id)
- esg_metrics: shared_read (all admins read KPI)
- sustainability_reports: private (owner only)
- user_profiles / digital_twins / village tables: public_scoped_readwrite

## Learning Center isolated tables (added 2026-08-25)
LC data uses `lc_` prefix to avoid collision with root tables:
- `lc_submissions` — LC assignment submissions
- `lc_profiles` — LC user profiles (separate from root `user_profiles`)
- `lc_tas` — Teaching Assistant profiles
- `lc_pairings` — mentor/mentee pairings

## Response shape note
NCBDB REST may return either a bare array `[...]` or `{ data: [...] }`.
Normalize: `Array.isArray(data) ? data : (data?.data ?? data)`.
