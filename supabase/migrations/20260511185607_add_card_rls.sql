-- RLS example for the Card table.
--
-- Cards are user-private data. Even though the app stores only last4 instead
-- of full card numbers, direct Supabase access should be restricted to the
-- authenticated owner of each row.

alter table "public"."Card"
enable row level security;

drop policy if exists "Users can read their own cards"
on "public"."Card";

create policy "Users can read their own cards"
on "public"."Card"
for select
to authenticated
using ((select auth.uid())::text = "userId");

drop policy if exists "Users can insert their own cards"
on "public"."Card";

create policy "Users can insert their own cards"
on "public"."Card"
for insert
to authenticated
with check ((select auth.uid())::text = "userId");

drop policy if exists "Users can update their own cards"
on "public"."Card";

create policy "Users can update their own cards"
on "public"."Card"
for update
to authenticated
using ((select auth.uid())::text = "userId")
with check ((select auth.uid())::text = "userId");

drop policy if exists "Users can delete their own cards"
on "public"."Card";

create policy "Users can delete their own cards"
on "public"."Card"
for delete
to authenticated
using ((select auth.uid())::text = "userId");
