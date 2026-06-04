import type { Room } from '@/data/hostelData';

export interface OrderAvailability {
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  status: string;
}

export interface HostelSettingsMap {
  min_advance_days?: string;
  max_advance_days?: string;
  auto_allocate?: string;
}

export function datesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string,
): boolean {
  return startA <= endB && startB <= endA;
}

export function isRoomAvailable(
  roomId: number,
  checkIn: string,
  checkOut: string,
  orders: OrderAvailability[],
): boolean {
  return !orders.some(
    (o) =>
      o.room_id === roomId &&
      ['pending', 'confirmed'].includes(o.status) &&
      datesOverlap(checkIn, checkOut, o.check_in_date, o.check_out_date),
  );
}

export function validateApplicationDates(
  checkIn: string,
  checkOut: string,
  settings: HostelSettingsMap,
): string | null {
  if (checkOut <= checkIn) {
    return 'Move-out date must be after move-in date.';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inDate = new Date(checkIn + 'T00:00:00');
  const outDate = new Date(checkOut + 'T00:00:00');

  const minAdvance = parseInt(settings.min_advance_days ?? '7', 10);
  const maxAdvance = parseInt(settings.max_advance_days ?? '365', 10);

  const daysUntil = Math.ceil((inDate.getTime() - today.getTime()) / 86400000);
  if (daysUntil < minAdvance) {
    return `Applications must be submitted at least ${minAdvance} day(s) before move-in.`;
  }
  if (daysUntil > maxAdvance) {
    return `Move-in cannot be more than ${maxAdvance} days in advance.`;
  }

  const stayDays = Math.ceil((outDate.getTime() - inDate.getTime()) / 86400000);
  if (stayDays < 1) {
    return 'Stay must be at least one day.';
  }

  return null;
}

/** Prefer same block, then same type, then any available room. */
export function findAlternativeRoom(
  preferred: Room,
  allRooms: Room[],
  orders: OrderAvailability[],
  checkIn: string,
  checkOut: string,
): Room | null {
  const available = allRooms.filter((r) =>
    isRoomAvailable(r.id, checkIn, checkOut, orders),
  );
  if (available.length === 0) return null;

  const sameBlock = available.find(
    (r) => r.block && r.block === preferred.block && r.id !== preferred.id,
  );
  if (sameBlock) return sameBlock;

  const sameType = available.find(
    (r) => r.type === preferred.type && r.id !== preferred.id,
  );
  if (sameType) return sameType;

  return available.find((r) => r.id !== preferred.id) ?? available[0];
}

export interface ResolvedAllocation {
  room: Room;
  status: 'pending' | 'confirmed';
  autoAssigned: boolean;
}

export function resolveAllocation(
  preferred: Room,
  allRooms: Room[],
  orders: OrderAvailability[],
  checkIn: string,
  checkOut: string,
  autoAllocate: boolean,
): ResolvedAllocation | { error: string } {
  if (isRoomAvailable(preferred.id, checkIn, checkOut, orders)) {
    return {
      room: preferred,
      status: autoAllocate ? 'confirmed' : 'pending',
      autoAssigned: false,
    };
  }

  if (!autoAllocate) {
    return {
      error:
        'This room is not available for the selected dates. Try different dates or another room.',
    };
  }

  const alt = findAlternativeRoom(preferred, allRooms, orders, checkIn, checkOut);
  if (!alt) {
    return {
      error: 'No rooms are available for the selected dates. Please try different dates.',
    };
  }

  return {
    room: alt,
    status: 'confirmed',
    autoAssigned: true,
  };
}
