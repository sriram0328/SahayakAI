/**
 * Educational Image Retrieval & Fallback Library
 * Fetches high-quality, verified educational diagrams and textbook illustrations
 * from open public repositories (Wikimedia Commons / Wikipedia) before falling
 * back to AI generation.
 */

export interface EducationalWebImage {
  title: string;
  url: string;
  originalUrl?: string;
  source: string;
  width?: number;
  height?: number;
}

export interface EducationalVisualResult {
  mediaUrl: string;
  title: string;
  source: 'web' | 'ai';
  sourceLabel: string;
  webImages?: EducationalWebImage[];
  enrichedPrompt?: string;
  error?: string;
}

const VALID_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.svg', '.webp'];

/**
 * Searches open educational repositories (Wikimedia Commons and Wikipedia)
 * for peer-reviewed, labeled diagrams and high-resolution educational images.
 */
export async function searchEducationalWebImages(
  query: string,
  limit = 8
): Promise<EducationalWebImage[]> {
  const cleanQuery = query.replace(/[^\w\s-]/gi, ' ').trim();
  if (!cleanQuery) return [];

  const results: EducationalWebImage[] = [];
  const seenUrls = new Set<string>();

  // Strategy 1: Search Wikimedia Commons specifically for educational diagrams
  try {
    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      cleanQuery + ' diagram'
    )}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1200&format=json&origin=*`;

    const res = await fetch(commonsUrl, {
      headers: { 'User-Agent': 'SahayakAI-CoTeacher/1.0 (educational app)' },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      const pages = data.query?.pages ? Object.values(data.query.pages) : [];

      for (const p of pages as any[]) {
        const info = p.imageinfo?.[0];
        if (!info) continue;

        const ext = '.' + (info.url.split('.').pop() || '').toLowerCase();
        if (
          !VALID_IMAGE_EXTENSIONS.includes(ext) &&
          !info.mime?.startsWith('image/')
        ) {
          continue;
        }

        const thumbUrl = info.thumburl || info.url;
        if (!thumbUrl || seenUrls.has(thumbUrl)) continue;

        const title = p.title
          .replace(/^File:/i, '')
          .replace(/\.[^/.]+$/, '')
          .replace(/_/g, ' ')
          .trim();

        seenUrls.add(thumbUrl);
        results.push({
          title,
          url: thumbUrl,
          originalUrl: info.url,
          width: info.width,
          height: info.height,
          source: 'Wikimedia Commons Open Educational Archive',
        });
      }
    }
  } catch (err) {
    console.error('Error fetching educational diagrams from Commons:', err);
  }

  // Strategy 2: If we have fewer than 3 results, search general Wikimedia Commons without 'diagram' suffix
  if (results.length < 3) {
    try {
      const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        cleanQuery
      )}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1200&format=json&origin=*`;

      const res = await fetch(commonsUrl, {
        headers: { 'User-Agent': 'SahayakAI-CoTeacher/1.0 (educational app)' },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        const pages = data.query?.pages ? Object.values(data.query.pages) : [];

        for (const p of pages as any[]) {
          const info = p.imageinfo?.[0];
          if (!info) continue;

          const ext = '.' + (info.url.split('.').pop() || '').toLowerCase();
          if (
            !VALID_IMAGE_EXTENSIONS.includes(ext) &&
            !info.mime?.startsWith('image/')
          ) {
            continue;
          }

          const thumbUrl = info.thumburl || info.url;
          if (!thumbUrl || seenUrls.has(thumbUrl)) continue;

          const title = p.title
            .replace(/^File:/i, '')
            .replace(/\.[^/.]+$/, '')
            .replace(/_/g, ' ')
            .trim();

          seenUrls.add(thumbUrl);
          results.push({
            title,
            url: thumbUrl,
            originalUrl: info.url,
            width: info.width,
            height: info.height,
            source: 'Wikimedia Commons Open Educational Archive',
          });
        }
      }
    } catch (err) {
      console.error('Error fetching general images from Commons:', err);
    }
  }

  // Strategy 3: Wikipedia encyclopedia article lead thumbnail
  if (results.length === 0) {
    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        cleanQuery
      )}&gsrlimit=3&prop=pageimages|extracts&pithumbsize=1200&format=json&origin=*&exintro=1&explaintext=1`;

      const res = await fetch(wikiUrl, {
        headers: { 'User-Agent': 'SahayakAI-CoTeacher/1.0 (educational app)' },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        const pages = data.query?.pages ? Object.values(data.query.pages) : [];

        for (const wp of pages as any[]) {
          if (wp.thumbnail?.source && !seenUrls.has(wp.thumbnail.source)) {
            seenUrls.add(wp.thumbnail.source);
            results.push({
              title: wp.title,
              url: wp.thumbnail.source,
              originalUrl: wp.thumbnail.source,
              width: wp.thumbnail.width,
              height: wp.thumbnail.height,
              source: 'Wikipedia Encyclopedia Lead Image',
            });
          }
        }
      }
    } catch (err) {
      console.error('Error fetching Wikipedia lead image:', err);
    }
  }

  return results;
}
