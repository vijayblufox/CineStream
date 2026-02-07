
import React, { useState, useEffect } from 'react';
import { TrendingUp, ExternalLink } from 'lucide-react';
import { MOCK_ARTICLES } from '../constants';
import { getSiteConfig } from '../services/storage';
import AdUnit from './AdUnit';

const Sidebar: React.FC<{ onArticleClick: (slug: string) => void }> = ({ onArticleClick }) => {
  const [config, setConfig] = useState(getSiteConfig());

  useEffect(() => {
    // Basic polling or just initial load
    setConfig(getSiteConfig());
  }, []);

  return (
    <aside className="w-full lg:w-80 space-y-8">
      {/* Social Join */}
      <div className="bg-gradient-to-br from-red-600 to-rose-700 p-6 rounded-2xl text-white shadow-lg">
        <h3 className="text-lg font-bold mb-2">Join our Movie Gang</h3>
        <p className="text-sm opacity-90 mb-4">Get the latest OTT & Movie updates directly on WhatsApp & Telegram.</p>
        <div className="flex gap-2">
           <a href={config.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white text-red-600 py-2 rounded-lg font-bold text-xs uppercase text-center flex items-center justify-center">WhatsApp</a>
           <a href={config.telegramLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg font-bold text-xs uppercase backdrop-blur-sm text-center flex items-center justify-center">Telegram</a>
        </div>
      </div>

      <AdUnit type="sidebar" />

      {/* Trending Posts */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-red-600" />
          <h3 className="font-bold text-gray-900 text-lg">Trending Now</h3>
        </div>
        <div className="space-y-4">
          {MOCK_ARTICLES.slice(0, 4).map((article, idx) => (
            <div 
              key={article.id} 
              className="flex gap-4 group cursor-pointer"
              onClick={() => onArticleClick(article.slug)}
            >
              <span className="text-2xl font-black text-gray-100 group-hover:text-red-100 transition-colors">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div>
                <h4 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400 font-semibold uppercase">
                   <span>{article.platform || 'NEWS'}</span>
                   <span>•</span>
                   <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
           <ExternalLink className="h-4 w-4" /> Quick Access
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Action', 'Thriller', 'Netflix 2024', 'Upcoming Movies', 'Pushpa 2', 'South Cinema', 'Huma Qureshi', 'Blockbuster'].map(tag => (
            <button key={tag} className="text-xs bg-gray-50 hover:bg-red-50 hover:text-red-600 px-3 py-1.5 rounded-full text-gray-600 transition-colors border border-gray-100">
              #{tag}
            </button>
          ))}
        </div>
      </section>

      <AdUnit type="sidebar" className="sticky top-20" />
    </aside>
  );
};

export default Sidebar;
