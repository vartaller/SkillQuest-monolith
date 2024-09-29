-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'RESEARCHER', 'VIEWER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'DELETED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "сharacter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "currentExperience" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "сharacter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PassiveEffect" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "characterId" INTEGER NOT NULL,

    CONSTRAINT "PassiveEffect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveEffect" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "characterId" INTEGER NOT NULL,

    CONSTRAINT "ActiveEffect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stepTypeId" INTEGER NOT NULL,
    "currentStepValue" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "stepsToNextLevel" INTEGER NOT NULL,
    "characterId" INTEGER NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Step" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PassiveEffectToSkill" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ActiveEffectToSkill" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_PassiveEffectToSkill_AB_unique" ON "_PassiveEffectToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_PassiveEffectToSkill_B_index" ON "_PassiveEffectToSkill"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ActiveEffectToSkill_AB_unique" ON "_ActiveEffectToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_ActiveEffectToSkill_B_index" ON "_ActiveEffectToSkill"("B");

-- AddForeignKey
ALTER TABLE "сharacter" ADD CONSTRAINT "сharacter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassiveEffect" ADD CONSTRAINT "PassiveEffect_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "сharacter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveEffect" ADD CONSTRAINT "ActiveEffect_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "сharacter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_stepTypeId_fkey" FOREIGN KEY ("stepTypeId") REFERENCES "Step"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "сharacter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PassiveEffectToSkill" ADD CONSTRAINT "_PassiveEffectToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "PassiveEffect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PassiveEffectToSkill" ADD CONSTRAINT "_PassiveEffectToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActiveEffectToSkill" ADD CONSTRAINT "_ActiveEffectToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "ActiveEffect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActiveEffectToSkill" ADD CONSTRAINT "_ActiveEffectToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
