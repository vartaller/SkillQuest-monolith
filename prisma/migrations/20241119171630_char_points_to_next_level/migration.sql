/*
  Warnings:

  - You are about to alter the column `value` on the `ActiveEffect` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `value` on the `PassiveEffect` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `skillId` to the `ActiveEffect` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skillId` to the `PassiveEffect` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActiveEffect" ADD COLUMN     "skillId" INTEGER NOT NULL,
ALTER COLUMN "value" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "PassiveEffect" ADD COLUMN     "skillId" INTEGER NOT NULL,
ALTER COLUMN "value" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "сharacter" ADD COLUMN     "pointsToNextLevel" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "PassiveEffect" ADD CONSTRAINT "PassiveEffect_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveEffect" ADD CONSTRAINT "ActiveEffect_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
