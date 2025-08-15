/*
  Warnings:

  - You are about to drop the `HorarioDisponivel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."HorarioDisponivel" DROP CONSTRAINT "HorarioDisponivel_profissionalId_fkey";

-- DropTable
DROP TABLE "public"."HorarioDisponivel";
