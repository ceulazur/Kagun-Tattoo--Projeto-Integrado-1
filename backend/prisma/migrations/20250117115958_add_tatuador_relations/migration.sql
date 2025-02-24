-- CreateTable
CREATE TABLE "Sessao" (
    "idSessao" SERIAL NOT NULL,
    "nomeCliente" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "horario" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'agendada',
    "idTatuador" INTEGER NOT NULL,

    CONSTRAINT "Sessao_pkey" PRIMARY KEY ("idSessao")
);

-- AddForeignKey
ALTER TABLE "Sessao" ADD CONSTRAINT "Sessao_idTatuador_fkey" FOREIGN KEY ("idTatuador") REFERENCES "Tatuador"("idTatuador") ON DELETE RESTRICT ON UPDATE CASCADE;
