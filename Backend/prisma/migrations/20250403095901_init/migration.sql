-- CreateTable
CREATE TABLE "InvalidatedToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiry_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvalidatedToken_pkey" PRIMARY KEY ("id")
);
