-- -----------------------------------------------------------------------------
-- 善向永續 (Sunshine ESG) - Supabase 核心數據架構 v1.0
-- 哲學：單一真理 (Single Source of Truth) | 治理優先 (Governance First)
-- -----------------------------------------------------------------------------

-- 啟用必要擴展
create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 模組 A: 組織與定義 (Organization & Definitions)
-- -----------------------------------------------------------------------------

-- A1. 組織架構表 (支援科層結構，如 總部 -> 廠區 -> 產線)
create table if not exists public.org_units (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    code text unique,              -- 例如: TPE-HQ, KHH-PLANT-1
    parent_id uuid references public.org_units(id),
    tier_level text,               -- 例如: 'Company', 'Site', 'Department'
    created_at timestamptz default now()
);

-- A2. ESG 指標定義表 (符合 GRI/SASB 標準的元數據)
create table if not exists public.metric_definitions (
    id uuid primary key default uuid_generate_v4(),
    code text unique not null,     -- 例如: E-GHG-scope1
    name text not null,            -- 例如: Scope 1 直接溫室氣體排放
    category text not null check (category in ('Environmental', 'Social', 'Governance')),
    unit text not null,            -- 例如: tCO2e, kWh, %
    description text,
    standard_ref text,             -- 例如: 'GRI 305-1'
    is_active boolean default true
);

-- -----------------------------------------------------------------------------
-- 模組 B: 數據事實 (Facts & Readings)
-- -----------------------------------------------------------------------------

-- B1. 數據讀數表 (核心事實表)
create table if not exists public.esg_readings (
    id uuid primary key default uuid_generate_v4(),
    metric_id uuid references public.metric_definitions(id) not null,
    org_unit_id uuid references public.org_units(id) not null,

    -- 時間維度
    period_type text default 'monthly', -- monthly, quarterly, yearly
    period_start date not null,
    period_end date not null,

    -- 數值維度
    value numeric not null,             -- 實際數值
    target_value numeric,               -- 目標數值 (計算達成率用)

    -- 狀態維度 (工作流)
    status text default 'draft' check (status in ('draft', 'review', 'approved', 'locked')),

    -- 審計維度
    created_by uuid references auth.users(id),
    approved_by uuid references auth.users(id),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- B2. 佐證資料表 (連結 Storage)
create table if not exists public.esg_evidence (
    id uuid primary key default uuid_generate_v4(),
    reading_id uuid references public.esg_readings(id) on delete cascade,
    file_name text not null,
    storage_path text not null,     -- Supabase Storage 中的完整路徑
    file_type text,                 -- pdf, jpg, xlsx
    uploaded_by uuid references auth.users(id),
    uploaded_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- 模組 C: 治理與安全 (Governance & Security)
-- -----------------------------------------------------------------------------

-- C1. 啟用 RLS (Row Level Security) - 預設鎖死所有權限
alter table public.esg_readings enable row level security;
alter table public.esg_evidence enable row level security;

-- C2. 建立自動化更新 updated_at 的函數
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- C3. 綁定 Trigger
create trigger update_esg_readings_modtime
    before update on public.esg_readings
    for each row execute procedure update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 模組 D: 初始種子數據 (Seed Data - Optional)
-- -----------------------------------------------------------------------------

-- 預先填入幾個常見的指標
insert into public.metric_definitions (code, name, category, unit, standard_ref) values
('E-Elec', '總用電量', 'Environmental', 'kWh', 'GRI 302-1'),
('E-GHG-S1', 'Scope 1 直接排放', 'Environmental', 'tCO2e', 'GRI 305-1'),
('S-Emp-Turn', '新進員工離職率', 'Social', '%', 'GRI 401-1')
on conflict (code) do nothing;

-- -----------------------------------------------------------------------------
-- 模組 E: 角色與權限管理 (User Roles & RBAC)
-- -----------------------------------------------------------------------------

-- E1. 建立使用者配置表 (延伸 auth.users)
create table if not exists public.user_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    role text not null check (role in ('admin', 'editor', 'auditor')),
    org_unit_id uuid references public.org_units(id), -- 如果是 admin/auditor，此欄位可為空
    created_at timestamptz default now()
);

-- 啟用 RLS
alter table public.user_profiles enable row level security;

-- 允許使用者讀取自己的配置
create policy "Users can read own profile"
    on public.user_profiles for select
    using (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- 模組 F: 核心 RLS 策略 (The Governance Layer)
-- -----------------------------------------------------------------------------

-- 建立 Helper Function 來獲取當前用戶角色與部門
create or replace function get_my_claim()
returns table (claim_role text, claim_org_id uuid)
security definer
as $$
begin
    return query
    select role, org_unit_id
    from public.user_profiles
    where id = auth.uid();
end;
$$ language plpgsql;

-- --- 針對 [esg_readings] 的策略 ---

-- 策略 1: SELECT (讀取)
create policy "Read Access Policy" on public.esg_readings
for select using (
    exists (
        select 1 from get_my_claim()
        where claim_role in ('admin', 'auditor')
           or (claim_role = 'editor' and claim_org_id = esg_readings.org_unit_id)
    )
);

-- 策略 2: INSERT (新增)
create policy "Insert Access Policy" on public.esg_readings
for insert with check (
    exists (
        select 1 from get_my_claim()
        where claim_role = 'admin'
           or (claim_role = 'editor' and claim_org_id = esg_readings.org_unit_id)
    )
);

-- 策略 3: UPDATE (修改)
create policy "Update Access Policy" on public.esg_readings
for update using (
    exists (
        select 1 from get_my_claim()
        where claim_role = 'admin'
           or (
               claim_role = 'editor'
               and claim_org_id = esg_readings.org_unit_id
               and esg_readings.status != 'locked'
           )
    )
);

-- 策略 4: DELETE (刪除)
create policy "Delete Access Policy" on public.esg_readings
for delete using (
    exists (
        select 1 from get_my_claim()
        where claim_role = 'admin'
    )
);

-- --- 針對 [esg_evidence] 的策略 ---
create policy "Evidence Access Inherited" on public.esg_evidence
for all using (
    exists (
        select 1 from public.esg_readings
        where id = esg_evidence.reading_id
    )
);

-- -----------------------------------------------------------------------------
-- 模組 G: 自動化係數管理與運算 (Calculation Engine)
-- -----------------------------------------------------------------------------

-- 建立碳排係數表
create table if not exists public.emission_factors (
    id uuid primary key default uuid_generate_v4(),
    metric_code text not null,
    year int not null,
    factor numeric not null,
    unit_from text not null,
    unit_to text not null,
    source text,
    unique (metric_code, year)
);

-- 擴充 esg_readings 表，增加自動計算欄位
alter table public.esg_readings
add column if not exists calculated_value numeric,
add column if not exists factor_used numeric;

-- 自動計算觸發器
create or replace function calculate_emissions()
returns trigger as $$
declare
    target_factor numeric;
    data_year int;
begin
    data_year := extract(year from new.period_start);

    select factor into target_factor
    from public.emission_factors ef
    join public.metric_definitions md on md.code = ef.metric_code
    where md.id = new.metric_id
    and ef.year = data_year;

    if target_factor is not null then
        new.factor_used := target_factor;
        new.calculated_value := new.value * target_factor;
    end if;

    return new;
end;
$$ language plpgsql;

-- 綁定觸發器
create trigger trigger_auto_calculate_esg
    before insert or update of value, period_start on public.esg_readings
    for each row execute procedure calculate_emissions();

-- -----------------------------------------------------------------------------
-- 模組 H: 審核狀態機 (Approval Workflow State Machine)
-- -----------------------------------------------------------------------------

-- 審核操作函數
create or replace function process_approval(
    reading_id uuid,
    action text,
    comment text default null
)
returns void as $$
declare
    current_status text;
    user_role text;
begin
    select status into current_status from public.esg_readings where id = reading_id;

    select role into user_role from public.user_profiles where id = auth.uid();

    if action = 'submit' then
        if current_status = 'draft' or current_status = 'rejected' then
            update public.esg_readings set status = 'review' where id = reading_id;
        else
            raise exception '只能提交 Draft 或 Rejected 狀態的數據';
        end if;

    elsif action = 'approve' then
        if user_role not in ('admin') then
            raise exception '權限不足：僅管理員可核准';
        end if;

        if current_status = 'review' then
            update public.esg_readings
            set status = 'approved',
                approved_by = auth.uid()
            where id = reading_id;
        else
            raise exception '數據不在審核中狀態';
        end if;

    elsif action = 'reject' then
        if user_role not in ('admin') then
            raise exception '權限不足';
        end if;

        update public.esg_readings set status = 'rejected' where id = reading_id;
    end if;
end;
$$ language plpgsql security definer;

-- -----------------------------------------------------------------------------
-- 模組 I: 初始組織與係數數據 (Seed Data)
-- -----------------------------------------------------------------------------

-- 組織架構
insert into public.org_units (name, code, tier_level) values
('善向科技總部', 'TPE-HQ', 'Company'),
('台北研發中心', 'TPE-RD', 'Site'),
('高雄製造廠', 'KHH-PLANT', 'Site'),
('台中物流中心', 'TXG-LOG', 'Site')
on conflict (code) do nothing;

-- 排放係數 (台灣電力 2024年數據)
insert into public.emission_factors (metric_code, year, factor, unit_from, unit_to, source) values
('E-Elec', 2024, 0.495, 'kWh', 'kgCO2e', '台灣電力公司 2024年排放係數')
on conflict (metric_code, year) do nothing;