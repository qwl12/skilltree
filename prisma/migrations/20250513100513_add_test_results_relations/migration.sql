-- CreateTable
CREATE TABLE "TestResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
