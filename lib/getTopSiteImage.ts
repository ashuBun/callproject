import camSites from "@/data/sites.json";

interface Site {
  id: string;
  slug: string;
  title: string;
  categories: string[];
  hero: string;
  logo: string;
  performers?: string;
  rating: number;
}

/**
 * Get the hero image URL of the top-ranked site for a given category
 * Uses the same sorting logic as CamGrid component
 */
export function getTopSiteImageByCategory(category: string): string | null {
  const getPerformersCount = (performers: string | undefined): number => {
    if (!performers) return 0;
    const numStr = performers.replace(/[,+\s]/g, "");
    const num = parseInt(numStr, 10);
    return isNaN(num) ? 0 : num;
  };

  const sites = camSites as Site[];

  const filteredSites = sites
    .map((site, originalIndex) => ({ site, originalIndex }))
    .filter(({ site }) => site.categories?.includes(category))
    .sort((a, b) => {
      const aRating = a.site.rating || 0;
      const bRating = b.site.rating || 0;

      if (aRating === bRating) {
        const aPerformers = getPerformersCount(a.site.performers);
        const bPerformers = getPerformersCount(b.site.performers);

        if (aPerformers === bPerformers) {
          return a.originalIndex - b.originalIndex;
        }

        return bPerformers - aPerformers;
      }

      if (aRating === 5) return -1;
      if (bRating === 5) return 1;

      return bRating - aRating;
    })
    .map(({ site }) => site);

  if (filteredSites.length === 0) {
    return null;
  }

  const topSite = filteredSites[0];
  return topSite.hero || null;
}

/**
 * Get the full image URL for og:image
 */
export function getTopSiteImageUrl(category: string, baseUrl?: string): string {
  const BASE_URL = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "https://x-chats.com";
  
  const heroPath = getTopSiteImageByCategory(category);
  
  if (!heroPath) {
    // Fallback to default og-image
    return `${BASE_URL}/images/og-image.jpg`;
  }

  // If hero path is already a full URL, return it
  if (heroPath.startsWith("http")) {
    return heroPath;
  }

  // Construct full URL using BASE_URL (https://x-chats.com)
  const formatted = heroPath.startsWith("/") ? heroPath : `/${heroPath}`;
  return `${BASE_URL}${formatted}`;
}

