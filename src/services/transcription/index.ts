// Track B (B5). Deepgram.

export interface Transcriber {
  transcribe(input: { audioUrl: string }): Promise<{
    text: string;
    confidence: number;
    durationSec: number;
  }>;
}

export const transcriber: Transcriber = {
  async transcribe() {
    throw new Error('not implemented — B5');
  },
};
