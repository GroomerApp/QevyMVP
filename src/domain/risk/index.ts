// Track A (A6). Pure. Rules-based, transparent — never a bare number.

export type RiskInput = {
  bookedAt: Date;
  appointmentStartAt: Date;
  history: {
    completedCount: number;
    noShowCount: number;
    lateCancelCount: number;
    lastNoShowAt: Date | null;
  };
};

export type RiskResult = {
  score: number | null; // null = not enough history, suppress the flag
  band: 'low' | 'medium' | 'high' | 'unknown';
  reasons: string[];
};

export function scoreNoShowRisk(_input: RiskInput): RiskResult {
  throw new Error('not implemented — A6');
}
