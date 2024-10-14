/*
  Warnings:

  - You are about to drop the column `stepTypeId` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the `_ActiveEffectToSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PassiveEffectToSkill` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `stepId` to the `Skill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_stepTypeId_fkey";

-- DropForeignKey
ALTER TABLE "_ActiveEffectToSkill" DROP CONSTRAINT "_ActiveEffectToSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActiveEffectToSkill" DROP CONSTRAINT "_ActiveEffectToSkill_B_fkey";

-- DropForeignKey
ALTER TABLE "_PassiveEffectToSkill" DROP CONSTRAINT "_PassiveEffectToSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_PassiveEffectToSkill" DROP CONSTRAINT "_PassiveEffectToSkill_B_fkey";

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "stepTypeId",
ADD COLUMN     "stepId" INTEGER NOT NULL,
ALTER COLUMN "currentStepValue" SET DEFAULT 0,
ALTER COLUMN "level" SET DEFAULT 0;

-- DropTable
DROP TABLE "_ActiveEffectToSkill";

-- DropTable
DROP TABLE "_PassiveEffectToSkill";

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
