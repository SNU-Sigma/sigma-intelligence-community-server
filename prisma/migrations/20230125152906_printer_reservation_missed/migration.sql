/*
  Warnings:

  - You are about to drop the column `endTime` on the `PrinterReservation` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `PrinterReservation` table. All the data in the column will be lost.
  - Added the required column `requestEndTime` to the `PrinterReservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestStartTime` to the `PrinterReservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PrinterReservation" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "requestEndTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "requestStartTime" TIMESTAMP(3) NOT NULL;
