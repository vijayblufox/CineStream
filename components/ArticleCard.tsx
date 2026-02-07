
import React from 'react';
import { Calendar, PlayCircle, Globe } from 'lucide-react';
import { Article, Category } from '../types';

interface ArticleCardProps {
  article: Article;
  onClick: (slug: string) => void;
  variant?: 'large' | 'small' | 'horizontal';
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, variant = 'small' }) => {
  const isOTT = article.category === Category.OTT;

  if (variant === 'horizontal') {
    return (
      <div 
        onClick={() => onClick(article.slug)}
        className="group flex gap-4 bg-white p-3 rounded-xl border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
      >
        <div className="w-1/3 flex-shrink-0">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full aspect-video object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        <div className="flex-1">
          <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${isOTT ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
            {article.category}
          </span>
          <h3 className="text-md font-bold text-gray-900 mt-1 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-gray-500 text-[11px]">
             <Calendar className="h-3 w-3" />
             <span>{article.releaseDate}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onClick(article.slug)}
      className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col ${variant === 'large' ? 'col-span-1 md:col-span-2' : ''}`}
    >
      <div className="relative overflow-hidden aspect-video">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        {article.platform && (
          <div className="absolute top-4 left-4">
             <span className="bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                <PlayCircle className="h-3 w-3 mr-1 text-red-500" />
                {article.platform}
             </span>
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-3 text-[10px] font-bold uppercase tracking-widest">
          <span className={isOTT ? 'text-red-600' : 'text-blue-600'}>{article.category}</span>
          <span className="text-gray-300">•</span>
          <div className="flex items-center text-gray-500">
            <Globe className="h-3 w-3 mr-1" />
            {article.language?.[0]}
          </div>
        </div>
        <h2 className={`${variant === 'large' ? 'text-2xl' : 'text-lg'} font-bold text-gray-900 mb-3 leading-tight group-hover:text-red-600 transition-colors`}>
          {article.title}
        </h2>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
           <div className="flex items-center text-gray-400 text-xs">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              {new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
           </div>
           <button className="text-red-600 font-bold text-xs uppercase tracking-tighter hover:tracking-normal transition-all">Read More →</button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
