// The five cross-track events (CONTRACT §4). Tracks meet here, never via
// direct function calls. Track A emits appointment/*; Track B consumes.

export type AppointmentEventPayload = { salonId: string; appointmentId: string };

export type Events = {
  'appointment/booked': { data: AppointmentEventPayload };
  'appointment/cancelled': { data: AppointmentEventPayload };
  'appointment/completed': { data: AppointmentEventPayload };
  'photo/send-requested': { data: { salonId: string; photoIds: string[]; clientId: string } };
  'voice-note/uploaded': { data: { salonId: string; petNoteId: string } };
};
