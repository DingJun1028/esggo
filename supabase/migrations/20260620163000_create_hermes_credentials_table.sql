create table hermes_credentials (
    id uuid primary key default gen_random_uuid(),
    access_token text not null,
    refresh_token text not null,
    expires_in bigint not null,
    token_type text not null,
    scope text not null,
    profile text not null unique default 'system_default',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index idx_hermes_credentials_profile on hermes_credentials(profile);

alter table hermes_credentials enable row level security;

create policy "Allow authenticated users to read own credentials"
    on hermes_credentials for select
    using (auth.uid() is not null);

create policy "Allow authenticated users to insert credentials"
    on hermes_credentials for insert
    with check (auth.uid() is not null);

create policy "Allow authenticated users to update own credentials"
    on hermes_credentials for update
    using (auth.uid() is not null)
    with check (auth.uid() is not null);

create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_hermes_credentials_updated_at before update on hermes_credentials
    for each row execute procedure update_updated_at_column();