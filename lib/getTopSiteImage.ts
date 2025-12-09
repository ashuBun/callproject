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
 * Get the top-ranked site from all sites (no category filter)
 */
function getTopSiteOverall(): Site | null {
  const getPerformersCount = (performers: string | undefined): number => {
    if (!performers) return 0;
    const numStr = performers.replace(/[,+\s]/g, "");
    const num = parseInt(numStr, 10);
    return isNaN(num) ? 0 : num;
  };

  const sites = camSites as Site[];

  const sortedSites = sites
    .map((site, originalIndex) => ({ site, originalIndex }))
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

  return sortedSites.length > 0 ? sortedSites[0] : null;
}

/**
 * Get the full image URL for og:image
 */
export function getTopSiteImageUrl(category: string, baseUrl?: string): string {
  const IMAGE_URL = baseUrl || process.env.NEXT_PUBLIC_IMG_URL || process.env.NEXT_PUBLIC_IMAGE_URL || process.env.NEXT_PUBLIC_BASE_URL || "";
  
  let heroPath = getTopSiteImageByCategory(category);
  
  // If no hero path found for category, try to get top site from all sites
  if (!heroPath) {
    const topSiteOverall = getTopSiteOverall();
    heroPath = topSiteOverall?.hero || null;
  }
  
  // If still no hero path, return empty string (no fallback to hardcoded image)
  if (!heroPath) {
    return "";
  }

  // If hero path is already a full URL, return it
  if (heroPath.startsWith("http")) {
    return heroPath;
  }

  // Construct full URL using IMAGE_URL
  const formatted = heroPath.startsWith("/") ? heroPath : `/${heroPath}`;
  return `${IMAGE_URL}${formatted}`;
}

