// Track B (B1).
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { salon } from '@/db/schema';

export async function getSalon(salonId: string) {
  const rows = await db.select().from(salon).where(eq(salon.id, salonId));
  return rows[0] ?? null;
}

export async function getSalonBySlug(slug: string) {
  const rows = await db.select().from(salon).where(eq(salon.slug, slug));
  return rows[0] ?? null;
}
