// Looks up album art from the iTunes Search API at build time, so covers don't have to be
// saved in the repo. Results are cached per artist for the length of the build.

const ITUNES = 'https://itunes.apple.com';

type Collection = {
  wrapperType?: string;
  collectionName: string;
  artworkUrl100?: string;
  releaseDate?: string;
};

const byArtist = new Map<string, Promise<Collection[]>>();

/** Lowercase and drop "(Remastered)"-style suffixes and punctuation so titles compare loosely. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)|\[.*?\]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

function albumsFor(artist: string): Promise<Collection[]> {
  let cached = byArtist.get(artist);
  if (!cached) {
    cached = (async () => {
      try {
        const found = await getJson<{ results: { artistId: number; artistName: string }[] }>(
          `${ITUNES}/search?term=${encodeURIComponent(artist)}&entity=musicArtist&limit=5`,
        );
        const match = found.results.find((r) => norm(r.artistName) === norm(artist)) ?? found.results[0];
        if (!match) return [];
        const data = await getJson<{ results: Collection[] }>(
          `${ITUNES}/lookup?id=${match.artistId}&entity=album&limit=200`,
        );
        return data.results.filter((r) => r.wrapperType === 'collection');
      } catch (err) {
        console.warn(`[covers] could not look up "${artist}":`, err);
        return [];
      }
    })();
    byArtist.set(artist, cached);
  }
  return cached;
}

/** Cover art URL for an album, or undefined when it can't be found. */
export async function albumCover(artist: string, title: string, year?: number) {
  const albums = await albumsFor(artist);
  const wanted = norm(title);
  const matches = albums.filter((a) => a.artworkUrl100 && norm(a.collectionName) === wanted);
  // Prefer the plain edition over deluxe reissues, then the one released in the given year.
  const best =
    matches.find((a) => !/deluxe|expanded|anniversary/i.test(a.collectionName) && a.releaseDate?.startsWith(String(year))) ??
    matches.find((a) => !/deluxe|expanded|anniversary/i.test(a.collectionName)) ??
    matches[0];
  return best?.artworkUrl100?.replace('100x100bb', '600x600bb');
}
