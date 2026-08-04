import { pgTable, text, uuid, boolean, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { baseColumns } from './_shared';
import { membershipRoleEnum, membershipStatusEnum } from './enums';
import { salon } from './salon';

/** Auth identity — mirrors Supabase auth.users. Who logs in. */
export const appUser = pgTable('app_user', {
  ...baseColumns,
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  phone: text('phone'),
});

/** Links a user to a salon with a role. */
export const membership = pgTable(
  'membership',
  {
    ...baseColumns,
    salonId: uuid('salon_id').notNull().references(() => salon.id),
    userId: uuid('user_id').notNull().references(() => appUser.id),
    role: membershipRoleEnum('role').notNull(),
    status: membershipStatusEnum('status').notNull().default('invited'),
  },
  (t) => [
    uniqueIndex('membership_salon_user_uq').on(t.salonId, t.userId),
    index('membership_salon_idx').on(t.salonId),
  ],
);

/** Staff record — who grooms. May exist before a login does. */
export const groomer = pgTable(
  'groomer',
  {
    ...baseColumns,
    salonId: uuid('salon_id').notNull().references(() => salon.id),
    userId: uuid('user_id').references(() => appUser.id),
    displayName: text('display_name').notNull(),
    bio: text('bio'),
    colorHex: text('color_hex').notNull().default('#6366f1'),
    active: boolean('active').notNull().default(true),
  },
  (t) => [index('groomer_salon_idx').on(t.salonId)],
);
