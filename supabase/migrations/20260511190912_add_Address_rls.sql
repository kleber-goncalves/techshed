-- RLS example for the Address table.
--
-- Addresses are user-private data. The app stores the Supabase auth user id
-- as text in "userId", so auth.uid() is cast to text for comparisons.

alter table "public"."Address"
enable row level security;

drop policy if exists "Users can read their own addresses"
on "public"."Address";

create policy "Users can read their own addresses"
on "public"."Address"
for select
to authenticated
using ((select auth.uid())::text = "userId");

drop policy if exists "Users can insert their own addresses"
on "public"."Address";

create policy "Users can insert their own addresses"
on "public"."Address"
for insert
to authenticated
with check (
    (select auth.uid())::text = "userId"
    and length(trim(label)) > 0
    and length(trim(street)) > 0
    and length(trim(city)) > 0
    and length(trim(state)) > 0
    and length(trim("zipCode")) > 0
);

drop policy if exists "Users can update their own addresses"
on "public"."Address";

create policy "Users can update their own addresses"
on "public"."Address"
for update
to authenticated
using ((select auth.uid())::text = "userId")
with check (
    (select auth.uid())::text = "userId"
    and length(trim(label)) > 0
    and length(trim(street)) > 0
    and length(trim(city)) > 0
    and length(trim(state)) > 0
    and length(trim("zipCode")) > 0
);

drop policy if exists "Users can delete their own addresses"
on "public"."Address";

create policy "Users can delete their own addresses"
on "public"."Address"
for delete
to authenticated
using ((select auth.uid())::text = "userId");
