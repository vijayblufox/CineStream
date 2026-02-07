
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Save, X, LayoutDashboard, Settings, 
  LogOut, CheckCircle, Globe, Users, HelpCircle, Film, Upload, Video, Image as ImageIcon, 
  ListOrdered, LayoutTemplate, MonitorPlay
} from 'lucide-react';
import { Article, Category, Platform, SiteConfig, MovieListItem } from '../types.ts';
import { 
  getArticles, saveArticle, deleteArticle, 
  getSiteConfig, saveSiteConfig 
} from '../services/storage.ts';

const PLATFORM_COLORS: Record<string, string> = {
  [Platform.NETFLIX]: 'bg-[#E50914]',
  [Platform.PRIME]: 'bg-[#00A8E1]',
  [Platform.HOTSTAR]: 'bg-[#001A33]',
  [Platform.ZEE5]: 'bg-[#8230c6]',
  [Platform.SONYLIV]: 'bg-[#2e3192]',
  [Platform.JIOHOTSTAR]: 'bg-[#0a2754]',
  [Platform.AHA]: 'bg-[#ff4500]',
  [Platform.THEATRICAL]: 'bg-[#000000]',
};

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(getSiteConfig());
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [view, setView] = useState<'list' | 'edit' | 'settings'>('list');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      setArticles(getArticles());
      setSiteConfig(getSiteConfig());
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const startEdit = (article?: Article) => {
    setEditingArticle(article || {
      id: Date.now().toString(),
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: Category.OTT,
      platform: Platform.THEATRICAL,
      releaseDate: new Date().toISOString().split('T')[0],
      language: ['Hindi'],
      genre: ['Drama'],
      cast: [],
      director: '',
      imageUrl: '',
      publishedAt: new Date().toISOString(),
      faqs: [{ q: '', a: '' }],
      movieList: [],
      trailerUrl: ''
    });
    setView('edit');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addMovieItem = () => {
    if (editingArticle) {
      const newList = [...(editingArticle.movieList || [])];
      if (newList.length >= 10) {
        alert("Maximum 10 movies allowed per blog listicle.");
        return;
      }
      newList.push({
        id: Math.random().toString(36).substr(2, 9),
        title: '',
        description: '',
        imageUrl: '',
        videoUrl: '',
        platform: Platform.NETFLIX
      });
      setEditingArticle({ ...editingArticle, movieList: newList });
    }
  };

  const removeMovieItem = (id: string) => {
    if (editingArticle) {
      const newList = (editingArticle.movieList || []).filter(item => item.id !== id);
      setEditingArticle({ ...editingArticle, movieList: newList });
    }
  };

  const updateMovieItem = (id: string, field: keyof MovieListItem, value: any) => {
    if (editingArticle) {
      const newList = (editingArticle.movieList || []).map(item => 
        item.id === id ? { ...item, [field]: value } : item
      );
      setEditingArticle({ ...editingArticle, movieList: newList });
    }
  };

  const generateSlug = (title: string, category: string) => {
    const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let prefix = 'news-';
    if (category === Category.OTT) prefix = 'ott-';
    if (category === Category.MOVIE) prefix = 'movie-';
    return prefix + base;
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArticle) {
      saveArticle(editingArticle as Article);
      setArticles(getArticles());
      setSuccessMsg('Content Live!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setView('list');
      setEditingArticle(null);
    }
  };

  // Fixed the error by adding the missing handleDelete handler.
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id);
      setArticles(getArticles());
      setSuccessMsg('Article deleted successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">CineStream India</h2>
          <input 
            type="password" 
            placeholder="Admin Password" 
            className="w-full p-4 border border-gray-200 rounded-2xl mb-4 text-center"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-red-600 text-white py-4 rounded-2xl font-black">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b flex items-center gap-3">
          <Film className="h-6 w-6 text-red-600" />
          <h1 className="text-xl font-black">CMS Admin</h1>
        </div>
        <nav className="p-6 space-y-4">
          <button onClick={() => setView('list')} className={`w-full flex items-center p-4 rounded-2xl ${view === 'list' ? 'bg-red-50 text-red-600 font-bold' : 'text-gray-500'}`}>
            <LayoutDashboard className="h-5 w-5 mr-3" /> Dashboard
          </button>
          <button onClick={() => startEdit()} className={`w-full flex items-center p-4 rounded-2xl ${view === 'edit' ? 'bg-red-50 text-red-600 font-bold' : 'text-gray-500'}`}>
            <Plus className="h-5 w-5 mr-3" /> New Post
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        {successMsg && <div className="bg-green-600 text-white p-4 rounded-2xl mb-8 font-bold">{successMsg}</div>}

        {view === 'list' ? (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr className="text-[10px] font-black uppercase text-gray-400">
                    <th className="px-8 py-6">Title</th>
                    <th className="px-8 py-6">Category</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {articles.map(article => (
                    <tr key={article.id}>
                      <td className="px-8 py-6 font-bold">{article.title}</td>
                      <td className="px-8 py-6 text-xs uppercase font-black">{article.category}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => startEdit(article)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleDelete(article.id)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        ) : (
          <form onSubmit={handleSaveArticle} className="space-y-10 max-w-5xl">
            <section className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm">
               <h3 className="text-xl font-black mb-8 border-b pb-4">Article Configuration</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2 space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Main Title</label>
                     <input 
                      required
                      className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl font-black text-xl outline-none focus:border-red-600"
                      value={editingArticle?.title || ''}
                      onChange={(e) => {
                        const title = e.target.value;
                        const slug = generateSlug(title, editingArticle?.category || Category.OTT);
                        setEditingArticle({...editingArticle!, title, slug});
                      }}
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Blog Category</label>
                     <select 
                      className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl font-bold"
                      value={editingArticle?.category}
                      onChange={(e) => {
                        const cat = e.target.value as Category;
                        const slug = generateSlug(editingArticle?.title || '', cat);
                        setEditingArticle({...editingArticle!, category: cat, slug});
                      }}
                     >
                        <option value={Category.OTT}>OTT Releases</option>
                        <option value={Category.MOVIE}>Movie Releases</option>
                        <option value={Category.NEWS}>Cinema News</option>
                     </select>
                  </div>

                  {/* ONLY FOR MOVIE RELEASES AND NEWS */}
                  {(editingArticle?.category === Category.MOVIE || editingArticle?.category === Category.NEWS) && (
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Main Platform</label>
                       <select 
                        className={`w-full p-5 rounded-2xl font-black text-white ${PLATFORM_COLORS[editingArticle?.platform || Platform.THEATRICAL]} transition-all`}
                        value={editingArticle?.platform}
                        onChange={(e) => setEditingArticle({...editingArticle!, platform: e.target.value as Platform})}
                       >
                          {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
                       </select>
                    </div>
                  )}

                  <div className="md:col-span-2 space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Feature Image</label>
                     <div className="flex gap-4">
                        <input className="flex-1 p-5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-mono" placeholder="Image URL..." value={editingArticle?.imageUrl || ''} onChange={(e) => setEditingArticle({...editingArticle!, imageUrl: e.target.value})} />
                        <label className="cursor-pointer bg-gray-900 text-white px-6 rounded-2xl flex items-center gap-2 font-bold text-sm">
                           <Upload className="h-4 w-4" /> Upload
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setEditingArticle({...editingArticle!, imageUrl: url}))} />
                        </label>
                     </div>
                  </div>

                  {/* TRAILER FOR MOVIE/NEWS */}
                  {(editingArticle?.category === Category.MOVIE || editingArticle?.category === Category.NEWS) && (
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2"><Video className="h-4 w-4 text-red-600" /> Main Trailer / Video URL</label>
                       <input 
                        className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl font-mono text-sm"
                        placeholder="YouTube Link..."
                        value={editingArticle?.trailerUrl || ''}
                        onChange={(e) => setEditingArticle({...editingArticle!, trailerUrl: e.target.value})}
                       />
                    </div>
                  )}
               </div>
            </section>

            {/* LISTICLE BUILDER FOR OTT RELEASES */}
            {editingArticle?.category === Category.OTT && (
              <section className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl">
                 <div className="flex items-center justify-between mb-10">
                    <div>
                       <h3 className="text-2xl font-black text-white flex items-center gap-3"><ListOrdered className="h-8 w-8 text-red-600" /> Movie Listicle Builder</h3>
                       <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Add up to 10 movies</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={addMovieItem}
                      className="bg-red-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-red-700 shadow-xl shadow-red-200 active:scale-95 transition-all"
                    >
                      <Plus className="h-5 w-5" /> Add Movie
                    </button>
                 </div>

                 <div className="space-y-10">
                    {editingArticle?.movieList?.map((item, index) => (
                      <div key={item.id} className="bg-white/5 border border-white/10 p-10 rounded-[2rem] relative">
                         <div className="absolute -top-4 -left-4 bg-red-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border-4 border-gray-900">
                            {index + 1}
                         </div>
                         <button type="button" onClick={() => removeMovieItem(item.id)} className="absolute top-6 right-6 text-red-400 hover:text-white"><Trash2 className="h-5 w-5"/></button>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Movie Title</label>
                               <input className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-lg" value={item.title} onChange={(e) => updateMovieItem(item.id, 'title', e.target.value)} />
                               
                               <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Target OTT Platform</label>
                               <select 
                                className={`w-full p-4 rounded-2xl font-black text-white ${PLATFORM_COLORS[item.platform || Platform.NETFLIX]} transition-all outline-none`}
                                value={item.platform}
                                onChange={(e) => updateMovieItem(item.id, 'platform', e.target.value as Platform)}
                               >
                                  {Object.values(Platform).filter(p => p !== Platform.THEATRICAL).map(p => <option key={p} value={p}>{p}</option>)}
                               </select>
                            </div>

                            <div className="space-y-4">
                               <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Image / Banner</label>
                               <div className="flex gap-2">
                                  <input className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-white" value={item.imageUrl} placeholder="URL or Upload" onChange={(e) => updateMovieItem(item.id, 'imageUrl', e.target.value)} />
                                  <label className="cursor-pointer bg-white/10 p-4 rounded-2xl flex items-center justify-center">
                                     <Upload className="h-5 w-5 text-gray-400" />
                                     <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateMovieItem(item.id, 'imageUrl', url))} />
                                  </label>
                               </div>
                               {item.imageUrl && <div className="h-20 w-full rounded-2xl overflow-hidden border border-white/10"><img src={item.imageUrl} className="w-full h-full object-cover"/></div>}
                            </div>

                            <div className="md:col-span-2 space-y-4">
                               <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Video URL (Optional)</label>
                               <input className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-mono" placeholder="YouTube Link..." value={item.videoUrl} onChange={(e) => updateMovieItem(item.id, 'videoUrl', e.target.value)} />
                               
                               <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Movie Review / Description</label>
                               <textarea className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white h-32 leading-relaxed" placeholder="Write why this movie is worth watching..." value={item.description} onChange={(e) => updateMovieItem(item.id, 'description', e.target.value)} />
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>
            )}

            <section className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm">
               <h3 className="text-xl font-black mb-8 border-b pb-4">Full Blog Content</h3>
               <textarea required className="w-full p-8 bg-gray-50 border border-gray-200 rounded-[2rem] h-96 text-lg leading-relaxed outline-none focus:border-red-600" value={editingArticle?.content || ''} onChange={(e) => setEditingArticle({...editingArticle!, content: e.target.value})} />
            </section>

            <div className="flex gap-6 pb-20">
              <button type="submit" className="flex-1 bg-red-600 text-white py-6 rounded-[2rem] font-black text-2xl hover:bg-red-700 shadow-2xl active:scale-95 transition-all">
                Publish Blog Post
              </button>
              <button type="button" onClick={() => setView('list')} className="px-12 bg-gray-100 text-gray-600 py-6 rounded-[2rem] font-black text-xl hover:bg-gray-200 transition-all">
                Discard Draft
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
