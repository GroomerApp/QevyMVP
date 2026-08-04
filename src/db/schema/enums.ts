import { pgEnum } from 'drizzle-orm/pg-core';

export const smsStatusEnum = pgEnum('sms_status', ['pending', 'active', 'failed']);
export const membershipRoleEnum = pgEnum('membership_role', ['owner', 'groomer']);
export const membershipStatusEnum = pgEnum('membership_status', ['active', 'invited', 'disabled']);
export const petSizeEnum = pgEnum('pet_size', ['xs', 's', 'm', 'l', 'xl']);
export const noteSourceEnum = pgEnum('note_source', ['manual', 'voice']);
export const transcriptStatusEnum = pgEnum('transcript_status', ['none', 'pending', 'complete', 'failed']);
export const photoKindEnum = pgEnum('photo_kind', ['before', 'after', 'other']);
export const appointmentStatusEnum = pgEnum('appointment_status', [
  'booked', 'confirmed', 'checked_in', 'completed', 'no_show', 'cancelled',
]);
export const appointmentSourceEnum = pgEnum('appointment_source', ['online', 'staff']);
export const specialtyTagTypeEnum = pgEnum('specialty_tag_type', ['breed', 'coat', 'size', 'temperament']);
export const notificationTypeEnum = pgEnum('notification_type', [
  'booking_confirmation', 'reminder_24h', 'photo_send', 'cancellation', 'custom',
]);
export const notificationChannelEnum = pgEnum('notification_channel', ['sms', 'email']);
export const notificationStatusEnum = pgEnum('notification_status', [
  'queued', 'sent', 'delivered', 'failed', 'skipped',
]);
export const preferredChannelEnum = pgEnum('preferred_channel', ['sms', 'email', 'none']);
export const inboundIntentEnum = pgEnum('inbound_intent', ['confirm', 'cancel', 'stop', 'help', 'unknown']);
export const paymentProviderEnum = pgEnum('payment_provider', ['stripe', 'square', 'manual']);
export const paymentMethodEnum = pgEnum('payment_method', ['card', 'cash', 'other']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'succeeded', 'failed', 'refunded']);
