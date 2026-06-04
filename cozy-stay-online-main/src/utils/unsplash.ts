/** Default placeholder when a room image fails or is missing. */
export const FALLBACK_UNSPLASH_ID = "photo-1555854877-bab0e564b8d5";

export function roomImageUrl(url: string, width = 640): string {
  if (!url?.trim()) {
    return buildUnsplashUrl(FALLBACK_UNSPLASH_ID, width);
  }

  try {
    const parsed = new URL(url);
    if (parsed.hostname === "images.unsplash.com") {
      parsed.searchParams.set("w", String(width));
      parsed.searchParams.set("auto", "format");
      parsed.searchParams.set("fit", "crop");
      parsed.searchParams.set("q", "75");
      parsed.searchParams.set("fm", "webp");
      return parsed.toString();
    }
  } catch {
    /* ignore invalid URLs */
  }

  return url;
}

export function buildUnsplashUrl(photoId: string, width = 800): string {
  const id = photoId.startsWith("photo-") ? photoId : `photo-${photoId}`;
  return roomImageUrl(`https://images.unsplash.com/${id}`, width);
}

export const FALLBACK_ROOM_IMAGE = buildUnsplashUrl(FALLBACK_UNSPLASH_ID);

/** @alias buildUnsplashUrl */
export const unsplashPhoto = buildUnsplashUrl;
