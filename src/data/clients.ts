// Track B (B2).
import { and, eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { client } from '@/db/schema';

export async function getClient(salonId: string, clientId: string) {
  const rows = await db
    .select()
    .from(client)
    .where(and(eq(client.salonId, salonId), eq(client.id, clientId)));
  return rows[0] ?? null;
}

export async function findClientByPhone(salonId: string, phoneE164: string) {
  const rows = await db
    .select()
    .from(client)
    .where(and(eq(client.salonId, salonId), eq(client.phoneE164, phoneE164)));
  return rows[0] ?? null;
}
