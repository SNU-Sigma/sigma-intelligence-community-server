-- CreateTable
CREATE TABLE "PrinterReservation" (
    "id" SERIAL NOT NULL,
    "printerId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PrinterReservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrinterReservation" ADD CONSTRAINT "PrinterReservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
