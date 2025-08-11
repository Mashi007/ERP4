create table if not exists org_settings (
  org_id text primary key,
  currency_code text not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into org_settings (org_id, currency_code)
values ('default', 'EUR')
on conflict (org_id) do nothing;
