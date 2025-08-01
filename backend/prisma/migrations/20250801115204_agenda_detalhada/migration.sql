/*
  Warnings:

  - The `diasAtendimento` column on the `Profissional` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."DiaSemana" AS ENUM ('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO');

-- AlterTable
ALTER TABLE "public"."Profissional" DROP COLUMN "diasAtendimento",
ADD COLUMN     "diasAtendimento" "public"."DiaSemana"[];
