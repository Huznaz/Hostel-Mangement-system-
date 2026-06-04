import type { Room } from '@/data/hostelData';
import { resolveRoomImages } from '@/utils/roomImages';

export interface DbRoomRow {
  id: number;
  name: string;
  description: string | null;
  price: number;
  images: string[] | null;
  capacity: number | null;
  size: number | null;
  breakfast: boolean | null;
  pets: boolean | null;
  featured: boolean | null;
  type: string | null;
  block: string | null;
  amenities: string[] | null;
}

export function mapDbRoomToRoom(row: DbRoomRow): Room {
  const images = resolveRoomImages(row.images, row.id, row.name);
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    price: Number(row.price),
    images,
    capacity: row.capacity ?? 1,
    size: row.size ?? 0,
    breakfast: row.breakfast ?? false,
    pets: row.pets ?? false,
    featured: row.featured ?? false,
    type: row.type ?? 'Dormitory',
    block: row.block ?? undefined,
    amenities: row.amenities ?? [],
  };
}
