-- RLS example for the User table.
--
-- This table stores app profile data mirrored from Supabase Auth.
-- Users can read and update only their own row.
-- Direct client-side updates are not allowed to promote a user to ADMIN.
-- Admin-only changes should continue going through the Next.js admin API.

alter table "public"."User"
enable row level security;

drop policy if exists "Users can read their own profile"
on "public"."User";

create policy "Users can read their own profile"
on "public"."User"
for select
to authenticated
using ((select auth.uid())::text = id);

drop policy if exists "Users can insert their own customer profile"
on "public"."User";

create policy "Users can insert their own customer profile"
on "public"."User"
for insert
to authenticated
with check (
    (select auth.uid())::text = id
    and role = 'CUSTOMER'::"public"."UserRole"
);

drop policy if exists "Users can update their own customer profile"
on "public"."User";

create policy "Users can update their own customer profile"
on "public"."User"
for update
to authenticated
using ((select auth.uid())::text = id)
with check (
    (select auth.uid())::text = id
    and role = 'CUSTOMER'::"public"."UserRole"
);
