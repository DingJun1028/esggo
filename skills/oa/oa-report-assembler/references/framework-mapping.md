# Framework Mapping Reference

> **Purpose:** This document provides the authoritative cross-reference between major ESG reporting frameworks (GRI, SASB, SDGs) and the report sections used by the OA Report Assembler skill. Use this file when assembling, validating, or transforming sustainability reports.

---

## Table of Contents

1. [GRI Standards — Full 24-Section Mapping](#1-gri-standards--full-24-section-mapping)
2. [SASB Industry-Specific Indicators Reference](#2-sasb-industry-specific-indicators-reference)
3. [SDGs Alignment Matrix (SDG 1–14)](#3-sdgs-alignment-matrix-sdg-114)
4. [Template Placeholder Syntax](#4-template-placeholder-syntax)
5. [Output Format Comparison](#5-output-format-comparison)

---

## 1. GRI Standards — Full 24-Section Mapping

The Global Reporting Initiative (GRI) Standards are structured into **Universal Standards** (GRI 1–3) and **Topic Standards** (GRI 2–4 series). The table below maps each GRI section to the corresponding report-section placeholder used in templates.

| #   | GRI Standard                                        | GRI Section Title                 | Report Section Placeholder         | Description / Key Disclosures                                                      |
| --- | --------------------------------------------------- | --------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | **GRI 1: Foundation 2021**                          | Foundation                        | `{{gri_foundation}}`               | Reporting principles, requirements for using GRI Standards, reporting boundary     |
| 2   | **GRI 2: General Disclosures 2021**                 | General Disclosures               | `{{gri_general_disclosures}}`      | Organizational profile, governance, strategy, stakeholder engagement               |
| 3   | **GRI 3: Material Topics 2021**                     | Material Topics                   | `{{gri_material_topics}}`          | Process to determine material topics, list of material topics, management approach |
| 4   | **GRI 201: Economic Performance 2016**              | Economic Performance              | `{{gri_201_economic_performance}}` | Direct economic value generated, financial implications of climate change          |
| 5   | **GRI 202: Market Presence 2016**                   | Market Presence                   | `{{gri_202_market_presence}}`      | Ratios of standard entry-level wage, local hiring, local procurement               |
| 6   | **GRI 203: Indirect Economic Impacts 2016**         | Indirect Economic Impacts         | `{{gri_203_indirect_economic}}`    | Infrastructure investments, significant indirect economic impacts                  |
| 7   | **GRI 204: Procurement Practices 2016**             | Procurement Practices             | `{{gri_204_procurement}}`          | Proportion of spending on local suppliers                                          |
| 8   | **GRI 205: Anti-corruption 2016**                   | Anti-corruption                   | `{{gri_205_anti_corruption}}`      | Operations assessed for risks, communication of anti-corruption policies           |
| 9   | **GRI 206: Anti-competitive Behavior 2016**         | Anti-competitive Behavior         | `{{gri_206_anti_competitive}}`     | Legal actions for anti-competitive behavior, anti-trust, monopoly practices        |
| 10  | **GRI 207: Tax 2019**                               | Tax                               | `{{gri_207_tax}}`                  | Country-by-country reporting, tax governance, approach to tax                      |
| 11  | **GRI 301: Materials 2016**                         | Materials                         | `{{gri_301_materials}}`            | Materials used by weight/volume, recycled input materials                          |
| 12  | **GRI 302: Energy 2016**                            | Energy                            | `{{gri_302_energy}}`               | Energy consumption within/outside the organization, energy intensity               |
| 13  | **GRI 303: Water and Effluents 2018**               | Water and Effluents               | `{{gri_303_water}}`                | Water withdrawal, water discharge, water consumption                               |
| 14  | **GRI 304: Biodiversity 2016**                      | Biodiversity                      | `{{gri_304_biodiversity}}`         | Operational sites in/near protected areas, impacts on biodiversity                 |
| 15  | **GRI 305: Emissions 2016**                         | Emissions                         | `{{gri_305_emissions}}`            | Direct GHG (Scope 1), energy indirect (Scope 2), other indirect (Scope 3)          |
| 16  | **GRI 306: Waste 2020**                             | Waste                             | `{{gri_306_waste}}`                | Waste generated, waste diverted from disposal, waste directed to disposal          |
| 17  | **GRI 308: Supplier Environmental Assessment 2016** | Supplier Environmental Assessment | `{{gri_308_supplier_env}}`         | Screening suppliers using environmental criteria                                   |
| 18  | **GRI 401: Employment 2016**                        | Employment                        | `{{gri_401_employment}}`           | New employee hires, employee turnover, benefits                                    |
| 19  | **GRI 402: Labor/Management Relations 2016**        | Labor/Management Relations        | `{{gri_402_labor_relations}}`      | Minimum notice periods regarding operational changes                               |
| 20  | **GRI 403: Occupational Health and Safety 2018**    | Occupational Health and Safety    | `{{gri_403_ohs}}`                  | Hazard identification, worker participation, work-related injuries                 |
| 21  | **GRI 404: Training and Education 2016**            | Training and Education            | `{{gri_404_training}}`             | Average hours of training per year, skills management programs                     |
| 22  | **GRI 405: Diversity and Equal Opportunity 2016**   | Diversity and Equal Opportunity   | `{{gri_405_diversity}}`            | Diversity of governance bodies and employees, equal remuneration                   |
| 23  | **GRI 413: Local Communities 2016**                 | Local Communities                 | `{{gri_413_local_communities}}`    | Operations with significant impacts on local communities                           |
| 24  | **GRI 414: Supplier Social Assessment 2016**        | Supplier Social Assessment        | `{{gri_414_supplier_social}}`      | Screening suppliers using social criteria (labor, human rights)                    |

> **Note:** GRI 201–207 fall under the **Economic** topic series; GRI 301–308 under **Environmental**; GRI 401–414 under **Social**. GRI 415 (Public Policy) and GRI 418 (Customer Privacy) are additional topic standards that may be mapped as `{{gri_415_public_policy}}` and `{{gri_418_customer_privacy}}` respectively.

---

## 2. SASB Industry-Specific Indicators Reference

The Sustainability Accounting Standards Board (SASB) provides industry-specific disclosure standards. Below is a reference table of SASB topics mapped to industries and report-section placeholders.

### 2.1 SASB Industry Categories & Key Topics

| SASB Industry                                            | Industry Code | Key SASB Topics                                                      | Report Section Placeholder |
| -------------------------------------------------------- | ------------- | -------------------------------------------------------------------- | -------------------------- |
| **Oil & Gas — Exploration & Production**                 | EG-EE         | GHG emissions, water management, biodiversity, community relations   | `{{sasb_eg_ee}}`           |
| **Oil & Gas — Midstream**                                | EG-MD         | GHG emissions, ecological impacts, workforce health & safety         | `{{sasb_eg_md}}`           |
| **Oil & Gas — Refining & Marketing**                     | EG-RM         | Air quality, water management, product safety, pricing               | `{{sasb_eg_rm}}`           |
| **Oil & Gas — Services**                                 | EG-SV         | Workforce health & safety, chemical management, competitive behavior | `{{sasb_eg_sv}}`           |
| **Coal Operations**                                      | CO            | Land use & remediation, water management, community relations        | `{{sasb_co}}`              |
| **Iron & Steel Producers**                               | EM-IS         | GHG emissions, energy management, water, workforce safety            | `{{sasb_em_is}}`           |
| **Metals & Mining**                                      | EM-MM         | Tailings management, water, biodiversity, community rights           | `{{sasb_em_mm}}`           |
| **Construction Materials**                               | EM-CM         | Cement CO₂, water, land use, particulate emissions                   | `{{sasb_em_cm}}`           |
| **Chemicals**                                            | RT-CH         | GHG emissions, water, waste, product safety, chemical stewardship    | `{{sasb_rt_ch}}`           |
| **Containers & Packaging**                               | RT-CP         | Packaging lifecycle, recycling, material sourcing                    | `{{sasb_rt_cp}}`           |
| **Aerospace & Defense**                                  | RT-AE         | Fuel management, data security, supply chain labor                   | `{{sasb_rt_ae}}`           |
| **Automobiles**                                          | RT-AU         | Fuel economy, materials sourcing, vehicle safety                     | `{{sasb_rt_au}}            |
| **Auto Parts**                                           | RT-AP         | Product safety, materials efficiency, workforce safety               | `{{sasb_rt_ap}}`           |
| **Semiconductors**                                       | TC-SC         | Water, energy, hazardous waste, supply chain labor                   | `{{sasb_tc_sc}}`           |
| **Software & IT Services**                               | TC-SI         | Data privacy, energy (data centers), workforce diversity             | `{{sasb_tc_si}}`           |
| **Telecommunications**                                   | TC-TL         | Network reliability, e-waste, data privacy                           | `{{sasb_tc_tl}}`           |
| **Electronic Manufacturing Services**                    | TC-EM         | Conflict minerals, water, energy, labor conditions                   | `{{sasb_tc_em}}`           |
| **Financials — Commercial Banks**                        | FN-IB         | Data security, product responsibility, systemic risk                 | `{{sasb_fn_ib}}`           |
| **Financials — Investment Banking & Brokerage**          | FN-IB         | Employee diversity, data security, responsible investment            | `{{sasb_fn_ibk}}`          |
| **Financials — Asset Management**                        | FN-AMS        | ESG integration, stewardship, transparency                           | `{{sasb_fn_ams}}`          |
| **Insurance**                                            | FN-IN         | Systemic risk, climate risk integration, data privacy                | `{{sasb_fn_in}}`           |
| **Food & Beverage — Non-Alcoholic**                      | FB-NA         | Water, packaging, nutrition, supply chain labor                      | `{{sasb_fb_na}}`           |
| **Food & Beverage — Alcoholic**                          | FB-AB         | Responsible drinking, water, packaging, supply chain                 | `{{sasb_fb_ab}}`           |
| **Food & Beverage — Meat, Poultry & Dairy**              | FB-MP         | Animal welfare, water, GHG, antibiotics                              | `{{sasb_fb_mp}}`           |
| **Food & Beverage — Agricultural Products**              | FB-AG         | Land use, water, pesticides, smallholder engagement                  | `{{sasb_fb_ag}}`           |
| **Tobacco**                                              | FB-TB         | Marketing practices, product health impacts, supply chain labor      | `{{sasb_fb_tb}}`           |
| **Household & Personal Products**                        | CG-HP         | Product safety, packaging, water, workforce diversity                | `{{sasb_cg_hp}}`           |
| **Healthcare — Biotechnology & Pharmaceuticals**         | HC-BP         | Drug safety, access, clinical trial ethics, pricing                  | `{{sasb_hc_bp}}`           |
| **Healthcare — Medical Equipment & Supplies**            | HC-MS         | Product safety, data security, supply chain labor                    | `{{sasb_hc_ms}}`           |
| **Healthcare — Managed Care**                            | HC-MC         | Data privacy, network adequacy, member health                        | `{{sasb_hc_mc}}`           |
| **Healthcare — Health Care Delivery**                    | HC-DY         | Patient safety, workforce, data security, access                     | `{{sasb_hc_dy}}`           |
| **Real Estate**                                          | IF-RE         | Energy, water, tenant health & safety, climate resilience            | `{{sasb_if_re}}`           |
| **Waste Management**                                     | IF-WM         | Air quality, land remediation, fleet emissions                       | `{{sasb_if_wm}}`           |
| **Electric Utilities & Power Generators**                | IF-EU         | GHG & air emissions, water, grid reliability, access                 | `{{sasb_if_eu}}`           |
| **Water Utilities & Services**                           | IF-WU         | Water quality, infrastructure, access, pricing                       | `{{sasb_if_wu}}`           |
| **Apparel, Accessories & Footwear**                      | CG-AA         | Labor conditions, water, chemicals, supply chain                     | `{{sasb_cg_aa}}`           |
| **Multiline & Specialty Retailers & Distributors**       | CG-MR         | Supply chain labor, product safety, packaging, data privacy          | `{{sasb_cg_mr}}`           |
| **Casinos & Gaming**                                     | SV-CS         | Responsible gaming, data security, workforce diversity               | `{{sasb_sv_cs}}`           |
| **Hotels & Lodging**                                     | SV-HL         | Energy, water, local sourcing, workforce                             | `{{sasb_sv_hl}}`           |
| **Restaurants & Food Services**                          | SV-RS         | Food safety, nutrition, packaging, supply chain                      | `{{sasb_sv_rs}}`           |
| **Education**                                            | SV-ED         | Student outcomes, data privacy, workforce diversity                  | `{{sasb_sv_ed}}`           |
| **Professional & Commercial Services**                   | SV-PS         | Workforce diversity, data security, professional integrity           | `{{sasb_sv_ps}}`           |
| **Media & Entertainment**                                | SV-ME         | Content responsibility, data privacy, workforce diversity            | `{{sasb_sv_me}}`           |
| **Renewable Resources & Alternative Energy**             | RR-RA         | Land use, water, biodiversity, community engagement                  | `{{sasb_rr_ra}}`           |
| **Industrial Machinery & Goods**                         | IG-IM         | Product safety, materials efficiency, energy                         | `{{sasb_ig_im}}`           |
| **Transportation — Airlines**                            | TR-AT         | GHG emissions, noise, workforce safety, customer safety              | `{{sasb_tr_at}}`           |
| **Transportation — Marine Transportation**               | TR-MT         | Spill prevention, emissions, ballast water, labor                    | `{{sasb_tr_mt}}`           |
| **Transportation — Rail Transportation**                 | TR-RT         | Noise, emissions, safety, infrastructure                             | `{{sasb_tr_rt}}`           |
| **Transportation — Road Transportation**                 | TR-RD         | Fleet emissions, safety, driver conditions                           | `{{sasb_tr_rd}}`           |
| **Transportation — Logistics**                           | TR-LO         | Fleet emissions, packaging, labor, safety                            | `{{sasb_tr_lo}}`           |
| **Infrastructure — Engineering & Construction Services** | IG-EC         | Project safety, materials, community impact, corruption              | `{{sasb_ig_ec}}`           |
| **Infrastructure — Electric Utilities (see IF-EU)**      | —             | —                                                                    | —                          |
| **Infrastructure — Water Utilities (see IF-WU)**         | —             | —                                                                    | —                          |

### 2.2 SASB Disclosure Topics (Cross-Industry)

| SASB Disclosure Topic                            | Metric Category       | Unit of Measure       | Placeholder                      |
| ------------------------------------------------ | --------------------- | --------------------- | -------------------------------- |
| GHG Emissions                                    | Quantitative          | tCO₂e                 | `{{sasb_metric_ghg}}`            |
| Energy Management                                | Quantitative          | GJ, MWh               | `{{sasb_metric_energy}}`         |
| Water Management                                 | Quantitative          | m³, megalitres        | `{{sasb_metric_water}}`          |
| Waste & Hazardous Materials                      | Quantitative          | metric tonnes         | `{{sasb_metric_waste}}`          |
| Biodiversity Impacts                             | Discussion & Analysis | Narrative             | `{{sasb_metric_biodiversity}}`   |
| Labor Practices                                  | Quantitative / D&A    | Headcount, hours      | `{{sasb_metric_labor}}`          |
| Employee Health & Safety                         | Quantitative          | Rate (TRIR, LTIR)     | `{{sasb_metric_safety}}`         |
| Data Security & Privacy                          | Quantitative / D&A    | Incidents, %          | `{{sasb_metric_data_security}}`  |
| Supply Chain Management                          | D&A                   | Narrative             | `{{sasb_metric_supply_chain}}`   |
| Air Quality                                      | Quantitative          | Tonnes (NOₓ, SOₓ, PM) | `{{sasb_metric_air}}`            |
| Community Relations                              | D&A                   | Narrative             | `{{sasb_metric_community}}`      |
| Land Use & Ecological Impacts                    | D&A                   | Hectares              | `{{sasb_metric_land}}`           |
| Customer Welfare                                 | D&A                   | Narrative             | `{{sasb_metric_customer}}`       |
| Product Quality & Safety                         | Quantitative          | Recalls, incidents    | `{{sasb_metric_product_safety}}` |
| Systemic Risk (Financials)                       | Quantitative          | % AUM, ratio          | `{{sasb_metric_systemic_risk}}`  |
| Access & Affordability                           | D&A                   | Narrative             | `{{sasb_metric_access}}`         |
| Product Design & Lifecycle                       | D&A                   | Narrative             | `{{sasb_metric_lifecycle}}`      |
| Business Ethics                                  | D&A                   | Narrative             | `{{sasb_metric_ethics}}`         |
| Competitive Behavior                             | D&A                   | Narrative             | `{{sasb_metric_competition}}`    |
| Management of the Legal & Regulatory Environment | D&A                   | Narrative             | `{{sasb_metric_legal}}`          |
| Critical Incident Risk Management                | D&A                   | Narrative             | `{{sasb_metric_incident}}`       |
| Employee Recruitment, Development & Retention    | Quantitative          | Rate, hours           | `{{sasb_metric_talent}}`         |

---

## 3. SDGs Alignment Matrix (SDG 1–14)

The Sustainable Development Goals (SDGs) provide a universal framework. This matrix maps SDGs 1–14 to the report sections where relevant disclosures typically appear.

| SDG    | SDG Title                             | Primary Report Section           | Secondary Report Section(s)        | Key GRI Mappings          | Key SASB Mappings   | Placeholder              |
| ------ | ------------------------------------- | -------------------------------- | ---------------------------------- | ------------------------- | ------------------- | ------------------------ |
| **1**  | No Poverty                            | Social Impact / Community        | Labor Practices, Supply Chain      | GRI 203, GRI 413          | SV-PS, FB-AG, FN-IB | `{{sdg_1_poverty}}`      |
| **2**  | Zero Hunger                           | Supply Chain / Agriculture       | Community, Procurement             | GRI 204, GRI 301          | FB-AG, FB-MP, FB-NA | `{{sdg_2_hunger}}`       |
| **3**  | Good Health & Well-being              | Occupational Health & Safety     | Community, Product Safety          | GRI 403, GRI 416          | HC-BP, HC-DY, HC-MS | `{{sdg_3_health}}`       |
| **4**  | Quality Education                     | Training & Education             | Community, Supply Chain            | GRI 404, GRI 414          | SV-ED, SV-PS        | `{{sdg_4_education}}`    |
| **5**  | Gender Equality                       | Diversity & Equal Opportunity    | Governance, Employment             | GRI 405, GRI 401          | CG-HP, FN-IB, SV-ME | `{{sdg_5_gender}}`       |
| **6**  | Clean Water & Sanitation              | Water & Effluents                | Supply Chain, Community            | GRI 303, GRI 308          | IF-WU, EM-MM, FB-NA | `{{sdg_6_water}}`        |
| **7**  | Affordable & Clean Energy             | Energy                           | Climate Strategy, Procurement      | GRI 302, GRI 305          | IF-EU, IG-IM, RR-RA | `{{sdg_7_energy}}`       |
| **8**  | Decent Work & Economic Growth         | Employment / Labor Relations     | Economic Performance, Supply Chain | GRI 401, GRI 402, GRI 201 | CG-AA, EM-MM, TR-RD | `{{sdg_8_work}}`         |
| **9**  | Industry, Innovation & Infrastructure | Strategy / Innovation            | Procurement, Materials             | GRI 203, GRI 301          | IG-IM, TC-SI, IF-RE | `{{sdg_9_innovation}}`   |
| **10** | Reduced Inequalities                  | Diversity & Equal Opportunity    | Community, Employment              | GRI 405, GRI 413          | FN-IB, CG-HP, SV-ME | `{{sdg_10_inequality}}`  |
| **11** | Sustainable Cities & Communities      | Community / Real Estate          | Transport, Infrastructure          | GRI 413, GRI 203          | IF-RE, TR-LO, IG-EC | `{{sdg_11_cities}}`      |
| **12** | Responsible Consumption & Production  | Materials / Waste / Packaging    | Supply Chain, Product Design       | GRI 301, GRI 306, GRI 308 | RT-CP, FB-NA, CG-HP | `{{sdg_12_consumption}}` |
| **13** | Climate Action                        | Emissions / Climate Strategy     | Energy, Governance                 | GRI 305, GRI 201          | IF-EU, EG-EE, TR-AT | `{{sdg_13_climate}}`     |
| **14** | Life Below Water                      | Water & Effluents / Biodiversity | Supply Chain, Materials            | GRI 303, GRI 304, GRI 306 | TR-MT, FB-NA, EM-MM | `{{sdg_14_ocean}}`       |

### SDG 15–17 (Extended Reference)

| SDG    | SDG Title                            | Primary Report Section            | Placeholder               |
| ------ | ------------------------------------ | --------------------------------- | ------------------------- |
| **15** | Life on Land                         | Biodiversity / Land Use           | `{{sdg_15_land}}`         |
| **16** | Peace, Justice & Strong Institutions | Governance / Anti-corruption      | `{{sdg_16_peace}}`        |
| **17** | Partnerships for the Goals           | Stakeholder Engagement / Strategy | `{{sdg_17_partnerships}}` |

---

## 4. Template Placeholder Syntax

### 4.1 Syntax Rules

All template placeholders follow the `{{placeholder}}` double-curly-brace convention.

| Rule             | Description                                                       | Example                                     |
| ---------------- | ----------------------------------------------------------------- | ------------------------------------------- |
| **Format**       | `{{section_name}}` — lowercase, snake_case                        | `{{gri_305_emissions}}`                     |
| **Nesting**      | Placeholders may contain sub-sections via dot notation            | `{{gri_305_emissions.scope1}}`              |
| **Fallback**     | Use `{{placeholder\|default}}` for optional defaults              | `{{company_name\|"Company"}}`               |
| **Conditional**  | Use `{{#if placeholder}}...{{/if}}` for optional blocks           | `{{#if sasb_metric_ghg}}GHG data...{{/if}}` |
| **Iteration**    | Use `{{#each list}}...{{/each}}` for repeating sections           | `{{#each gri_material_topics}}...{{/each}}` |
| **Date/Version** | Use `{{report_date}}`, `{{report_year}}`, `{{framework_version}}` | `{{report_year}}` → "2025"                  |
| **Computed**     | Use `{{sum field}}` or `{{avg field}}` for aggregations           | `{{sum sasb_metric_ghg}}`                   |

### 4.2 Global Placeholders

| Placeholder                  | Description        | Example Value                  |
| ---------------------------- | ------------------ | ------------------------------ |
| `{{company_name}}`           | Legal entity name  | "Acme Corp"                    |
| `{{report_title}}`           | Report title       | "2025 Sustainability Report"   |
| `{{report_date}}`            | Publication date   | "2025-06-30"                   |
| `{{report_year}}`            | Reporting year     | "2025"                         |
| `{{reporting_period_start}}` | Period start       | "2024-01-01"                   |
| `{{reporting_period_end}}`   | Period end         | "2024-12-31"                   |
| `{{framework_version}}`      | Framework version  | "GRI 2021, SASB 2024"          |
| `{{reporting_boundary}}`     | Entities covered   | "Consolidated"                 |
| `{{gri_compliance_level}}`   | GRI compliance     | "Core" / "Comprehensive"       |
| `{{assurance_status}}`       | External assurance | "Limited" / "Reasonable"       |
| `{{currency}}`               | Reporting currency | "USD"                          |
| `{{unit_system}}`            | Units used         | "Metric"                       |
| `{{language}}`               | Report language    | "en-US"                        |
| `{{page_count}}`             | Total pages        | "120"                          |
| `{{prepared_by}}`            | Author / team      | "ESG Reporting Team"           |
| `{{approved_by}}`            | Approver           | "Chief Sustainability Officer" |
| `{{contact_email}}`          | Report contact     | "esg@acmecorp.com"             |

### 4.3 Section-Level Placeholders

| Placeholder Pattern            | Description                    |
| ------------------------------ | ------------------------------ |
| `{{section_[name]}}`           | Generic section block          |
| `{{section_[name]_intro}}`     | Section introduction paragraph |
| `{{section_[name]_data}}`      | Section data table / metrics   |
| `{{section_[name]_narrative}}` | Section narrative / commentary |
| `{{section_[name]_kpi}}`       | Key performance indicators     |
| `{{section_[name]_target}}`    | Targets and progress           |
| `{{section_[name]_gri}}`       | GRI mapping for the section    |
| `{{section_[name]_sasb}}`      | SASB mapping for the section   |
| `{{section_[name]_sdg}}`       | SDG alignment for the section  |

---

## 5. Output Format Comparison

### 5.1 Format Overview

| Feature                   | Markdown (.md)   | PDF (.pdf) | DOCX (.docx) | HTML (.html) |
| ------------------------- | ---------------- | ---------- | ------------ | ------------ |
| **Human Readability**     | ★★★★★            | ★★★★☆      | ★★★★☆        | ★★★★☆        |
| **Machine Parsability**   | ★★★★★            | ★★☆☆☆      | ★★★☆☆        | ★★★★☆        |
| **Editability**           | ★★★★★            | ★☆☆☆☆      | ★★★★☆        | ★★★★☆        |
| **Version Control (Git)** | ★★★★★            | ★☆☆☆☆      | ★★☆☆☆        | ★★★★☆        |
| **Print Quality**         | ★★★☆☆            | ★★★★★      | ★★★★☆        | ★★★☆☆        |
| **Accessibility (WCAG)**  | ★★★☆☆            | ★★★☆☆      | ★★★★☆        | ★★★★★        |
| **File Size**             | ★★★★★ (smallest) | ★★★☆☆      | ★★★☆☆        | ★★★★☆        |
| **Interactive Elements**  | ★★☆☆☆            | ★★★☆☆      | ★★★☆☆        | ★★★★★        |
| **Corporate Acceptance**  | ★★★☆☆            | ★★★★★      | ★★★★★        | ★★☆☆☆        |
| **Regulatory Submission** | ★★☆☆☆            | ★★★★★      | ★★★★☆        | ★★☆☆☆        |
| **Template Automation**   | ★★★★★            | ★★★☆☆      | ★★★★☆        | ★★★★☆        |
| **Cross-Platform**        | ★★★★★            | ★★★★★      | ★★★★☆        | ★★★★★        |
| **Searchability**         | ★★★★★            | ★★★★☆      | ★★★★☆        | ★★★★★        |
| **Multimedia Support**    | ★★★☆☆            | ★★★★☆      | ★★★★☆        | ★★★★★        |
| **Offline Access**        | ★★★★★            | ★★★★★      | ★★★★★        | ★★★☆☆        |

### 5.2 Pros & Cons Detail

#### Markdown (.md)

| Pros                                                        | Cons                                                           |
| ----------------------------------------------------------- | -------------------------------------------------------------- |
| Plain text — works with any text editor and version control | Not a standard format for formal ESG report submission         |
| Excellent diff/merge for collaborative editing              | Limited formatting (no headers/footers, page numbers natively) |
| Easy to generate from templates and scripts                 | No native support for tracked changes                          |
| Lightweight; thousands of pages in minimal space            | Requires conversion (Pandoc, etc.) for PDF/DOCX output         |
| Supports code blocks, tables, links, images                 | Corporate stakeholders may not accept as final deliverable     |
| Ideal for draft, internal, and data-pipeline use            | No built-in digital signature support                          |

#### PDF (.pdf)

| Pros                                                        | Cons                                                                   |
| ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| Industry standard for formal ESG report publication         | Binary format — poor Git diff/merge                                    |
| Fixed layout ensures consistent rendering across devices    | Hard to edit after generation (requires PDF editor)                    |
| Supports digital signatures, encryption, accessibility tags | Large file sizes for image-heavy reports                               |
| Accepted by regulators, investors, and stock exchanges      | Text extraction can be imperfect (scanned PDFs)                        |
| Print-ready with precise typography and pagination          | Template automation requires dedicated tools (LaTeX, WeasyPrint, etc.) |
| Embeddable fonts and multimedia                             | Version comparison requires specialized tools                          |

#### DOCX (.docx)

| Pros                                                  | Cons                                            |
| ----------------------------------------------------- | ----------------------------------------------- |
| Widely accepted by corporate stakeholders             | Proprietary format (OOXML) — complex spec       |
| Supports tracked changes, comments, and collaboration | Formatting inconsistencies across Word versions |
| Rich formatting: headers/footers, page numbers, TOC   | Poor Git diff (binary ZIP of XML)               |
| Template automation via python-docx, docxtpl          | Large file sizes for complex reports            |
| Familiar to non-technical report authors              | Not ideal for web publishing                    |
| Supports embedded charts, tables, and images          | Accessibility requires manual tagging           |

#### HTML (.html)

| Pros                                                       | Cons                                                       |
| ---------------------------------------------------------- | ---------------------------------------------------------- |
| Best accessibility support (WCAG 2.1 AA/AAA)               | Not a standard format for formal ESG submission            |
| Interactive elements: expandable sections, charts, filters | Requires browser or viewer; not print-first                |
| Responsive design for mobile, tablet, desktop              | Print layout control requires CSS print stylesheets        |
| Supports embedded data visualizations (D3, Chart.js)       | Corporate stakeholders may not accept as final deliverable |
| Easy to publish on websites and intranets                  | File size can be large with embedded assets                |
| Template automation via Jinja2, Handlebars, etc.           | Offline access requires local server or saved page         |
| Machine-parsable and SEO-friendly                          | Accessibility depends on implementation quality            |

### 5.3 Recommended Usage by Use Case

| Use Case                                | Recommended Format           | Rationale                                             |
| --------------------------------------- | ---------------------------- | ----------------------------------------------------- |
| Internal draft / data pipeline          | Markdown                     | Git-friendly, fast generation, easy automation        |
| Formal annual ESG report                | PDF                          | Industry standard, print-ready, regulatory acceptance |
| Collaborative editing with stakeholders | DOCX                         | Track changes, comments, familiar tooling             |
| Web publication / digital-first report  | HTML                         | Interactive, accessible, responsive                   |
| Regulatory filing (e.g., CSRD, SEC)     | PDF + structured data (XBRL) | Compliance with submission requirements               |
| Investor presentation summary           | PDF + DOCX                   | Professional formatting, editable backup              |
| Data extraction / NLP processing        | Markdown / HTML              | Machine-parsable, structured                          |

---

## Appendix A: Quick Reference — Placeholder Naming Convention

```
{{framework_section_detail}}

Examples:
  {{gri_305_emissions_scope1}}
  {{sasb_fn_ib_data_security}}
  {{sdg_13_climate_targets}}
  {{section_ohs_kpi_lost_time_rate}}
```

## Appendix B: Framework Version Reference

| Framework                   | Current Version           | Effective Date             |
| --------------------------- | ------------------------- | -------------------------- |
| GRI Universal Standards     | 2021                      | January 2023               |
| GRI Topic Standards         | 2016–2020 (updated 2021)  | January 2023               |
| SASB Standards              | 2024 (IFRS Foundation)    | January 2024               |
| SDGs                        | 2030 Agenda               | January 2016               |
| TCFD Recommendations        | 2017 (maintained by ISSB) | Ongoing                    |
| ISSB Standards (IFRS S1/S2) | 2023                      | January 2024               |
| EU CSRD / ESRS              | 2023                      | January 2024–2026 (phased) |

---

_This reference file is maintained by the OA Report Assembler skill. Update when framework versions change or new industry mappings are required._
