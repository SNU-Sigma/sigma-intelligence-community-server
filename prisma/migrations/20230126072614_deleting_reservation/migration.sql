/*
  Warnings:

  - The primary key for the `PrinterReservation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PrinterReservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PrinterReservation" DROP CONSTRAINT "PrinterReservation_pkey",
DROP COLUMN "id",
ADD COLUMN     "reservationId" SERIAL NOT NULL,
ADD CONSTRAINT "PrinterReservation_pkey" PRIMARY KEY ("reservationId");
