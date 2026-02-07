
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
      // Refresh data on navigation
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

    return <Home articles={articles} onArticleClick={(slug) => navigate(`/article/${slug}`)} />;
  };

  const isAdmin = currentPath === '/admin';

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Navbar onNavigate={navigate} siteConfig={siteConfig} />}
      
      <main className="flex-grow">
        {renderView()}
      </main>

      {!isAdmin && (
        <div className="fixed bottom-0 left-0 w-full z-40 md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200">
           <AdUnit type="sticky-bottom" className="m-0 border-0" />
        </div>
      )}

      {!isAdmin && <Footer onNavigate={navigate} siteConfig={siteConfig} />}
    </div>
  );
};

export default App;
