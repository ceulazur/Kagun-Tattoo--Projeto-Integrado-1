/*
  Warnings:

  - You are about to drop the column `produtos` on the `Fornecedor` table. All the data in the column will be lost.
  - You are about to drop the column `codigo` on the `Produto` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Produto_codigo_key";

-- AlterTable
ALTER TABLE "Fornecedor" DROP COLUMN "produtos";

-- AlterTable
ALTER TABLE "Produto" DROP COLUMN "codigo",
ADD COLUMN     "idFornecedor" INTEGER;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_idFornecedor_fkey" FOREIGN KEY ("idFornecedor") REFERENCES "Fornecedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
