
import React, { useEffect } from 'react';
import { Calendar, Tag, Share2, MessageSquare, PlayCircle, ChevronRight, ListOrdered, MonitorPlay } from 'lucide-react';
import { Article, Category, Platform } from '../types.ts';
import Sidebar from '../components/Sidebar.tsx';
import AdUnit from '../components/AdUnit.tsx';
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
  onNavigate: (path: string) => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onNavigate }) => {
  useEffect(() => {
    updateSEOMeta(article.title, article.excerpt);
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

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center text-[10px] text-gray-400 mb-8 font-black uppercase tracking-[0.2em]">
         <button onClick={() => onNavigate('/')} className="hover:text-red-600 transition-colors">Home</button>
         <ChevronRight className="h-3 w-3 mx-3" />
         <button onClick={() => onNavigate('/category/' + article.category.toLowerCase().replace(' ', '-'))} className="hover:text-red-600 transition-colors">{article.category}</button>
         <ChevronRight className="h-3 w-3 mx-3" />
         <span className="truncate max-w-[200px]">{article.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1">
          <header className="mb-12">
            <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] mb-6 ${article.category === Category.OTT ? 'bg-red-100 text-red-600 shadow-sm shadow-red-100' : 'bg-blue-100 text-blue-600'}`}>
              {article.category}
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-8 brand-font">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 text-sm text-gray-500 pb-10 border-b-2 border-gray-100">
               <div className="flex items-center">
                 <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mr-4 text-white font-black text-lg shadow-lg">CS</div>
                 <div>
                   <p className="text-gray-900 font-black text-xs uppercase tracking-widest">Editorial Team</p>
                   <p className="text-[10px] font-bold uppercase text-gray-400 mt-1">Verified Cinema Expert</p>
                 </div>
               </div>
               <div className="flex items-center gap-6">
                  <div className="flex items-center font-bold text-gray-400 text-xs uppercase">
                     <Calendar className="h-4 w-4 mr-2" />
                     {new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
                  </div>
                  <button className="flex items-center hover:text-red-600 font-bold text-xs uppercase transition-colors">
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </button>
               </div>
            </div>
          </header>

          <div className="relative aspect-[21/9] rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl ring-8 ring-gray-50">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            {article.platform && article.category !== Category.OTT && (
              <div className="absolute bottom-10 left-10 text-white">
                <span className="text-[10px] uppercase font-black tracking-widest opacity-70 mb-2 block">Official Release</span>
                <div className="flex items-center gap-4">
                   <div className={`p-3 rounded-2xl ${PLATFORM_THEMES[article.platform].bg} shadow-lg`}>
                      <MonitorPlay className="h-6 w-6" />
                   </div>
                   <p className="text-4xl font-black">{article.platform}</p>
                </div>
              </div>
            )}
          </div>

          <div className="prose prose-xl prose-red max-w-none text-gray-700 leading-relaxed">
            <p className="text-2xl font-bold text-gray-900 leading-relaxed italic border-l-8 border-red-600 pl-8 py-2 bg-red-50/50 rounded-r-3xl mb-12">
              {article.excerpt}
            </p>
            
            <div className="mb-16 text-lg" dangerouslySetInnerHTML={{ __html: article.content }} />

            {/* MAIN TRAILER FOR MOVIE/NEWS */}
            {article.trailerUrl && article.category !== Category.OTT && (
               <div className="mb-16">
                  <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
                     <PlayCircle className="h-8 w-8 text-red-600" /> Watch Official Trailer
                  </h2>
                  <div className="aspect-video rounded-[2rem] overflow-hidden bg-black shadow-2xl">
                     <iframe 
                        className="w-full h-full"
                        src={getEmbedUrl(article.trailerUrl) || ''}
                        title="Trailer"
                        frameBorder="0"
                        allowFullScreen
                     ></iframe>
                  </div>
               </div>
            )}

            {/* LISTICLE CONTENT RENDERING (FOR OTT) */}
            {isOTTListicle && (
              <div className="mt-20 space-y-24">
                 <div className="flex items-center gap-4 mb-16">
                    <div className="bg-red-600 text-white p-3 rounded-2xl shadow-xl shadow-red-200">
                       <ListOrdered className="h-8 w-8" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter m-0">Recommended OTT List</h2>
                 </div>

                 {article.movieList?.map((item, index) => {
                   const embedUrl = getEmbedUrl(item.videoUrl);
                   const theme = item.platform ? PLATFORM_THEMES[item.platform] : PLATFORM_THEMES[Platform.NETFLIX];
                   
                   return (
                     <section key={item.id} className="relative group scroll-mt-24">
                        <div className="flex flex-col md:flex-row gap-10 items-start">
                           <div className="flex-shrink-0 relative">
                              <div className="bg-red-600 text-white w-16 h-16 rounded-3xl flex items-center justify-center font-black text-3xl shadow-2xl border-4 border-white mb-6">
                                 {index + 1}
                              </div>
                           </div>
                           <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                 <h3 className="text-4xl font-black text-gray-900 m-0 uppercase tracking-tight group-hover:text-red-600 transition-colors">
                                    {item.title}
                                 </h3>
                                 {item.platform && (
                                   <div className={`${theme.bg} ${theme.text} px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2`}>
                                      <MonitorPlay className="h-4 w-4" />
                                      {item.platform}
                                   </div>
                                 )}
                              </div>
                              
                              {item.imageUrl && (
                                <div className="mb-10 rounded-[2.5rem] overflow-hidden shadow-2xl ring-4 ring-gray-100 group-hover:ring-red-50 transition-all duration-500">
                                   <img src={item.imageUrl} alt={item.title} className="w-full aspect-[21/9] object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                              )}
                              
                              <div className="text-xl text-gray-600 leading-[1.8] mb-12 whitespace-pre-wrap font-medium">
                                 {item.description}
                              </div>

                              {embedUrl && (
                                <div className="space-y-6 bg-black p-1 rounded-[2rem] shadow-2xl">
                                   <div className="aspect-video rounded-[1.8rem] overflow-hidden">
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
            
            <AdUnit type="infeed" className="my-20" />
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
