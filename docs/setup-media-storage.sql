-- Run in the SQL editor for the configured UNMUTE Supabase project.
-- The current player stores public media URLs. This bucket therefore serves
-- individual media URLs publicly; listing and writes stay owner-scoped.
-- Existing buckets are not modified by this repair.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 4194304, array['video/*', 'audio/*'])
on conflict (id) do nothing;

drop policy if exists "unmute_media_owner_upload" on storage.objects;
create policy "unmute_media_owner_upload"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "unmute_media_owner_read" on storage.objects;
create policy "unmute_media_owner_read"
on storage.objects for select to authenticated
using (
  bucket_id = 'media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "unmute_media_owner_delete" on storage.objects;
create policy "unmute_media_owner_delete"
on storage.objects for delete to authenticated
using (
  bucket_id = 'media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
