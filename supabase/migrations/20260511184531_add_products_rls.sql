-- RLS example for the public catalog tables.
--
-- In this project, the storefront can read active products publicly.
-- Product creation/update/delete should continue going through the Next.js
-- admin API, which already checks requireAdmin before using Prisma.
-- Because of that, this migration only creates SELECT policies.

alter table "public"."Produtos"
enable row level security;

alter table "public"."ProdutoImagens"
enable row level security;

alter table "public"."ProdutoVariantes"
enable row level security;

alter table "public"."ProdutoVarianteImagens"
enable row level security;

drop policy if exists "Public can read active products"
on "public"."Produtos";

create policy "Public can read active products"
on "public"."Produtos"
for select
to anon, authenticated
using ("isActive" = true);

drop policy if exists "Public can read images from active products"
on "public"."ProdutoImagens";

create policy "Public can read images from active products"
on "public"."ProdutoImagens"
for select
to anon, authenticated
using (
    exists (
        select 1
        from "public"."Produtos" as product
        where product.id = "ProdutoImagens"."produtoId"
          and product."isActive" = true
    )
);

drop policy if exists "Public can read variants from active products"
on "public"."ProdutoVariantes";

create policy "Public can read variants from active products"
on "public"."ProdutoVariantes"
for select
to anon, authenticated
using (
    exists (
        select 1
        from "public"."Produtos" as product
        where product.id = "ProdutoVariantes"."produtoId"
          and product."isActive" = true
    )
);

drop policy if exists "Public can read variant images from active products"
on "public"."ProdutoVarianteImagens";

create policy "Public can read variant images from active products"
on "public"."ProdutoVarianteImagens"
for select
to anon, authenticated
using (
    exists (
        select 1
        from "public"."ProdutoVariantes" as variant
        join "public"."Produtos" as product
          on product.id = variant."produtoId"
        where variant.id = "ProdutoVarianteImagens"."varianteId"
          and product."isActive" = true
    )
);
