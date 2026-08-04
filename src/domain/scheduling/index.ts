// Track A (A1). Pure — no I/O, no Date.now(), no framework or vendor imports.

export type Interval = { startAt: Date; endAt: Date };

export type WorkingHoursRule = {
  weekday: number; // 0=Sun .. 6=Sat
  startMinute: number; // salon-local minutes from midnight
  endMinute: number;
};

export type AvailabilityInput = {
  timezone: string; // IANA, from salon.timezone
  dateRange: Interval; // UTC window to solve within
  serviceDurationMin: number;
  bufferBeforeMin: number;
  bufferAfterMin: number;
  workingHours: WorkingHoursRule[];
  timeOff: Interval[];
  existingAppointments: Interval[]; // buffer-inclusive ranges
  slotGranularityMin: number; // default 15
  minimumNoticeMin: number; // default 0
};

export type Slot = {
  serviceStartAt: Date;
  serviceEndAt: Date;
  startAt: Date; // buffer-inclusive
  endAt: Date;
};

export function computeAvailability(_input: AvailabilityInput): Slot[] {
  throw new Error('not implemented — A1');
}

export function hasConflict(_candidate: Interval, _existing: Interval[]): boolean {
  throw new Error('not implemented — A1');
}
