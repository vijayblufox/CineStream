
import React, { useEffect } from 'react';
import ArticleCard from '../components/ArticleCard.tsx';
import Sidebar from '../components/Sidebar.tsx';
import AdUnit from '../components/AdUnit.tsx';
import { Article, Category } from '../types.ts';
import { updateSEOMeta } from '../services/storage.ts';

interface HomeProps {
  articles: Article[];
  onArticleClick: (slug: string) => void;
}

const Home: React.FC<HomeProps> = ({ articles, onArticleClick }) => {
  useEffect(() => {
    updateSEOMeta(
      "CineStream India | Latest OTT & Movie Releases", 
      "The #1 destination for Indian cinema and OTT updates. Get release dates for Netflix, Prime, Hotstar, and theatre releases."
    );
  }, []);

  const featured = articles.find(a => a.isFeatured) || articles[0];
  const ottArticles = articles.filter(a => a.category === Category.OTT);
  const movieArticles = articles.filter(a => a.category === Category.MOVIE);
  const newsArticles = articles.filter(a => a.category === Category.NEWS);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breaking News Ticker */}
      <div className="bg-black text-white px-4 py-2 rounded-full mb-8 flex items-center overflow-hidden">
        <span className="bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase mr-4 flex-shrink-0 animate-pulse">Breaking News</span>
        <div className="flex gap-8 animate-marquee whitespace-nowrap text-sm font-medium">
           {newsArticles.slice(0, 3).map(n => (
             <span key={n.id} className="cursor-pointer hover:text-red-400" onClick={() => onArticleClick(n.slug)}>{n.title}</span>
           ))}
           <span>Welcome to CineStream India: Your #1 destination for Indian cinema and OTT updates!</span>
        </div>
      </div>

      <AdUnit type="leaderboard" className="mb-8" />

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="flex-1">
          {/* Featured Section */}
          {featured && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-red-600 pl-4">Spotlight</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ArticleCard article={featured} variant="large" onClick={onArticleClick} />
              </div>
            </section>
          )}

          <AdUnit type="infeed" />

          {/* Categories Sections */}
          <div className="space-y-16">
            {/* OTT Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-red-600 pl-4">Top OTT Releases This Week</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {ottArticles.map(article => (
                  <ArticleCard key={article.id} article={article} onClick={onArticleClick} />
                ))}
              </div>
            </section>

            {/* Movies Section */}
            <section className="bg-gray-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 text-white rounded-3xl">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold border-l-4 border-red-600 pl-4">In Theaters Now</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {movieArticles.map(article => (
                    <div 
                      key={article.id} 
                      onClick={() => onArticleClick(article.slug)}
                      className="group cursor-pointer"
                    >
                       <div className="aspect-[2/3] rounded-xl overflow-hidden mb-4 border border-white/10">
                          <img src={article.imageUrl} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                       </div>
                       <h3 className="font-bold text-lg leading-tight group-hover:text-red-400">{article.title}</h3>
                       <p className="text-gray-400 text-xs mt-2 uppercase font-semibold">{article.language.join(', ')}</p>
                    </div>
                  ))}
               </div>
            </section>

            {/* Cinema News Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-red-600 pl-4">Latest Cinema News</h2>
              <div className="space-y-6">
                {newsArticles.map(article => (
                  <ArticleCard key={article.id} article={article} variant="horizontal" onClick={onArticleClick} />
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar */}
        <Sidebar onArticleClick={onArticleClick} />
      </div>
    </div>
  );
};

export default Home;
