import { pgTable, text, integer, boolean, uuid, timestamp, index } from 'drizzle-orm/pg-core';
import { baseColumns } from './_shared';
import { salon } from './salon';
import { groomer } from './identity';

export const service = pgTable(
  'service',
  {
    ...baseColumns,
    salonId: uuid('salon_id').notNull().references(() => salon.id),
    name: text('name').notNull(),
    description: text('description'),
    durationMin: integer('duration_min').notNull(),
    bufferBeforeMin: integer('buffer_before_min').notNull().default(0),
    bufferAfterMin: integer('buffer_after_min').notNull().default(0),
    priceCents: integer('price_cents').notNull(),
    active: boolean('active').notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('service_salon_idx').on(t.salonId)],
);

/**
 * Recurring weekly availability, stored in SALON-LOCAL minutes from midnight —
 * not UTC. A 9am shift stays 9am across DST. The scheduling engine resolves
 * to UTC per-day using salon.timezone. Deliberate; do not "fix".
 */
export const workingHours = pgTable(
  'working_hours',
  {
    ...baseColumns,
    salonId: uuid('salon_id').notNull().references(() => salon.id),
    groomerId: uuid('groomer_id').notNull().references(() => groomer.id),
    weekday: integer('weekday').notNull(), // 0=Sun .. 6=Sat
    startMinute: integer('start_minute').notNull(),
    endMinute: integer('end_minute').notNull(),
  },
  (t) => [index('working_hours_salon_idx').on(t.salonId)],
);

/** One-off blocks; overrides working_hours. UTC. */
export const timeOff = pgTable(
  'time_off',
  {
    ...baseColumns,
    salonId: uuid('salon_id').notNull().references(() => salon.id),
    groomerId: uuid('groomer_id').notNull().references(() => groomer.id),
    startAt: timestamp('start_at', { withTimezone: true }).notNull(),
    endAt: timestamp('end_at', { withTimezone: true }).notNull(),
    reason: text('reason'),
  },
  (t) => [index('time_off_salon_idx').on(t.salonId)],
);
