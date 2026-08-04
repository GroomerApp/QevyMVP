import {
  pgTable, text, uuid, boolean, integer, numeric, date, timestamp, index,
} from 'drizzle-orm/pg-core';
import { baseColumns } from './_shared';
import { salon } from './salon';
import { appUser } from './identity';
import { petSizeEnum, preferredChannelEnum, noteSourceEnum, transcriptStatusEnum, photoKindEnum } from './enums';

export const client = pgTable(
  'client',
  {
    ...baseColumns,
    salonId: uuid('salon_id').notNull().references(() => salon.id),
    firstName: text('first_name').notNull(),
    lastName: text('last_name'),
    phoneE164: text('phone_e164'),
    email: text('email'),
    notes: text('notes'),
    smsConsentAt: timestamp('sms_consent_at', { withTimezone: true }),
    smsOptOutAt: timestamp('sms_opt_out_at', { withTimezone: true }),
    preferredChannel: preferredChannelEnum('preferred_channel').notNull().default('sms'),
  },
  (t) => [
    index('client_salon_idx').on(t.salonId),
    index('client_phone_idx').on(t.salonId, t.phoneE164),
  ],
);

export const pet = pgTable(
  'pet',
  {
    ...baseColumns,
    salonId: uuid('salon_id').notNull().references(() => salon.id),
    clientId: uuid('client_id').notNull().references(() => client.id),
    name: text('name').notNull(),
    species: text('species').notNull().default('dog'),
    breed: text('breed'),
    coatType: text('coat_type'),
    size: petSizeEnum('size'),
    weightLbs: numeric('weight_lbs'),
    birthdate: date('birthdate'),
    // Safety field: bites, anxious, senior, muzzle_required, reactive.
    // Surface prominently — groomers care about this more than breed.
    behaviorFlags: text('behavior_flags').array().notNull().default([]),
    vetName: text('vet_name'),
    vetPhone: text('vet_phone'),
    active: boolean('active').notNull().default(true),
  },
  (t) => [index('pet_salon_idx').on(t.salonId), index('pet_client_idx').on(t.clientId)],
);

export const vaccination = pgTable(
  'vaccination',
  {
    ...baseColumns,
    salonId: uuid('salon_id').notNull().references(() => salon.id),
    petId: uuid('pet_id').notNull().references(() => pet.id),
    type: text('type').notNull(), // 'rabies', 'dhpp', 'bordetella', ...
    administeredOn: date('administered_on').notNull(),
    expiresOn: date('expires_on'),
    documentStorageKey: text('document_storage_key'),
  },
  (t) => [index('vaccination_salon_idx').on(t.salonId), index('vaccination_pet_idx').on(t.petId)],
);

/** Append-only. Edits set edited_at; history is never destroyed. */
export const petNote = pgTable(
  'pet_note',
  {
    ...baseColumns,
    salonId: uuid('salon_id').notNull().references(() => salon.id),
    petId: uuid('pet_id').notNull().references(() => pet.id),
    appointmentId: uuid('appointment_id'), // FK added in appointment schema to avoid cycle
    authorUserId: uuid('author_user_id').references(() => appUser.id),
    body: text('body').notNull().default(''),
    source: noteSourceEnum('source').notNull().default('manual'),
    audioStorageKey: text('audio_storage_key'),
    audioDurationSec: integer('audio_duration_sec'),
    transcriptStatus: transcriptStatusEnum('transcript_status').notNull().default('none'),
    transcriptConfidence: numeric('transcript_confidence'),
    editedAt: timestamp('edited_at', { withTimezone: true }),
  },
  (t) => [index('pet_note_salon_idx').on(t.salonId), index('pet_note_pet_idx').on(t.petId)],
);

export const petPhoto = pgTable(
  'pet_photo',
  {
    ...baseColumns,
    salonId: uuid('salon_id').notNull().references(() => salon.id),
    petId: uuid('pet_id').notNull().references(() => pet.id),
    appointmentId: uuid('appointment_id'),
    kind: photoKindEnum('kind').notNull().default('other'),
    storageKey: text('storage_key').notNull(),
    width: integer('width'),
    height: integer('height'),
    sentToClientAt: timestamp('sent_to_client_at', { withTimezone: true }),
  },
  (t) => [index('pet_photo_salon_idx').on(t.salonId), index('pet_photo_pet_idx').on(t.petId)],
);
