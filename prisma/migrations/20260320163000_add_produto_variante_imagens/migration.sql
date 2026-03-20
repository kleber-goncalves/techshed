-- CreateTable
CREATE TABLE "ProdutoVarianteImagens" (
    "id" TEXT NOT NULL,
    "varianteId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "storagePath" TEXT,

    CONSTRAINT "ProdutoVarianteImagens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProdutoVarianteImagens_varianteId_position_idx" ON "ProdutoVarianteImagens"("varianteId", "position");

-- AddForeignKey
ALTER TABLE "ProdutoVarianteImagens" ADD CONSTRAINT "ProdutoVarianteImagens_varianteId_fkey" FOREIGN KEY ("varianteId") REFERENCES "ProdutoVariantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
