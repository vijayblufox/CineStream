
import React, { useEffect } from 'react';
import { Calendar, Tag, Share2, MessageSquare, PlayCircle, ChevronRight, ExternalLink } from 'lucide-react';
import { Article, Category } from '../types.ts';
import Sidebar from '../components/Sidebar.tsx';
import AdUnit from '../components/AdUnit.tsx';
import { updateSEOMeta } from '../services/storage.ts';

interface ArticleDetailProps {
  article: Article;
  onNavigate: (path: string) => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onNavigate }) => {
  useEffect(() => {
    updateSEOMeta(article.title, article.excerpt);
  }, [article]);

  // Helper to extract YouTube ID for embedding
  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs text-gray-500 mb-6 font-medium uppercase tracking-wider">
         <button onClick={() => onNavigate('/')} className="hover:text-red-600 transition-colors">Home</button>
         <ChevronRight className="h-3 w-3 mx-2" />
         <button onClick={() => onNavigate('/category/' + article.category.toLowerCase().replace(' ', '-'))} className="hover:text-red-600 transition-colors">{article.category}</button>
         <ChevronRight className="h-3 w-3 mx-2" />
         <span className="text-gray-400 truncate max-w-[200px]">{article.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <header className="mb-8">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${article.category === Category.OTT ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              {article.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pb-6 border-b border-gray-100">
               <div className="flex items-center">
                 <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-2 text-red-600 font-bold">ED</div>
                 <div>
                   <p className="text-gray-900 font-bold text-xs uppercase">Editorial Team</p>
                   <p className="text-[10px]">Updated: {new Date(article.publishedAt).toLocaleDateString()}</p>
                 </div>
               </div>
               <div className="flex gap-4">
                  <button className="flex items-center hover:text-red-600 transition-colors">
                    <Share2 className="h-4 w-4 mr-1.5" /> Share
                  </button>
                  <button className="flex items-center hover:text-red-600 transition-colors">
                    <MessageSquare className="h-4 w-4 mr-1.5" /> Discuss
                  </button>
               </div>
            </div>
          </header>

          <div className="relative aspect-video rounded-3xl overflow-hidden mb-10 shadow-2xl">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            {article.platform && (
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xs uppercase font-bold tracking-widest opacity-80">Main Platform</p>
                <p className="text-2xl font-black">{article.platform}</p>
              </div>
            )}
          </div>

          <div className="prose prose-lg prose-red max-w-none text-gray-700 leading-relaxed space-y-8">
            <p className="text-xl font-medium text-gray-900 leading-relaxed italic border-l-4 border-red-200 pl-6">
              {article.excerpt}
            </p>
            
            <div dangerouslySetInnerHTML={{ __html: article.content }} />

            {/* Listicle Items Section */}
            {article.movieList && article.movieList.length > 0 && (
              <div className="mt-16 space-y-16">
                 {article.movieList.map((item, index) => {
                   const embedUrl = getEmbedUrl(item.videoUrl);
                   return (
                     <section key={item.id} className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-gray-50 px-8 py-4 flex items-center justify-between border-b border-gray-100">
                           <span className="text-sm font-black text-red-600 uppercase tracking-widest"># {index + 1}</span>
                           <h2 className="text-2xl font-black text-gray-900 m-0 uppercase tracking-tighter">{item.title}</h2>
                        </div>
                        
                        <div className="p-8">
                           {item.imageUrl && (
                             <div className="mb-8 rounded-2xl overflow-hidden shadow-lg aspect-video md:aspect-[21/9]">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                             </div>
                           )}
                           
                           <div className="text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap">
                              {item.description}
                           </div>

                           {embedUrl && (
                             <div className="space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2 m-0 uppercase tracking-widest text-gray-400">
                                   <PlayCircle className="h-5 w-5 text-red-600" /> Watch Trailer
                                </h3>
                                <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
                                   <iframe 
                                      className="w-full h-full"
                                      src={embedUrl}
                                      title={item.title}
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                   ></iframe>
                                </div>
                             </div>
                           )}
                        </div>
                     </section>
                   );
                 })}
              </div>
            )}
            
            <AdUnit type="infeed" />

            {article.faqs && article.faqs.length > 0 && (
              <div className="mt-16 bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                 <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 m-0 uppercase tracking-tighter">Frequently Asked Questions</h2>
                 </div>
                 <div className="divide-y divide-gray-100">
                    {article.faqs.map((faq, i) => (
                      <div key={i} className="p-8">
                         <h3 className="text-lg font-bold text-gray-900 m-0 mb-3">{faq.q}</h3>
                         <p className="text-gray-600 m-0">{faq.a}</p>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>

          <div className="mt-12 pt-12 border-t border-gray-100">
             <div className="flex items-center gap-4">
                <Tag className="h-5 w-5 text-gray-400" />
                <div className="flex gap-2">
                   {article.genre.map(tag => (
                     <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{tag}</span>
                   ))}
                </div>
             </div>
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
