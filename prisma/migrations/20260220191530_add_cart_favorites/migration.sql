-- CreateTable
CREATE TABLE "CartItems" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CartItems_userId_idx" ON "CartItems"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItems_userId_productId_variantId_key" ON "CartItems"("userId", "productId", "variantId");

-- CreateIndex
CREATE INDEX "Favorites_userId_idx" ON "Favorites"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorites_userId_productId_key" ON "Favorites"("userId", "productId");
