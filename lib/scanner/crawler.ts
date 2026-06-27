/**
 * Crawls additional pages from a given URL for multi-page scanning.
 * Uses a simple BFS approach limited to same-domain links.
 */

export async function discoverPages(
  baseUrl: string,
  page: any,
  maxPages: number
): Promise<string[]> {
  const discovered = new Set<string>();
  const base = new URL(baseUrl);

  try {
    const links = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'));
      return anchors
        .map((a) => a.href)
        .filter((href) => href.startsWith('http'));
    });

    for (const link of links) {
      if (discovered.size >= maxPages) break;

      try {
        const url = new URL(link);
        // Only same-domain, no anchors, no file downloads
        if (
          url.hostname === base.hostname &&
          !url.hash &&
          !url.pathname.match(/\.(pdf|zip|doc|docx|ppt|pptx|xls|xlsx|jpg|png|gif|mp4|mp3)$/i)
        ) {
          // Remove trailing slash for consistency
          const normalized = url.origin + url.pathname.replace(/\/$/, '');
          if (normalized !== baseUrl) {
            discovered.add(normalized);
          }
        }
      } catch {
        // Invalid URL, skip
      }
    }
  } catch {
    // If link extraction fails, return whatever we have
  }

  return Array.from(discovered).slice(0, maxPages);
}
