-- Custom SQL migration file, put your code below! ---- Runs AFTER the generated 0000 initial migration.
-- Extensions, the overlap guarantee, and RLS.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- The overlap guarantee. If application logic is ever wrong, Postgres refuses.
-- Cancelled/no-show appointments free their slot via the WHERE clause.
ALTER TABLE appointment ADD CONSTRAINT appointment_no_overlap
  EXCLUDE USING gist (
    groomer_id WITH =,
    tstzrange(start_at, end_at) WITH &&
  ) WHERE (status NOT IN ('cancelled', 'no_show'));

-- Deferred FKs that would have been cyclic in the schema files.
ALTER TABLE pet_note
  ADD CONSTRAINT pet_note_appointment_fk
  FOREIGN KEY (appointment_id) REFERENCES appointment(id);
ALTER TABLE pet_photo
  ADD CONSTRAINT pet_photo_appointment_fk
  FOREIGN KEY (appointment_id) REFERENCES appointment(id);

-- Row-level security: every tenant-scoped table is scoped by salon_id.
-- App connects via the service role; RLS is defense-in-depth for the
-- anon/authenticated roles used by Supabase client SDK access.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'membership','groomer','service','working_hours','time_off',
    'client','pet','vaccination','pet_note','pet_photo',
    'appointment','groomer_specialty','notification','inbound_message','payment'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format($f$
      CREATE POLICY %I_tenant_isolation ON %I
        USING (salon_id IN (
          SELECT m.salon_id FROM membership m
          WHERE m.user_id = auth.uid() AND m.status = 'active'
        ))
    $f$, t, t);
  END LOOP;
END $$;

ALTER TABLE salon ENABLE ROW LEVEL SECURITY;
CREATE POLICY salon_tenant_isolation ON salon
  USING (id IN (
    SELECT m.salon_id FROM membership m
    WHERE m.user_id = auth.uid() AND m.status = 'active'
  ));

ALTER TABLE app_user ENABLE ROW LEVEL SECURITY;
CREATE POLICY app_user_self ON app_user USING (id = auth.uid());
