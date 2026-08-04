import { redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { membership } from '@/db/schema';
import { createSupabaseServerClient } from './supabase-server';

export type SessionContext = {
  salonId: string;
  userId: string;
  role: 'owner' | 'groomer';
};

/** Resolve the logged-in user's salon context, or redirect to /login. */
export async function requireSalon(): Promise<SessionContext> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/login');

  const rows = await db
    .select()
    .from(membership)
    .where(and(eq(membership.userId, data.user.id), eq(membership.status, 'active')));
  const m = rows[0];
  if (!m) redirect('/login');

  return { salonId: m.salonId, userId: m.userId, role: m.role };
}

export async function requireRole(role: 'owner'): Promise<SessionContext> {
  const ctx = await requireSalon();
  if (ctx.role !== role) redirect('/dashboard');
  return ctx;
}
