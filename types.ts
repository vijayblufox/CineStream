
export enum Category {
  OTT = 'OTT Releases',
  MOVIE = 'Movie Releases',
  NEWS = 'Cinema News'
}

export enum Platform {
  NETFLIX = 'Netflix',
  PRIME = 'Amazon Prime Video',
  HOTSTAR = 'Disney+ Hotstar',
  ZEE5 = 'ZEE5',
  SONYLIV = 'SonyLIV',
  JIOHOTSTAR = 'JioHotstar',
  AHA = 'Aha',
  THEATRICAL = 'Theatrical'
}

export interface MovieListItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  platform?: Platform;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  platform?: Platform;
  releaseDate: string;
  language: string[];
  genre: string[];
  cast: string[];
  director: string;
  imageUrl: string;
  isFeatured?: boolean;
  publishedAt: string;
  faqs?: { q: string, a: string }[];
  trailerUrl?: string;
  rating?: string;
  movieList?: MovieListItem[];
}

export interface SiteConfig {
  siteName: string;
  description: string;
  footerText: string;
  whatsappLink: string;
  telegramLink: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };
}

export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}
