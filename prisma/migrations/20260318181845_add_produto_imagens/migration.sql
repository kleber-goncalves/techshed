-- CreateTable
CREATE TABLE "ProdutoImagens" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "storagePath" TEXT,

    CONSTRAINT "ProdutoImagens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProdutoImagens_produtoId_position_idx" ON "ProdutoImagens"("produtoId", "position");

-- AddForeignKey
ALTER TABLE "ProdutoImagens" ADD CONSTRAINT "ProdutoImagens_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
