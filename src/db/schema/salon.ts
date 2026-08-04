import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { baseColumns } from './_shared';
import { smsStatusEnum } from './enums';

export const salon = pgTable('salon', {
  ...baseColumns,
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  timezone: text('timezone').notNull(), // IANA, e.g. 'America/New_York'
  addressLine1: text('address_line1'),
  addressLine2: text('address_line2'),
  city: text('city'),
  region: text('region'),
  postalCode: text('postal_code'),
  country: text('country').notNull().default('US'),
  phone: text('phone'),
  email: text('email'),
  smsNumberE164: text('sms_number_e164'),
  smsStatus: smsStatusEnum('sms_status').notNull().default('pending'),
  stripeAccountId: text('stripe_account_id'),
  onboardingCompletedAt: timestamp('onboarding_completed_at', { withTimezone: true }),
});
