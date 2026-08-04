import { pgTable, text, uuid, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { baseColumns } from './_shared';
import { salon } from './salon';
import { client } from './people';
import { appointment } from './appointment';
import {
  notificationTypeEnum, notificationChannelEnum, notificationStatusEnum,
  inboundIntentEnum, paymentProviderEnum, paymentMethodEnum, paymentStatusEnum,
} from './enums';

/**
 * status 'skipped' = client opted out or never consented. A normal outcome,
 * not a failure — must not alert.
 */
export const notification = pgTable(
  'notification',
  {
    ...baseColumns,
    salonId: uuid('salon_id').notNull().references(() => salon.id),
    appointmentId: uuid('appointment_id').references(() => appointment.id),
    clientId: uuid('client_id').notNull().references(() => client.id),
    type: notificationTypeEnum('type').notNull(),
    channel: notificationChannelEnum('channel').notNull(),
    toAddress: text('to_address').notNull(),
    body: text('body').notNull(),
    status: notificationStatusEnum('status').notNull().default('queued'),
    provider: text('provider'),
    providerMessageId: text('provider_message_id'),
    scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }),
    failedReason: text('failed_reason'),
  },
  (t) => [
    index('notification_salon_idx').on(t.salonId),
    index('notification_appointment_idx').on(t.appointmentId),
  ],
);

export const inboundMessage = pgTable(
  'inbound_message',
  {
    ...baseColumns,
    salonId: uuid('salon_id').notNull().references(() => salon.id),
    clientId: uuid('client_id').references(() => client.id),
    fromE164: text('from_e164').notNull(),
    body: text('body').notNull(),
    intent: inboundIntentEnum('intent').notNull().default('unknown'),
    handledAt: timestamp('handled_at', { withTimezone: true }),
    receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('inbound_message_salon_idx').on(t.salonId)],
);

export const payment = pgTable(
  'payment',
  {
    ...baseColumns,
    salonId: uuid('salon_id').notNull().references(() => salon.id),
    appointmentId: uuid('appointment_id').notNull().references(() => appointment.id),
    provider: paymentProviderEnum('provider').notNull(),
    method: paymentMethodEnum('method'),
    providerChargeId: text('provider_charge_id'),
    amountCents: integer('amount_cents').notNull(),
    tipCents: integer('tip_cents').notNull().default(0),
    status: paymentStatusEnum('status').notNull().default('pending'),
    refundedAt: timestamp('refunded_at', { withTimezone: true }),
  },
  (t) => [
    index('payment_salon_idx').on(t.salonId),
    index('payment_appointment_idx').on(t.appointmentId),
  ],
);
