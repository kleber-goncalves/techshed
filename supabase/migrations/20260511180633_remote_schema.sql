drop extension if exists "pg_net";

create type "public"."UserRole" as enum ('CUSTOMER', 'ADMIN');


  create table "public"."Address" (
    "id" text not null,
    "userId" text not null,
    "label" text not null,
    "street" text not null,
    "city" text not null,
    "state" text not null,
    "zipCode" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP
      );



  create table "public"."Card" (
    "id" text not null,
    "userId" text not null,
    "holder" text not null,
    "brand" text,
    "expMonth" integer not null,
    "expYear" integer not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "last4" text not null
      );



  create table "public"."CartItems" (
    "id" text not null,
    "userId" text not null,
    "productId" text not null,
    "variantId" text not null,
    "quantity" integer not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null
      );



  create table "public"."Favorites" (
    "id" text not null,
    "userId" text not null,
    "productId" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP
      );



  create table "public"."ProdutoImagens" (
    "id" text not null,
    "produtoId" text not null,
    "url" text not null,
    "alt" text not null,
    "position" integer not null default 0,
    "storagePath" text
      );



  create table "public"."ProdutoVarianteImagens" (
    "id" text not null,
    "varianteId" text not null,
    "url" text not null,
    "alt" text not null,
    "position" integer not null default 0,
    "storagePath" text
      );



  create table "public"."ProdutoVariantes" (
    "id" text not null,
    "produtoId" text not null,
    "name" text not null,
    "img" text not null,
    "alt" text not null,
    "priceCents" integer not null,
    "stock" integer not null,
    "hex" text,
    "corName" text
      );



  create table "public"."Produtos" (
    "id" text not null,
    "slug" text not null,
    "name" text not null,
    "img" text not null,
    "alt" text not null,
    "priceCents" integer not null,
    "stock" integer not null,
    "category" text not null,
    "catalogKey" text not null,
    "features" text[],
    "promocao" text,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null,
    "description" text,
    "isActive" boolean not null default true
      );



  create table "public"."User" (
    "id" text not null,
    "name" text,
    "email" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "phone" text,
    "role" public."UserRole" not null default 'CUSTOMER'::public."UserRole",
    "avatarUrl" text,
    "avatarStoragePath" text
      );



  create table "public"."_prisma_migrations" (
    "id" character varying(36) not null,
    "checksum" character varying(64) not null,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) not null,
    "logs" text,
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone not null default now(),
    "applied_steps_count" integer not null default 0
      );


CREATE UNIQUE INDEX "Address_pkey" ON public."Address" USING btree (id);

CREATE INDEX "Address_userId_idx" ON public."Address" USING btree ("userId");

CREATE UNIQUE INDEX "Card_pkey" ON public."Card" USING btree (id);

CREATE INDEX "Card_userId_idx" ON public."Card" USING btree ("userId");

CREATE UNIQUE INDEX "CartItems_pkey" ON public."CartItems" USING btree (id);

CREATE INDEX "CartItems_userId_idx" ON public."CartItems" USING btree ("userId");

CREATE UNIQUE INDEX "CartItems_userId_productId_variantId_key" ON public."CartItems" USING btree ("userId", "productId", "variantId");

CREATE UNIQUE INDEX "Favorites_pkey" ON public."Favorites" USING btree (id);

CREATE INDEX "Favorites_userId_idx" ON public."Favorites" USING btree ("userId");

CREATE UNIQUE INDEX "Favorites_userId_productId_key" ON public."Favorites" USING btree ("userId", "productId");

CREATE UNIQUE INDEX "ProdutoImagens_pkey" ON public."ProdutoImagens" USING btree (id);

CREATE INDEX "ProdutoImagens_produtoId_position_idx" ON public."ProdutoImagens" USING btree ("produtoId", "position");

CREATE UNIQUE INDEX "ProdutoVarianteImagens_pkey" ON public."ProdutoVarianteImagens" USING btree (id);

CREATE INDEX "ProdutoVarianteImagens_varianteId_position_idx" ON public."ProdutoVarianteImagens" USING btree ("varianteId", "position");

CREATE UNIQUE INDEX "ProdutoVariantes_pkey" ON public."ProdutoVariantes" USING btree (id);

CREATE INDEX "ProdutoVariantes_produtoId_idx" ON public."ProdutoVariantes" USING btree ("produtoId");

CREATE INDEX "Produtos_catalogKey_idx" ON public."Produtos" USING btree ("catalogKey");

CREATE INDEX "Produtos_category_idx" ON public."Produtos" USING btree (category);

CREATE UNIQUE INDEX "Produtos_pkey" ON public."Produtos" USING btree (id);

CREATE UNIQUE INDEX "Produtos_slug_key" ON public."Produtos" USING btree (slug);

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);

CREATE UNIQUE INDEX "User_pkey" ON public."User" USING btree (id);

CREATE UNIQUE INDEX _prisma_migrations_pkey ON public._prisma_migrations USING btree (id);

alter table "public"."Address" add constraint "Address_pkey" PRIMARY KEY using index "Address_pkey";

alter table "public"."Card" add constraint "Card_pkey" PRIMARY KEY using index "Card_pkey";

alter table "public"."CartItems" add constraint "CartItems_pkey" PRIMARY KEY using index "CartItems_pkey";

alter table "public"."Favorites" add constraint "Favorites_pkey" PRIMARY KEY using index "Favorites_pkey";

alter table "public"."ProdutoImagens" add constraint "ProdutoImagens_pkey" PRIMARY KEY using index "ProdutoImagens_pkey";

alter table "public"."ProdutoVarianteImagens" add constraint "ProdutoVarianteImagens_pkey" PRIMARY KEY using index "ProdutoVarianteImagens_pkey";

alter table "public"."ProdutoVariantes" add constraint "ProdutoVariantes_pkey" PRIMARY KEY using index "ProdutoVariantes_pkey";

alter table "public"."Produtos" add constraint "Produtos_pkey" PRIMARY KEY using index "Produtos_pkey";

alter table "public"."User" add constraint "User_pkey" PRIMARY KEY using index "User_pkey";

alter table "public"."_prisma_migrations" add constraint "_prisma_migrations_pkey" PRIMARY KEY using index "_prisma_migrations_pkey";

alter table "public"."ProdutoImagens" add constraint "ProdutoImagens_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES public."Produtos"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ProdutoImagens" validate constraint "ProdutoImagens_produtoId_fkey";

alter table "public"."ProdutoVarianteImagens" add constraint "ProdutoVarianteImagens_varianteId_fkey" FOREIGN KEY ("varianteId") REFERENCES public."ProdutoVariantes"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ProdutoVarianteImagens" validate constraint "ProdutoVarianteImagens_varianteId_fkey";

alter table "public"."ProdutoVariantes" add constraint "ProdutoVariantes_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES public."Produtos"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ProdutoVariantes" validate constraint "ProdutoVariantes_produtoId_fkey";

grant delete on table "public"."Address" to "anon";

grant insert on table "public"."Address" to "anon";

grant references on table "public"."Address" to "anon";

grant select on table "public"."Address" to "anon";

grant trigger on table "public"."Address" to "anon";

grant truncate on table "public"."Address" to "anon";

grant update on table "public"."Address" to "anon";

grant delete on table "public"."Address" to "authenticated";

grant insert on table "public"."Address" to "authenticated";

grant references on table "public"."Address" to "authenticated";

grant select on table "public"."Address" to "authenticated";

grant trigger on table "public"."Address" to "authenticated";

grant truncate on table "public"."Address" to "authenticated";

grant update on table "public"."Address" to "authenticated";

grant delete on table "public"."Address" to "service_role";

grant insert on table "public"."Address" to "service_role";

grant references on table "public"."Address" to "service_role";

grant select on table "public"."Address" to "service_role";

grant trigger on table "public"."Address" to "service_role";

grant truncate on table "public"."Address" to "service_role";

grant update on table "public"."Address" to "service_role";

grant delete on table "public"."Card" to "anon";

grant insert on table "public"."Card" to "anon";

grant references on table "public"."Card" to "anon";

grant select on table "public"."Card" to "anon";

grant trigger on table "public"."Card" to "anon";

grant truncate on table "public"."Card" to "anon";

grant update on table "public"."Card" to "anon";

grant delete on table "public"."Card" to "authenticated";

grant insert on table "public"."Card" to "authenticated";

grant references on table "public"."Card" to "authenticated";

grant select on table "public"."Card" to "authenticated";

grant trigger on table "public"."Card" to "authenticated";

grant truncate on table "public"."Card" to "authenticated";

grant update on table "public"."Card" to "authenticated";

grant delete on table "public"."Card" to "service_role";

grant insert on table "public"."Card" to "service_role";

grant references on table "public"."Card" to "service_role";

grant select on table "public"."Card" to "service_role";

grant trigger on table "public"."Card" to "service_role";

grant truncate on table "public"."Card" to "service_role";

grant update on table "public"."Card" to "service_role";

grant delete on table "public"."CartItems" to "anon";

grant insert on table "public"."CartItems" to "anon";

grant references on table "public"."CartItems" to "anon";

grant select on table "public"."CartItems" to "anon";

grant trigger on table "public"."CartItems" to "anon";

grant truncate on table "public"."CartItems" to "anon";

grant update on table "public"."CartItems" to "anon";

grant delete on table "public"."CartItems" to "authenticated";

grant insert on table "public"."CartItems" to "authenticated";

grant references on table "public"."CartItems" to "authenticated";

grant select on table "public"."CartItems" to "authenticated";

grant trigger on table "public"."CartItems" to "authenticated";

grant truncate on table "public"."CartItems" to "authenticated";

grant update on table "public"."CartItems" to "authenticated";

grant delete on table "public"."CartItems" to "service_role";

grant insert on table "public"."CartItems" to "service_role";

grant references on table "public"."CartItems" to "service_role";

grant select on table "public"."CartItems" to "service_role";

grant trigger on table "public"."CartItems" to "service_role";

grant truncate on table "public"."CartItems" to "service_role";

grant update on table "public"."CartItems" to "service_role";

grant delete on table "public"."Favorites" to "anon";

grant insert on table "public"."Favorites" to "anon";

grant references on table "public"."Favorites" to "anon";

grant select on table "public"."Favorites" to "anon";

grant trigger on table "public"."Favorites" to "anon";

grant truncate on table "public"."Favorites" to "anon";

grant update on table "public"."Favorites" to "anon";

grant delete on table "public"."Favorites" to "authenticated";

grant insert on table "public"."Favorites" to "authenticated";

grant references on table "public"."Favorites" to "authenticated";

grant select on table "public"."Favorites" to "authenticated";

grant trigger on table "public"."Favorites" to "authenticated";

grant truncate on table "public"."Favorites" to "authenticated";

grant update on table "public"."Favorites" to "authenticated";

grant delete on table "public"."Favorites" to "service_role";

grant insert on table "public"."Favorites" to "service_role";

grant references on table "public"."Favorites" to "service_role";

grant select on table "public"."Favorites" to "service_role";

grant trigger on table "public"."Favorites" to "service_role";

grant truncate on table "public"."Favorites" to "service_role";

grant update on table "public"."Favorites" to "service_role";

grant delete on table "public"."ProdutoImagens" to "anon";

grant insert on table "public"."ProdutoImagens" to "anon";

grant references on table "public"."ProdutoImagens" to "anon";

grant select on table "public"."ProdutoImagens" to "anon";

grant trigger on table "public"."ProdutoImagens" to "anon";

grant truncate on table "public"."ProdutoImagens" to "anon";

grant update on table "public"."ProdutoImagens" to "anon";

grant delete on table "public"."ProdutoImagens" to "authenticated";

grant insert on table "public"."ProdutoImagens" to "authenticated";

grant references on table "public"."ProdutoImagens" to "authenticated";

grant select on table "public"."ProdutoImagens" to "authenticated";

grant trigger on table "public"."ProdutoImagens" to "authenticated";

grant truncate on table "public"."ProdutoImagens" to "authenticated";

grant update on table "public"."ProdutoImagens" to "authenticated";

grant delete on table "public"."ProdutoImagens" to "service_role";

grant insert on table "public"."ProdutoImagens" to "service_role";

grant references on table "public"."ProdutoImagens" to "service_role";

grant select on table "public"."ProdutoImagens" to "service_role";

grant trigger on table "public"."ProdutoImagens" to "service_role";

grant truncate on table "public"."ProdutoImagens" to "service_role";

grant update on table "public"."ProdutoImagens" to "service_role";

grant delete on table "public"."ProdutoVarianteImagens" to "anon";

grant insert on table "public"."ProdutoVarianteImagens" to "anon";

grant references on table "public"."ProdutoVarianteImagens" to "anon";

grant select on table "public"."ProdutoVarianteImagens" to "anon";

grant trigger on table "public"."ProdutoVarianteImagens" to "anon";

grant truncate on table "public"."ProdutoVarianteImagens" to "anon";

grant update on table "public"."ProdutoVarianteImagens" to "anon";

grant delete on table "public"."ProdutoVarianteImagens" to "authenticated";

grant insert on table "public"."ProdutoVarianteImagens" to "authenticated";

grant references on table "public"."ProdutoVarianteImagens" to "authenticated";

grant select on table "public"."ProdutoVarianteImagens" to "authenticated";

grant trigger on table "public"."ProdutoVarianteImagens" to "authenticated";

grant truncate on table "public"."ProdutoVarianteImagens" to "authenticated";

grant update on table "public"."ProdutoVarianteImagens" to "authenticated";

grant delete on table "public"."ProdutoVarianteImagens" to "service_role";

grant insert on table "public"."ProdutoVarianteImagens" to "service_role";

grant references on table "public"."ProdutoVarianteImagens" to "service_role";

grant select on table "public"."ProdutoVarianteImagens" to "service_role";

grant trigger on table "public"."ProdutoVarianteImagens" to "service_role";

grant truncate on table "public"."ProdutoVarianteImagens" to "service_role";

grant update on table "public"."ProdutoVarianteImagens" to "service_role";

grant delete on table "public"."ProdutoVariantes" to "anon";

grant insert on table "public"."ProdutoVariantes" to "anon";

grant references on table "public"."ProdutoVariantes" to "anon";

grant select on table "public"."ProdutoVariantes" to "anon";

grant trigger on table "public"."ProdutoVariantes" to "anon";

grant truncate on table "public"."ProdutoVariantes" to "anon";

grant update on table "public"."ProdutoVariantes" to "anon";

grant delete on table "public"."ProdutoVariantes" to "authenticated";

grant insert on table "public"."ProdutoVariantes" to "authenticated";

grant references on table "public"."ProdutoVariantes" to "authenticated";

grant select on table "public"."ProdutoVariantes" to "authenticated";

grant trigger on table "public"."ProdutoVariantes" to "authenticated";

grant truncate on table "public"."ProdutoVariantes" to "authenticated";

grant update on table "public"."ProdutoVariantes" to "authenticated";

grant delete on table "public"."ProdutoVariantes" to "service_role";

grant insert on table "public"."ProdutoVariantes" to "service_role";

grant references on table "public"."ProdutoVariantes" to "service_role";

grant select on table "public"."ProdutoVariantes" to "service_role";

grant trigger on table "public"."ProdutoVariantes" to "service_role";

grant truncate on table "public"."ProdutoVariantes" to "service_role";

grant update on table "public"."ProdutoVariantes" to "service_role";

grant delete on table "public"."Produtos" to "anon";

grant insert on table "public"."Produtos" to "anon";

grant references on table "public"."Produtos" to "anon";

grant select on table "public"."Produtos" to "anon";

grant trigger on table "public"."Produtos" to "anon";

grant truncate on table "public"."Produtos" to "anon";

grant update on table "public"."Produtos" to "anon";

grant delete on table "public"."Produtos" to "authenticated";

grant insert on table "public"."Produtos" to "authenticated";

grant references on table "public"."Produtos" to "authenticated";

grant select on table "public"."Produtos" to "authenticated";

grant trigger on table "public"."Produtos" to "authenticated";

grant truncate on table "public"."Produtos" to "authenticated";

grant update on table "public"."Produtos" to "authenticated";

grant delete on table "public"."Produtos" to "service_role";

grant insert on table "public"."Produtos" to "service_role";

grant references on table "public"."Produtos" to "service_role";

grant select on table "public"."Produtos" to "service_role";

grant trigger on table "public"."Produtos" to "service_role";

grant truncate on table "public"."Produtos" to "service_role";

grant update on table "public"."Produtos" to "service_role";

grant delete on table "public"."User" to "anon";

grant insert on table "public"."User" to "anon";

grant references on table "public"."User" to "anon";

grant select on table "public"."User" to "anon";

grant trigger on table "public"."User" to "anon";

grant truncate on table "public"."User" to "anon";

grant update on table "public"."User" to "anon";

grant delete on table "public"."User" to "authenticated";

grant insert on table "public"."User" to "authenticated";

grant references on table "public"."User" to "authenticated";

grant select on table "public"."User" to "authenticated";

grant trigger on table "public"."User" to "authenticated";

grant truncate on table "public"."User" to "authenticated";

grant update on table "public"."User" to "authenticated";

grant delete on table "public"."User" to "service_role";

grant insert on table "public"."User" to "service_role";

grant references on table "public"."User" to "service_role";

grant select on table "public"."User" to "service_role";

grant trigger on table "public"."User" to "service_role";

grant truncate on table "public"."User" to "service_role";

grant update on table "public"."User" to "service_role";

grant delete on table "public"."_prisma_migrations" to "anon";

grant insert on table "public"."_prisma_migrations" to "anon";

grant references on table "public"."_prisma_migrations" to "anon";

grant select on table "public"."_prisma_migrations" to "anon";

grant trigger on table "public"."_prisma_migrations" to "anon";

grant truncate on table "public"."_prisma_migrations" to "anon";

grant update on table "public"."_prisma_migrations" to "anon";

grant delete on table "public"."_prisma_migrations" to "authenticated";

grant insert on table "public"."_prisma_migrations" to "authenticated";

grant references on table "public"."_prisma_migrations" to "authenticated";

grant select on table "public"."_prisma_migrations" to "authenticated";

grant trigger on table "public"."_prisma_migrations" to "authenticated";

grant truncate on table "public"."_prisma_migrations" to "authenticated";

grant update on table "public"."_prisma_migrations" to "authenticated";

grant delete on table "public"."_prisma_migrations" to "service_role";

grant insert on table "public"."_prisma_migrations" to "service_role";

grant references on table "public"."_prisma_migrations" to "service_role";

grant select on table "public"."_prisma_migrations" to "service_role";

grant trigger on table "public"."_prisma_migrations" to "service_role";

grant truncate on table "public"."_prisma_migrations" to "service_role";

grant update on table "public"."_prisma_migrations" to "service_role";


