// Track A (A5). Pure.

export type MatchInput = {
  pet: {
    breed: string | null;
    coatType: string | null;
    size: string | null;
    behaviorFlags: string[];
  };
  groomers: Array<{
    groomerId: string;
    specialties: Array<{ tagType: string; tagValue: string; proficiency: number }>;
  }>;
};

export type MatchResult = {
  groomerId: string;
  score: number; // 0-100
  reasons: string[]; // human-readable, shown in the UI
};

export function rankGroomers(_input: MatchInput): MatchResult[] {
  throw new Error('not implemented — A5');
}
