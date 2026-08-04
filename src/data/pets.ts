// Track B (B2).
import { and, eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { pet } from '@/db/schema';

export async function getPet(salonId: string, petId: string) {
  const rows = await db
    .select()
    .from(pet)
    .where(and(eq(pet.salonId, salonId), eq(pet.id, petId)));
  return rows[0] ?? null;
}

export async function listPetsForClient(salonId: string, clientId: string) {
  return db
    .select()
    .from(pet)
    .where(and(eq(pet.salonId, salonId), eq(pet.clientId, clientId)));
}
