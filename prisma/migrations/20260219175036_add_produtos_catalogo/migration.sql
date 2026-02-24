-- CreateTable
CREATE TABLE "Produtos" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "catalogKey" TEXT NOT NULL,
    "features" TEXT[],
    "promocao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoVariantes" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "hex" TEXT,
    "corName" TEXT,

    CONSTRAINT "ProdutoVariantes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Produtos_slug_key" ON "Produtos"("slug");

-- CreateIndex
CREATE INDEX "Produtos_category_idx" ON "Produtos"("category");

-- CreateIndex
CREATE INDEX "Produtos_catalogKey_idx" ON "Produtos"("catalogKey");

-- CreateIndex
CREATE INDEX "ProdutoVariantes_produtoId_idx" ON "ProdutoVariantes"("produtoId");

-- AddForeignKey
ALTER TABLE "ProdutoVariantes" ADD CONSTRAINT "ProdutoVariantes_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
