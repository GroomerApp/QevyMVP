/* Seed: one salon, one owner, two groomers, four services, six clients,
 * eight pets, a fortnight of appointments. Both tracks develop against this —
 * a realistic seed is what makes bugs visible early.
 *
 * Run: npm run db:seed
 */
import { db } from './client';
import {
  salon, appUser, membership, groomer, service, workingHours,
  client, pet, vaccination, groomerSpecialty, appointment,
} from './schema';

const HOUR = 60 * 60 * 1000;

async function main() {
  const [s] = await db
    .insert(salon)
    .values({
      name: 'Pawfect Grooming',
      slug: 'pawfect',
      timezone: 'America/New_York',
      addressLine1: '123 Main St',
      city: 'Springfield',
      region: 'NJ',
      postalCode: '07081',
      phone: '+19735550100',
      email: 'hello@pawfect.example',
      smsStatus: 'pending',
    })
    .returning();

  const [owner] = await db
    .insert(appUser)
    .values({ email: 'owner@pawfect.example', fullName: 'Dana Owner' })
    .returning();
  await db.insert(membership).values({
    salonId: s.id, userId: owner.id, role: 'owner', status: 'active',
  });

  const [g1] = await db.insert(groomer).values({
    salonId: s.id, displayName: 'Maya', colorHex: '#0ea5e9',
  }).returning();
  const [g2] = await db.insert(groomer).values({
    salonId: s.id, displayName: 'Jordan', colorHex: '#f59e0b',
  }).returning();

  // Tue–Sat, 9:00–17:00 for both groomers (salon-local minutes).
  for (const g of [g1, g2]) {
    for (const weekday of [2, 3, 4, 5, 6]) {
      await db.insert(workingHours).values({
        salonId: s.id, groomerId: g.id, weekday,
        startMinute: 9 * 60, endMinute: 17 * 60,
      });
    }
  }

  const svcRows = await db.insert(service).values([
    { salonId: s.id, name: 'Full Groom', durationMin: 90, bufferAfterMin: 15, priceCents: 8500, sortOrder: 0 },
    { salonId: s.id, name: 'Bath & Brush', durationMin: 60, bufferAfterMin: 10, priceCents: 5500, sortOrder: 1 },
    { salonId: s.id, name: 'Nail Trim', durationMin: 15, priceCents: 1800, sortOrder: 2 },
    { salonId: s.id, name: 'De-shed Treatment', durationMin: 75, bufferAfterMin: 15, priceCents: 7500, sortOrder: 3 },
  ]).returning();

  await db.insert(groomerSpecialty).values([
    { salonId: s.id, groomerId: g1.id, tagType: 'breed', tagValue: 'poodle', proficiency: 5 },
    { salonId: s.id, groomerId: g1.id, tagType: 'coat', tagValue: 'curly', proficiency: 5 },
    { salonId: s.id, groomerId: g2.id, tagType: 'temperament', tagValue: 'anxious', proficiency: 4 },
    { salonId: s.id, groomerId: g2.id, tagType: 'size', tagValue: 'xl', proficiency: 4 },
  ]);

  const clientDefs = [
    { firstName: 'Alice', lastName: 'Nguyen', phoneE164: '+12015550101', consent: true },
    { firstName: 'Ben', lastName: 'Cortez', phoneE164: '+12015550102', consent: true },
    { firstName: 'Carla', lastName: 'Smith', phoneE164: '+12015550103', consent: false },
    { firstName: 'Dev', lastName: 'Patel', phoneE164: '+12015550104', consent: true },
    { firstName: 'Erin', lastName: 'Walsh', phoneE164: '+12015550105', consent: true },
    { firstName: 'Farid', lastName: 'Khan', phoneE164: '+12015550106', consent: false },
  ];
  const clients = await db.insert(client).values(
    clientDefs.map((c) => ({
      salonId: s.id,
      firstName: c.firstName,
      lastName: c.lastName,
      phoneE164: c.phoneE164,
      email: `${c.firstName.toLowerCase()}@example.com`,
      smsConsentAt: c.consent ? new Date() : null,
    })),
  ).returning();

  const petDefs: Array<[number, string, string, string, 'xs'|'s'|'m'|'l'|'xl', string[]]> = [
    [0, 'Bella', 'Poodle', 'curly', 'm', []],
    [0, 'Max', 'Labrador', 'double', 'l', ['anxious']],
    [1, 'Luna', 'Shih Tzu', 'silky', 's', []],
    [2, 'Rocky', 'German Shepherd', 'double', 'xl', ['muzzle_required']],
    [3, 'Coco', 'Goldendoodle', 'curly', 'l', []],
    [4, 'Daisy', 'Yorkie', 'silky', 'xs', ['senior']],
    [4, 'Ziggy', 'Husky', 'double', 'l', ['reactive']],
    [5, 'Milo', 'Cocker Spaniel', 'wavy', 'm', []],
  ];
  const pets = await db.insert(pet).values(
    petDefs.map(([ci, name, breed, coatType, size, behaviorFlags]) => ({
      salonId: s.id,
      clientId: clients[ci].id,
      name, breed, coatType, size, behaviorFlags,
    })),
  ).returning();

  // Rabies for every pet; one expired on purpose.
  await db.insert(vaccination).values(
    pets.map((p, i) => ({
      salonId: s.id,
      petId: p.id,
      type: 'rabies',
      administeredOn: '2025-06-01',
      expiresOn: i === 3 ? '2026-07-01' : '2027-06-01', // Rocky: expired
    })),
  );

  // A fortnight of appointments: next 14 days, Tue–Sat, a few per day.
  // Times computed as UTC instants (13:00/15:00 UTC ≈ 9am/11am ET).
  const now = new Date();
  const values = [];
  for (let d = 1; d <= 14; d++) {
    const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + d));
    const weekday = day.getUTCDay();
    if (weekday === 0 || weekday === 1) continue; // salon closed Sun/Mon
    const slots: Array<[typeof g1, number, number]> = [
      [g1, 13, d % pets.length],
      [g2, 15, (d + 3) % pets.length],
    ];
    for (const [g, hourUtc, petIdx] of slots) {
      const p = pets[petIdx];
      const svc = svcRows[d % svcRows.length];
      const serviceStart = new Date(day.getTime() + hourUtc * HOUR);
      const serviceEnd = new Date(serviceStart.getTime() + svc.durationMin * 60 * 1000);
      values.push({
        salonId: s.id,
        groomerId: g.id,
        clientId: p.clientId,
        petId: p.id,
        serviceId: svc.id,
        startAt: new Date(serviceStart.getTime() - svc.bufferBeforeMin * 60 * 1000),
        endAt: new Date(serviceEnd.getTime() + svc.bufferAfterMin * 60 * 1000),
        serviceStartAt: serviceStart,
        serviceEndAt: serviceEnd,
        status: 'booked' as const,
        source: 'staff' as const,
        priceCentsSnapshot: svc.priceCents,
      });
    }
  }
  await db.insert(appointment).values(values);

  console.log(`Seeded salon ${s.slug}: ${clients.length} clients, ${pets.length} pets, ${values.length} appointments.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
