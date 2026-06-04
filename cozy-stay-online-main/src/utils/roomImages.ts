import { rooms as catalogRooms } from "@/data/hostelData";
import {
  FALLBACK_ROOM_IMAGE,
  roomImageUrl,
  buildUnsplashUrl,
} from "@/utils/unsplash";

export { FALLBACK_ROOM_IMAGE, roomImageUrl };

/** Unsplash IDs that 404 or load unreliably — replace with catalog images. */
const BROKEN_UNSPLASH_IDS = [
  "photo-1566665797739-1674de7a421a",
  "photo-1590490360182-c33d57733427",
  "photo-1595576508985-7d6d6e0d7f8f",
];

export function unsplashPhoto(photoId: string, width = 800): string {
  return buildUnsplashUrl(photoId, width);
}

/** Parse Postgres `text[]`, JSON strings, or plain URL strings from Supabase. */
export function parseRoomImages(images: unknown): string[] {
  if (images == null) return [];

  if (Array.isArray(images)) {
    return images.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof images === "string") {
    const trimmed = images.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).trim()).filter(Boolean);
        }
      } catch {
        /* fall through */
      }
    }
    return [trimmed];
  }

  return [];
}

export function isLegacyOrBrokenImageUrl(url: string): boolean {
  const u = url.trim().toLowerCase();
  if (!u) return true;
  if (u.startsWith("/") || u.includes("lovable.dev") || u.includes("placeholder")) {
    return true;
  }
  if (!u.startsWith("http://") && !u.startsWith("https://")) return true;
  return BROKEN_UNSPLASH_IDS.some((id) => u.includes(id));
}

/**
 * Resolve display images: prefer valid DB URLs, otherwise match catalog by id/name.
 */
export function resolveRoomImages(
  dbImages: unknown,
  roomId?: number,
  roomName?: string,
): string[] {
  const parsed = parseRoomImages(dbImages);
  const catalog =
    catalogRooms.find((r) => r.id === roomId) ??
    catalogRooms.find((r) => r.name === roomName);

  const usableDb = parsed.filter((u) => !isLegacyOrBrokenImageUrl(u));

  if (usableDb.length > 0) {
    return usableDb.map((u) => roomImageUrl(u));
  }

  if (catalog?.images?.length) {
    return catalog.images;
  }

  return [FALLBACK_ROOM_IMAGE];
}

export function primaryRoomImage(images: string[] | null | undefined): string {
  const first = images?.find((u) => u?.trim());
  return first ? roomImageUrl(first) : FALLBACK_ROOM_IMAGE;
}

/** True when DB images should be replaced with resolved catalog URLs. */
export function roomImagesNeedSync(
  dbImages: unknown,
  resolved: string[],
): boolean {
  const parsed = parseRoomImages(dbImages);
  const usableDb = parsed.filter((u) => !isLegacyOrBrokenImageUrl(u));
  if (usableDb.length === 0 && resolved.length > 0) return true;
  if (usableDb.length > 0) {
    const dbNormalized = usableDb.map((u) => roomImageUrl(u)).sort().join("|");
    const resolvedNormalized = [...resolved].sort().join("|");
    return dbNormalized !== resolvedNormalized;
  }
  return false;
}
