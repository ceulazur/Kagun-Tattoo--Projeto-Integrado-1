/*
  Warnings:

  - The primary key for the `Sessao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `data` on the `Sessao` table. All the data in the column will be lost.
  - You are about to drop the column `horario` on the `Sessao` table. All the data in the column will be lost.
  - You are about to drop the column `idSessao` on the `Sessao` table. All the data in the column will be lost.
  - You are about to drop the column `nomeCliente` on the `Sessao` table. All the data in the column will be lost.
  - The `status` column on the `Sessao` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Tatuador` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idTatuador` on the `Tatuador` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[telefone]` on the table `Tatuador` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dataHorario` to the `Sessao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idCliente` to the `Sessao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `Tatuador` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusSessao" AS ENUM ('agendada', 'concluida', 'cancelada');

-- DropForeignKey
ALTER TABLE "Sessao" DROP CONSTRAINT "Sessao_idTatuador_fkey";

-- AlterTable
ALTER TABLE "Sessao" DROP CONSTRAINT "Sessao_pkey",
DROP COLUMN "data",
DROP COLUMN "horario",
DROP COLUMN "idSessao",
DROP COLUMN "nomeCliente",
ADD COLUMN     "dataHorario" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "idCliente" INTEGER NOT NULL,
ADD COLUMN     "termino" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "StatusSessao" NOT NULL DEFAULT 'agendada',
ADD CONSTRAINT "Sessao_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Tatuador" DROP CONSTRAINT "Tatuador_pkey",
DROP COLUMN "idTatuador",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "telefone" TEXT NOT NULL,
ADD CONSTRAINT "Tatuador_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_telefone_key" ON "Cliente"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "Tatuador_telefone_key" ON "Tatuador"("telefone");

-- AddForeignKey
ALTER TABLE "Sessao" ADD CONSTRAINT "Sessao_idTatuador_fkey" FOREIGN KEY ("idTatuador") REFERENCES "Tatuador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessao" ADD CONSTRAINT "Sessao_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
