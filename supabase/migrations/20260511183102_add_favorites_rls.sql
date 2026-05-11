-- RLS example for the Favorites table.
-- The project stores Supabase user IDs as text in "userId", so auth.uid()
-- is cast to text before comparing.

alter table "public"."Favorites"
enable row level security;

drop policy if exists "Users can read their own favorites"
on "public"."Favorites";

create policy "Users can read their own favorites"
on "public"."Favorites"
for select
to authenticated
using ((select auth.uid())::text = "userId");

drop policy if exists "Users can insert their own favorites"
on "public"."Favorites";

create policy "Users can insert their own favorites"
on "public"."Favorites"
for insert
to authenticated
with check ((select auth.uid())::text = "userId");

drop policy if exists "Users can update their own favorites"
on "public"."Favorites";

create policy "Users can update their own favorites"
on "public"."Favorites"
for update
to authenticated
using ((select auth.uid())::text = "userId")
with check ((select auth.uid())::text = "userId");

drop policy if exists "Users can delete their own favorites"
on "public"."Favorites";

create policy "Users can delete their own favorites"
on "public"."Favorites"
for delete
to authenticated
using ((select auth.uid())::text = "userId");
