// Track B (B3). Supabase Storage, presigned direct uploads.

export type StoragePrefix = 'pet-photos' | 'voice-notes' | 'vaccination-docs';

export interface Storage {
  createUploadUrl(input: {
    salonId: string;
    contentType: string;
    prefix: StoragePrefix;
  }): Promise<{ uploadUrl: string; storageKey: string }>;

  createReadUrl(storageKey: string, ttlSec: number): Promise<string>;
}

export const storage: Storage = {
  async createUploadUrl() {
    throw new Error('not implemented — B3');
  },
  async createReadUrl() {
    throw new Error('not implemented — B3');
  },
};
