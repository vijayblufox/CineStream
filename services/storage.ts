
import { Article, Category, SiteConfig } from '../types';
import { MOCK_ARTICLES, SITE_NAME } from '../constants';

const ARTICLES_KEY = 'cinestream_articles';
const CONFIG_KEY = 'cinestream_config';

export const getArticles = (): Article[] => {
  const stored = localStorage.getItem(ARTICLES_KEY);
  if (!stored) {
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(MOCK_ARTICLES));
    return MOCK_ARTICLES;
  }
  return JSON.parse(stored);
};

export const saveArticle = (article: Article) => {
  const articles = getArticles();
  const index = articles.findIndex(a => a.id === article.id);
  if (index > -1) {
    articles[index] = article;
  } else {
    articles.unshift(article);
  }
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
};

export const deleteArticle = (id: string) => {
  const articles = getArticles().filter(a => a.id !== id);
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
};

export const getSiteConfig = (): SiteConfig => {
  const stored = localStorage.getItem(CONFIG_KEY);
  if (!stored) {
    const defaultConfig: SiteConfig = {
      siteName: SITE_NAME,
      description: "A high-performance, SEO-optimized blog platform dedicated to Indian cinema, OTT releases, and entertainment news.",
      footerText: "India's leading destination for movie news, OTT release dates, and entertainment updates.",
      whatsappLink: "#",
      telegramLink: "#",
      socialLinks: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        youtube: "#"
      }
    };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(defaultConfig));
    return defaultConfig;
  }
  return JSON.parse(stored);
};

export const saveSiteConfig = (config: SiteConfig) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

export const updateSEOMeta = (title: string, description: string) => {
  const config = getSiteConfig();
  document.title = `${title} | ${config.siteName}`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  } else {
    const meta = document.createElement('meta');
    meta.name = "description";
    meta.content = description;
    document.getElementsByTagName('head')[0].appendChild(meta);
  }
};
