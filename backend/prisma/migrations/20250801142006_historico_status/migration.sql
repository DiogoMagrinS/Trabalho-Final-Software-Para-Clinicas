-- CreateTable
CREATE TABLE "public"."HistoricoStatus" (
    "id" SERIAL NOT NULL,
    "agendamentoId" INTEGER NOT NULL,
    "status" "public"."StatusAgendamento" NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricoStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."HistoricoStatus" ADD CONSTRAINT "HistoricoStatus_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "public"."Agendamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
