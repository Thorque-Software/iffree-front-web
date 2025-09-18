import { useEffect, useState } from "react";
import { MediaService } from "@/types/domain";
import { apiFetch } from "@/lib/fetcher";

type UnsignedMedia = { id: number; path: string };
type SignedMedia = { id: number; url: string };

export function useSignedMedia(mediaService: MediaService[]) {
  const [urls, setUrls] = useState<SignedMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mediaService || mediaService.length === 0) {
      setUrls([]);
      setLoading(false);
      return;
    }

    async function fetchSignedUrls() {
      try {
        const medias = mediaService.map((m) => ({ id: m.mediaId , path: m.media.path })) as UnsignedMedia[];

        const res = await apiFetch<{mediaSign: SignedMedia[]}>('/medias', {
            method: 'POST',
            body: JSON.stringify({ medias }),
          })

        if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to fetch media');
        }

        setUrls(res.data.mediaSign);
        console.log("Fetched signed urls:", res.data);
      } catch (err) {
        console.error("Error fetching signed urls:", err);
        setUrls([]);
      } finally {
        setLoading(false);
        console.log("Finished fetching signed urls");
      }
    }

    fetchSignedUrls();
  }, [mediaService]);

  return { urls, loading };
}

