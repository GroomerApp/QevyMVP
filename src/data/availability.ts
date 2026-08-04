// Track A (A2). The only place the scheduling engine meets the database.
import type { Slot } from '@/domain/scheduling';

export async function getAvailableSlots(_salonId: string, _input: {
  serviceId: string;
  groomerId?: string; // omit = any groomer
  from: Date;
  to: Date;
}): Promise<Array<Slot & { groomerId: string }>> {
  throw new Error('not implemented — A2');
}
