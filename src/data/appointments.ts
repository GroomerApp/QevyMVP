// Track A (A2).

/** Thrown when the DB overlap constraint rejects a booking. Map to a
 * friendly "that slot was just taken" — never a 500. */
export class SlotTakenError extends Error {
  constructor() {
    super('That slot was just taken.');
    this.name = 'SlotTakenError';
  }
}

export type CreateAppointmentInput = {
  groomerId: string;
  clientId: string;
  petId: string;
  serviceId: string;
  serviceStartAt: Date;
  source: 'online' | 'staff';
};

export async function createAppointment(
  _salonId: string,
  _input: CreateAppointmentInput,
): Promise<{ appointmentId: string }> {
  throw new Error('not implemented — A2');
}

export async function cancelAppointment(
  _salonId: string,
  _appointmentId: string,
  _reason?: string,
): Promise<void> {
  throw new Error('not implemented — A2');
}

export async function rescheduleAppointment(
  _salonId: string,
  _appointmentId: string,
  _newServiceStartAt: Date,
  _newGroomerId?: string,
): Promise<void> {
  throw new Error('not implemented — A2');
}

export async function checkIn(_salonId: string, _appointmentId: string): Promise<void> {
  throw new Error('not implemented — A2');
}

export async function markCompleted(_salonId: string, _appointmentId: string): Promise<void> {
  throw new Error('not implemented — A2');
}

export async function markNoShow(_salonId: string, _appointmentId: string): Promise<void> {
  throw new Error('not implemented — A2');
}
