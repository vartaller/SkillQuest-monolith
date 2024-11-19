export class CreateSkillDto {
  name: string;
  characterId: number;
  userId: number;
  level?: number;
  currentPoints?: number;
  pointsToNextLevel?: number;
}
