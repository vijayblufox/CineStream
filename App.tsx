
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import Home from './views/Home.tsx';
import ArticleDetail from './views/ArticleDetail.tsx';
import AdminPanel from './views/Admin.tsx';
import AdUnit from './components/AdUnit.tsx';
import { getArticles, getSiteConfig } from './services/storage.ts';
import { Article, SiteConfig } from './types.ts';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash.replace('#', '') || '/');
  const [articles, setArticles] = useState<Article[]>(getArticles());
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(getSiteConfig());

  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash.replace('#', '') || '/';
      setCurrentPath(path);
      setArticles(getArticles());
      setSiteConfig(getSiteConfig());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const renderView = () => {
    if (currentPath === '/admin') {
      return <AdminPanel />;
    }

    if (currentPath.startsWith('/article/')) {
      const slug = currentPath.replace('/article/', '');
      const article = articles.find(a => a.slug === slug);
      if (article) return <ArticleDetail article={article} onNavigate={navigate} />;
    }

    // Filter articles based on path if it's a category page
    let filteredArticles = articles;
    if (currentPath.startsWith('/category/')) {
       const catSlug = currentPath.replace('/category/', '');
       filteredArticles = articles.filter(a => a.category.toLowerCase().replace(/\s+/g, '-') === catSlug);
    }

    return <Home articles={filteredArticles} onArticleClick={(slug) => navigate(`/article/${slug}`)} />;
  };

  const isAdmin = currentPath === '/admin';

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Navbar onNavigate={navigate} siteConfig={siteConfig} />}
      
      <main className="flex-grow">
        {renderView()}
      </main>

      {!isAdmin && <Footer onNavigate={navigate} siteConfig={siteConfig} />}
    </div>
  );
};

export default App;
