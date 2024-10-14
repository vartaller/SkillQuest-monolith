/*
  Warnings:

  - You are about to drop the column `currentStepValue` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `stepId` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `stepsToNextLevel` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the `Step` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_stepId_fkey";

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "currentStepValue",
DROP COLUMN "stepId",
DROP COLUMN "stepsToNextLevel",
ADD COLUMN     "currentPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pointsToNextLevel" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Step";

-- CreateTable
CREATE TABLE "SkillAction" (
    "skillId" INTEGER NOT NULL,
    "actionId" INTEGER NOT NULL,
    "givesPoints" INTEGER NOT NULL,

    CONSTRAINT "SkillAction_pkey" PRIMARY KEY ("skillId","actionId")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SkillAction" ADD CONSTRAINT "SkillAction_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillAction" ADD CONSTRAINT "SkillAction_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
