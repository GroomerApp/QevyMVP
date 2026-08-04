// Track B (B1).
import { and, eq, asc } from 'drizzle-orm';
import { db } from '@/db/client';
import { service } from '@/db/schema';

export async function listServices(salonId: string, opts?: { activeOnly?: boolean }) {
  return db
    .select()
    .from(service)
    .where(
      opts?.activeOnly
        ? and(eq(service.salonId, salonId), eq(service.active, true))
        : eq(service.salonId, salonId),
    )
    .orderBy(asc(service.sortOrder));
}
