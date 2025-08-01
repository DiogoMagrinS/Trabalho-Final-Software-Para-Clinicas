/*
  Warnings:

  - You are about to drop the column `emailComercial` on the `Profissional` table. All the data in the column will be lost.
  - You are about to drop the column `linkProfissional` on the `Profissional` table. All the data in the column will be lost.
  - You are about to drop the column `telefoneComercial` on the `Profissional` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Profissional" DROP COLUMN "emailComercial",
DROP COLUMN "linkProfissional",
DROP COLUMN "telefoneComercial";
