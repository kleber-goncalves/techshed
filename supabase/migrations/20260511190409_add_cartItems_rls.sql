-- RLS example for the CartItems table.
--
-- Cart items are user-private data. The owner is identified by "userId",
-- which stores the Supabase auth user id as text in this project.

alter table "public"."CartItems"
enable row level security;

drop policy if exists "Users can read their own cart items"
on "public"."CartItems";

create policy "Users can read their own cart items"
on "public"."CartItems"
for select
to authenticated
using ((select auth.uid())::text = "userId");

drop policy if exists "Users can insert their own cart items"
on "public"."CartItems";

create policy "Users can insert their own cart items"
on "public"."CartItems"
for insert
to authenticated
with check (
    (select auth.uid())::text = "userId"
    and quantity >= 1
);

drop policy if exists "Users can update their own cart items"
on "public"."CartItems";

create policy "Users can update their own cart items"
on "public"."CartItems"
for update
to authenticated
using ((select auth.uid())::text = "userId")
with check (
    (select auth.uid())::text = "userId"
    and quantity >= 1
);

drop policy if exists "Users can delete their own cart items"
on "public"."CartItems";

create policy "Users can delete their own cart items"
on "public"."CartItems"
for delete
to authenticated
using ((select auth.uid())::text = "userId");
