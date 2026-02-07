
import React, { useEffect } from 'react';
import { Calendar, Tag, Share2, MessageSquare, PlayCircle, ChevronRight, ListOrdered, MonitorPlay, Film, Sparkles } from 'lucide-react';
import { Article, Category, Platform } from '../types.ts';
import Sidebar from '../components/Sidebar.tsx';
import AdUnit from '../components/AdUnit.tsx';
import ArticleCard from '../components/ArticleCard.tsx';
import { updateSEOMeta } from '../services/storage.ts';

const PLATFORM_THEMES: Record<string, { bg: string, text: string }> = {
  [Platform.NETFLIX]: { bg: 'bg-[#E50914]', text: 'text-white' },
  [Platform.PRIME]: { bg: 'bg-[#00A8E1]', text: 'text-white' },
  [Platform.HOTSTAR]: { bg: 'bg-[#001A33]', text: 'text-white' },
  [Platform.ZEE5]: { bg: 'bg-[#8230c6]', text: 'text-white' },
  [Platform.SONYLIV]: { bg: 'bg-[#2e3192]', text: 'text-white' },
  [Platform.JIOHOTSTAR]: { bg: 'bg-[#0a2754]', text: 'text-white' },
  [Platform.AHA]: { bg: 'bg-[#ff4500]', text: 'text-white' },
  [Platform.THEATRICAL]: { bg: 'bg-[#000000]', text: 'text-white' },
};

interface ArticleDetailProps {
  article: Article;
  articles: Article[];
  onNavigate: (path: string) => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, articles, onNavigate }) => {
  useEffect(() => {
    updateSEOMeta(article.title, article.excerpt);
    window.scrollTo(0, 0);
  }, [article]);

  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    let videoId = '';
    try {
      if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
    } catch (e) { return null; }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const isOTTListicle = article.category === Category.OTT && article.movieList && article.movieList.length > 0;

  // Logic for Related Articles
  const relatedArticles = articles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Dynamic Breadcrumbs */}
      <nav className="flex items-center text-[10px] text-gray-400 mb-12 font-black uppercase tracking-[0.2em] overflow-x-auto whitespace-nowrap">
         <button onClick={() => onNavigate('/')} className="hover:text-red-600 transition-colors">Home</button>
         <ChevronRight className="h-3 w-3 mx-4" />
         <button onClick={() => onNavigate('/category/' + article.category.toLowerCase().replace(/\s+/g, '-'))} className="hover:text-red-600 transition-colors">{article.category}</button>
         <ChevronRight className="h-3 w-3 mx-4" />
         <span className="truncate text-gray-900">{article.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1">
          <header className="mb-16">
            <span className={`inline-block px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm ${article.category === Category.OTT ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
              {article.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1] mb-10 brand-font">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-10 text-sm text-gray-500 pb-12 border-b-2 border-gray-100">
               <div className="flex items-center">
                 <div className="h-14 w-14 rounded-3xl bg-gray-900 flex items-center justify-center mr-5 text-white font-black text-xl shadow-xl">CS</div>
                 <div>
                   <p className="text-gray-900 font-black text-xs uppercase tracking-widest">Editorial Team</p>
                   <p className="text-[10px] font-bold uppercase text-gray-400 mt-1 flex items-center gap-1"><Sparkles className="h-3 w-3 text-red-500" /> Cinema Analyst</p>
                 </div>
               </div>
               <div className="flex items-center gap-8">
                  <div className="flex items-center font-black text-gray-400 text-[10px] uppercase tracking-widest">
                     <Calendar className="h-4 w-4 mr-2 text-red-600" />
                     {new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <button className="flex items-center hover:text-red-600 font-black text-[10px] uppercase tracking-widest transition-colors">
                    <Share2 className="h-4 w-4 mr-2" /> Share Post
                  </button>
               </div>
            </div>
          </header>

          {/* Featured Visual Hero */}
          <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden mb-20 shadow-3xl ring-12 ring-gray-50/50">
            <img src={article.imageUrl} alt={article.title} loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
            
            {article.platform && article.category !== Category.OTT && (
              <div className="absolute bottom-12 left-12 text-white animate-in slide-in-from-left-10">
                <span className="text-[10px] uppercase font-black tracking-[0.3em] opacity-60 mb-3 block">Global Premier Platform</span>
                <div className="flex items-center gap-6">
                   <div className={`p-4 rounded-3xl ${PLATFORM_THEMES[article.platform].bg} shadow-2xl ring-4 ring-white/10`}>
                      <MonitorPlay className="h-8 w-8" />
                   </div>
                   <p className="text-5xl font-black tracking-tighter uppercase">{article.platform}</p>
                </div>
              </div>
            )}
          </div>

          <div className="prose prose-2xl prose-red max-w-none text-gray-800 leading-[1.8] font-medium">
            <p className="text-3xl font-black text-gray-900 leading-tight italic border-l-[12px] border-red-600 pl-10 py-4 bg-gray-50 rounded-r-[3rem] mb-20 shadow-sm">
              {article.excerpt}
            </p>
            
            <div className="mb-20 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: article.content }} />

            {article.trailerUrl && article.category !== Category.OTT && (
               <div className="mb-24 animate-in fade-in">
                  <div className="flex items-center gap-4 mb-10">
                    <PlayCircle className="h-10 w-10 text-red-600" />
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 m-0">Official Trailer</h2>
                  </div>
                  <div className="aspect-video rounded-[3rem] overflow-hidden bg-black shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] border-8 border-gray-50">
                     <iframe 
                        className="w-full h-full"
                        src={getEmbedUrl(article.trailerUrl) || ''}
                        title="Main Trailer"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                     ></iframe>
                  </div>
               </div>
            )}

            {isOTTListicle && (
              <div className="mt-32 space-y-40">
                 <div className="flex items-center gap-6 mb-20">
                    <div className="bg-red-600 text-white p-5 rounded-[2rem] shadow-2xl shadow-red-200">
                       <ListOrdered className="h-10 w-10" />
                    </div>
                    <h2 className="text-5xl font-black text-gray-900 uppercase tracking-tighter m-0">Recommended Picks</h2>
                 </div>

                 {article.movieList?.map((item, index) => {
                   const embedUrl = getEmbedUrl(item.videoUrl);
                   const theme = item.platform ? PLATFORM_THEMES[item.platform] : PLATFORM_THEMES[Platform.NETFLIX];
                   
                   return (
                     <section key={item.id} className="relative group scroll-mt-32 border-b border-gray-100 pb-32 last:border-0">
                        <div className="flex flex-col md:flex-row gap-14 items-start">
                           <div className="flex-shrink-0 relative">
                              <div className="bg-red-600 text-white w-20 h-20 rounded-[2rem] flex items-center justify-center font-black text-4xl shadow-3xl border-8 border-white mb-8">
                                 {index + 1}
                              </div>
                           </div>
                           <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                 <h3 className="text-5xl font-black text-gray-900 m-0 uppercase tracking-tight group-hover:text-red-600 transition-colors duration-500">
                                    {item.title}
                                 </h3>
                                 {item.platform && (
                                   <div className={`${theme.bg} ${theme.text} px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3`}>
                                      <MonitorPlay className="h-5 w-5" />
                                      {item.platform}
                                   </div>
                                 )}
                              </div>
                              
                              {item.imageUrl && (
                                <div className="mb-14 rounded-[3.5rem] overflow-hidden shadow-3xl ring-8 ring-gray-50/50 group-hover:ring-red-50/50 transition-all duration-700 transform group-hover:-translate-y-2">
                                   <img src={item.imageUrl} alt={item.title} loading="lazy" className="w-full aspect-video object-cover transition-transform duration-1000 group-hover:scale-105" />
                                </div>
                              )}
                              
                              <div className="text-2xl text-gray-600 leading-[1.8] mb-14 whitespace-pre-wrap font-bold bg-gray-50 p-12 rounded-[3rem] border-l-8 border-gray-200">
                                 {item.description}
                              </div>

                              {embedUrl && (
                                <div className="space-y-8 bg-gray-950 p-2 rounded-[3.5rem] shadow-3xl">
                                   <div className="aspect-video rounded-[3.2rem] overflow-hidden">
                                      <iframe 
                                         className="w-full h-full"
                                         src={embedUrl}
                                         title={item.title}
                                         frameBorder="0"
                                         allowFullScreen
                                      ></iframe>
                                   </div>
                                </div>
                              )}
                           </div>
                        </div>
                     </section>
                   );
                 })}
              </div>
            )}
            
            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
              <section className="mt-32 border-t pt-24">
                <div className="flex items-center gap-4 mb-12">
                  <Sparkles className="h-8 w-8 text-red-600" />
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 m-0">More in {article.category}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedArticles.map(rel => (
                    <ArticleCard key={rel.id} article={rel} onClick={() => onNavigate(`/article/${rel.slug}`)} />
                  ))}
                </div>
              </section>
            )}
            
            <AdUnit type="infeed" className="my-32" />
          </div>
        </div>

        <div className="hidden lg:block">
           <Sidebar onArticleClick={(slug) => onNavigate(`/article/${slug}`)} />
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
