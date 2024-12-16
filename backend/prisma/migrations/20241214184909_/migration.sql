-- CreateTable
CREATE TABLE "Tatuador" (
    "idTatuador" SERIAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Tatuador_pkey" PRIMARY KEY ("idTatuador")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tatuador_cpf_key" ON "Tatuador"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Tatuador_email_key" ON "Tatuador"("email");
