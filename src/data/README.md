# src/data

The ONLY place raw db access happens. Every exported function takes `salonId`
as its first argument and filters on it. A tenant leak is the worst bug this
app can ship.

Ownership (CONTRACT §1): `appointments.ts` and `availability.ts` are Track A;
everything else is Track B.
