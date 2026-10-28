-- Execute no SQL Editor do Supabase.
-- Cada treinador gerencia somente suas próprias táticas.
-- Compartilhamento público é somente leitura e requer um UUID de compartilhamento.
create table if not exists public.tactics (
 id uuid primary key,
 owner_id uuid not null references auth.users(id) on delete cascade,
 title text not null default 'Nova jogada',
 data jsonb not null,
 share_id uuid unique,
 updated_at timestamptz not null default now()
);
create index if not exists tactics_owner_updated_idx on public.tactics(owner_id,updated_at desc);
create index if not exists tactics_share_idx on public.tactics(share_id);
alter table public.tactics enable row level security;
create policy "Treinadores leem suas taticas" on public.tactics for select to authenticated using (auth.uid() = owner_id);
create policy "Treinadores criam suas taticas" on public.tactics for insert to authenticated with check (auth.uid() = owner_id);
create policy "Treinadores editam suas taticas" on public.tactics for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Treinadores excluem suas taticas" on public.tactics for delete to authenticated using (auth.uid() = owner_id);
-- Acesso público APENAS por link de compartilhamento. A política limita a consulta a registros compartilhados.
create policy "Publico visualiza taticas compartilhadas" on public.tactics for select to anon using (share_id is not null);
