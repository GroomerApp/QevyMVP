import { pgTable, text, uuid, integer, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { baseColumns } from './_shared';
import { salon } from './salon';
import { groomer } from './identity';
import { client, pet } from './people';
import { service } from './catalog';
import { appointmentStatusEnum, appointmentSourceEnum, specialtyTagTypeEnum } from './enums';

/**
 * Two time ranges, on purpose:
 * - start_at/end_at INCLUDE buffers — what conflict detection uses.
 * - service_start_at/service_end_at EXCLUDE buffers — what the client sees.
 * Confusing these will double-book.
 *
 * Overlap is also prevented at the DB level by an EXCLUDE USING gist
 * constraint (see migration 0001) — application checks are only for
 * friendlier errors.
 */
export const appointment = pgTable(
  'appointment',
  {
    ...baseColumns,
    salonId: uuid('salon_id').notNull().references(() => salon.id),
    groomerId: uuid('groomer_id').notNull().references(() => groomer.id),
    clientId: uuid('client_id').notNull().references(() => client.id),
    petId: uuid('pet_id').notNull().references(() => pet.id),
    serviceId: uuid('service_id').notNull().references(() => service.id),
    startAt: timestamp('start_at', { withTimezone: true }).notNull(),
    endAt: timestamp('end_at', { withTimezone: true }).notNull(),
    serviceStartAt: timestamp('service_start_at', { withTimezone: true }).notNull(),
    serviceEndAt: timestamp('service_end_at', { withTimezone: true }).notNull(),
    status: appointmentStatusEnum('status').notNull().default('booked'),
    source: appointmentSourceEnum('source').notNull().default('staff'),
    // Copied from service at booking. Prices change; history must not.
    priceCentsSnapshot: integer('price_cents_snapshot').notNull(),
    noShowRiskScore: integer('no_show_risk_score'),
    noShowRiskReasons: jsonb('no_show_risk_reasons'),
    notes: text('notes'),
    checkedInAt: timestamp('checked_in_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    cancellationReason: text('cancellation_reason'),
  },
  (t) => [
    index('appointment_salon_idx').on(t.salonId),
    index('appointment_groomer_time_idx').on(t.groomerId, t.startAt),
    index('appointment_client_idx').on(t.clientId),
  ],
);

export const groomerSpecialty = pgTable(
  'groomer_specialty',
  {
    ...baseColumns,
    salonId: uuid('salon_id').notNull().references(() => salon.id),
    groomerId: uuid('groomer_id').notNull().references(() => groomer.id),
    tagType: specialtyTagTypeEnum('tag_type').notNull(),
    tagValue: text('tag_value').notNull(),
    proficiency: integer('proficiency').notNull().default(3), // 1-5
  },
  (t) => [index('groomer_specialty_salon_idx').on(t.salonId)],
);
