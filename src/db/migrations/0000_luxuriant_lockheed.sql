CREATE TYPE "public"."appointment_source" AS ENUM('online', 'staff');--> statement-breakpoint
CREATE TYPE "public"."appointment_status" AS ENUM('booked', 'confirmed', 'checked_in', 'completed', 'no_show', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."inbound_intent" AS ENUM('confirm', 'cancel', 'stop', 'help', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."membership_role" AS ENUM('owner', 'groomer');--> statement-breakpoint
CREATE TYPE "public"."membership_status" AS ENUM('active', 'invited', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."note_source" AS ENUM('manual', 'voice');--> statement-breakpoint
CREATE TYPE "public"."notification_channel" AS ENUM('sms', 'email');--> statement-breakpoint
CREATE TYPE "public"."notification_status" AS ENUM('queued', 'sent', 'delivered', 'failed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('booking_confirmation', 'reminder_24h', 'photo_send', 'cancellation', 'custom');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('card', 'cash', 'other');--> statement-breakpoint
CREATE TYPE "public"."payment_provider" AS ENUM('stripe', 'square', 'manual');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'succeeded', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."pet_size" AS ENUM('xs', 's', 'm', 'l', 'xl');--> statement-breakpoint
CREATE TYPE "public"."photo_kind" AS ENUM('before', 'after', 'other');--> statement-breakpoint
CREATE TYPE "public"."preferred_channel" AS ENUM('sms', 'email', 'none');--> statement-breakpoint
CREATE TYPE "public"."sms_status" AS ENUM('pending', 'active', 'failed');--> statement-breakpoint
CREATE TYPE "public"."specialty_tag_type" AS ENUM('breed', 'coat', 'size', 'temperament');--> statement-breakpoint
CREATE TYPE "public"."transcript_status" AS ENUM('none', 'pending', 'complete', 'failed');--> statement-breakpoint
CREATE TABLE "salon" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"timezone" text NOT NULL,
	"address_line1" text,
	"address_line2" text,
	"city" text,
	"region" text,
	"postal_code" text,
	"country" text DEFAULT 'US' NOT NULL,
	"phone" text,
	"email" text,
	"sms_number_e164" text,
	"sms_status" "sms_status" DEFAULT 'pending' NOT NULL,
	"stripe_account_id" text,
	"onboarding_completed_at" timestamp with time zone,
	CONSTRAINT "salon_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "app_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"avatar_url" text,
	"phone" text,
	CONSTRAINT "app_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "groomer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"salon_id" uuid NOT NULL,
	"user_id" uuid,
	"display_name" text NOT NULL,
	"bio" text,
	"color_hex" text DEFAULT '#6366f1' NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "membership" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"salon_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "membership_role" NOT NULL,
	"status" "membership_status" DEFAULT 'invited' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"salon_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"duration_min" integer NOT NULL,
	"buffer_before_min" integer DEFAULT 0 NOT NULL,
	"buffer_after_min" integer DEFAULT 0 NOT NULL,
	"price_cents" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "time_off" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"salon_id" uuid NOT NULL,
	"groomer_id" uuid NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"reason" text
);
--> statement-breakpoint
CREATE TABLE "working_hours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"salon_id" uuid NOT NULL,
	"groomer_id" uuid NOT NULL,
	"weekday" integer NOT NULL,
	"start_minute" integer NOT NULL,
	"end_minute" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"salon_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text,
	"phone_e164" text,
	"email" text,
	"notes" text,
	"sms_consent_at" timestamp with time zone,
	"sms_opt_out_at" timestamp with time zone,
	"preferred_channel" "preferred_channel" DEFAULT 'sms' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"salon_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"name" text NOT NULL,
	"species" text DEFAULT 'dog' NOT NULL,
	"breed" text,
	"coat_type" text,
	"size" "pet_size",
	"weight_lbs" numeric,
	"birthdate" date,
	"behavior_flags" text[] DEFAULT '{}' NOT NULL,
	"vet_name" text,
	"vet_phone" text,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_note" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"salon_id" uuid NOT NULL,
	"pet_id" uuid NOT NULL,
	"appointment_id" uuid,
	"author_user_id" uuid,
	"body" text DEFAULT '' NOT NULL,
	"source" "note_source" DEFAULT 'manual' NOT NULL,
	"audio_storage_key" text,
	"audio_duration_sec" integer,
	"transcript_status" "transcript_status" DEFAULT 'none' NOT NULL,
	"transcript_confidence" numeric,
	"edited_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "pet_photo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"salon_id" uuid NOT NULL,
	"pet_id" uuid NOT NULL,
	"appointment_id" uuid,
	"kind" "photo_kind" DEFAULT 'other' NOT NULL,
	"storage_key" text NOT NULL,
	"width" integer,
	"height" integer,
	"sent_to_client_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "vaccination" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"salon_id" uuid NOT NULL,
	"pet_id" uuid NOT NULL,
	"type" text NOT NULL,
	"administered_on" date NOT NULL,
	"expires_on" date,
	"document_storage_key" text
);
--> statement-breakpoint
CREATE TABLE "appointment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"salon_id" uuid NOT NULL,
	"groomer_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"pet_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"service_start_at" timestamp with time zone NOT NULL,
	"service_end_at" timestamp with time zone NOT NULL,
	"status" "appointment_status" DEFAULT 'booked' NOT NULL,
	"source" "appointment_source" DEFAULT 'staff' NOT NULL,
	"price_cents_snapshot" integer NOT NULL,
	"no_show_risk_score" integer,
	"no_show_risk_reasons" jsonb,
	"notes" text,
	"checked_in_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"cancellation_reason" text
);
--> statement-breakpoint
CREATE TABLE "groomer_specialty" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"salon_id" uuid NOT NULL,
	"groomer_id" uuid NOT NULL,
	"tag_type" "specialty_tag_type" NOT NULL,
	"tag_value" text NOT NULL,
	"proficiency" integer DEFAULT 3 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inbound_message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"salon_id" uuid NOT NULL,
	"client_id" uuid,
	"from_e164" text NOT NULL,
	"body" text NOT NULL,
	"intent" "inbound_intent" DEFAULT 'unknown' NOT NULL,
	"handled_at" timestamp with time zone,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"salon_id" uuid NOT NULL,
	"appointment_id" uuid,
	"client_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"channel" "notification_channel" NOT NULL,
	"to_address" text NOT NULL,
	"body" text NOT NULL,
	"status" "notification_status" DEFAULT 'queued' NOT NULL,
	"provider" text,
	"provider_message_id" text,
	"scheduled_for" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"failed_reason" text
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"salon_id" uuid NOT NULL,
	"appointment_id" uuid NOT NULL,
	"provider" "payment_provider" NOT NULL,
	"method" "payment_method",
	"provider_charge_id" text,
	"amount_cents" integer NOT NULL,
	"tip_cents" integer DEFAULT 0 NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"refunded_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "groomer" ADD CONSTRAINT "groomer_salon_id_salon_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salon"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groomer" ADD CONSTRAINT "groomer_user_id_app_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership" ADD CONSTRAINT "membership_salon_id_salon_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salon"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership" ADD CONSTRAINT "membership_user_id_app_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service" ADD CONSTRAINT "service_salon_id_salon_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salon"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_off" ADD CONSTRAINT "time_off_salon_id_salon_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salon"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_off" ADD CONSTRAINT "time_off_groomer_id_groomer_id_fk" FOREIGN KEY ("groomer_id") REFERENCES "public"."groomer"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "working_hours" ADD CONSTRAINT "working_hours_salon_id_salon_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salon"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "working_hours" ADD CONSTRAINT "working_hours_groomer_id_groomer_id_fk" FOREIGN KEY ("groomer_id") REFERENCES "public"."groomer"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_salon_id_salon_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salon"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet" ADD CONSTRAINT "pet_salon_id_salon_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salon"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet" ADD CONSTRAINT "pet_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_note" ADD CONSTRAINT "pet_note_salon_id_salon_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salon"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_note" ADD CONSTRAINT "pet_note_pet_id_pet_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pet"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_note" ADD CONSTRAINT "pet_note_author_user_id_app_user_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."app_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_photo" ADD CONSTRAINT "pet_photo_salon_id_salon_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salon"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_photo" ADD CONSTRAINT "pet_photo_pet_id_pet_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pet"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vaccination" ADD CONSTRAINT "vaccination_salon_id_salon_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salon"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vaccination" ADD CONSTRAINT "vaccination_pet_id_pet_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pet"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_salon_id_salon_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salon"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_groomer_id_groomer_id_fk" FOREIGN KEY ("groomer_id") REFERENCES "public"."groomer"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_pet_id_pet_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pet"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groomer_specialty" ADD CONSTRAINT "groomer_specialty_salon_id_salon_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salon"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groomer_specialty" ADD CONSTRAINT "groomer_specialty_groomer_id_groomer_id_fk" FOREIGN KEY ("groomer_id") REFERENCES "public"."groomer"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbound_message" ADD CONSTRAINT "inbound_message_salon_id_salon_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salon"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbound_message" ADD CONSTRAINT "inbound_message_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_salon_id_salon_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salon"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_appointment_id_appointment_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_salon_id_salon_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salon"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_appointment_id_appointment_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "groomer_salon_idx" ON "groomer" USING btree ("salon_id");--> statement-breakpoint
CREATE UNIQUE INDEX "membership_salon_user_uq" ON "membership" USING btree ("salon_id","user_id");--> statement-breakpoint
CREATE INDEX "membership_salon_idx" ON "membership" USING btree ("salon_id");--> statement-breakpoint
CREATE INDEX "service_salon_idx" ON "service" USING btree ("salon_id");--> statement-breakpoint
CREATE INDEX "time_off_salon_idx" ON "time_off" USING btree ("salon_id");--> statement-breakpoint
CREATE INDEX "working_hours_salon_idx" ON "working_hours" USING btree ("salon_id");--> statement-breakpoint
CREATE INDEX "client_salon_idx" ON "client" USING btree ("salon_id");--> statement-breakpoint
CREATE INDEX "client_phone_idx" ON "client" USING btree ("salon_id","phone_e164");--> statement-breakpoint
CREATE INDEX "pet_salon_idx" ON "pet" USING btree ("salon_id");--> statement-breakpoint
CREATE INDEX "pet_client_idx" ON "pet" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "pet_note_salon_idx" ON "pet_note" USING btree ("salon_id");--> statement-breakpoint
CREATE INDEX "pet_note_pet_idx" ON "pet_note" USING btree ("pet_id");--> statement-breakpoint
CREATE INDEX "pet_photo_salon_idx" ON "pet_photo" USING btree ("salon_id");--> statement-breakpoint
CREATE INDEX "pet_photo_pet_idx" ON "pet_photo" USING btree ("pet_id");--> statement-breakpoint
CREATE INDEX "vaccination_salon_idx" ON "vaccination" USING btree ("salon_id");--> statement-breakpoint
CREATE INDEX "vaccination_pet_idx" ON "vaccination" USING btree ("pet_id");--> statement-breakpoint
CREATE INDEX "appointment_salon_idx" ON "appointment" USING btree ("salon_id");--> statement-breakpoint
CREATE INDEX "appointment_groomer_time_idx" ON "appointment" USING btree ("groomer_id","start_at");--> statement-breakpoint
CREATE INDEX "appointment_client_idx" ON "appointment" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "groomer_specialty_salon_idx" ON "groomer_specialty" USING btree ("salon_id");--> statement-breakpoint
CREATE INDEX "inbound_message_salon_idx" ON "inbound_message" USING btree ("salon_id");--> statement-breakpoint
CREATE INDEX "notification_salon_idx" ON "notification" USING btree ("salon_id");--> statement-breakpoint
CREATE INDEX "notification_appointment_idx" ON "notification" USING btree ("appointment_id");--> statement-breakpoint
CREATE INDEX "payment_salon_idx" ON "payment" USING btree ("salon_id");--> statement-breakpoint
CREATE INDEX "payment_appointment_idx" ON "payment" USING btree ("appointment_id");