export class CreateSkillDto {
  name: string;
  characterId: number;
  level?: number;
  currentPoints?: number;
  pointsToNextLevel?: number;
}
