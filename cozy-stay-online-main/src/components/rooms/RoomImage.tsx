import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FALLBACK_ROOM_IMAGE,
  primaryRoomImage,
  roomImageUrl,
} from "@/utils/roomImages";

interface RoomImageProps {
  src?: string | null;
  images?: string[] | null;
  alt: string;
  className?: string;
  /** Card thumbnails — smaller file; detail/carousel can use 960. */
  size?: "card" | "detail";
}

const WIDTH = { card: 640, detail: 960 } as const;

export const RoomImage = ({
  src,
  images,
  alt,
  className,
  size = "card",
}: RoomImageProps) => {
  const width = WIDTH[size];

  const computeSrc = useCallback(() => {
    if (src) return roomImageUrl(src, width);
    if (images?.length) return primaryRoomImage(images);
    return FALLBACK_ROOM_IMAGE;
  }, [src, images, width]);

  const [resolvedSrc, setResolvedSrc] = useState(computeSrc);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    setResolvedSrc(computeSrc());
  }, [computeSrc]);

  const markLoaded = useCallback(() => setLoaded(true), []);

  const handleError = () => {
    if (resolvedSrc !== FALLBACK_ROOM_IMAGE) {
      setResolvedSrc(FALLBACK_ROOM_IMAGE);
      setLoaded(false);
      return;
    }
    setFailed(true);
    setLoaded(true);
  };

  const imgRef = useCallback(
    (node: HTMLImageElement | null) => {
      if (node?.complete && node.naturalWidth > 0) {
        markLoaded();
      }
    },
    [markLoaded, resolvedSrc],
  );

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-muted", className)}>
      {!loaded && !failed && (
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      )}
      {!failed && (
        <img
          key={resolvedSrc}
          ref={imgRef}
          src={resolvedSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          sizes={size === "card" ? "(max-width: 768px) 100vw, 50vw" : "100vw"}
          onLoad={markLoaded}
          onError={handleError}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      {failed && (
        <div className="flex h-full w-full items-center justify-center bg-hotel-beige/80 px-4 text-center text-sm text-muted-foreground">
          {alt}
        </div>
      )}
    </div>
  );
};

export default RoomImage;
