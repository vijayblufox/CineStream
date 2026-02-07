
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Save, X, LayoutDashboard, Settings, 
  LogOut, CheckCircle, Globe, Users, HelpCircle, Film, Upload, Video, Image as ImageIcon, 
  ListOrdered, LayoutTemplate, MonitorPlay, Sparkles
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
      setSuccessMsg('Content Live & Synchronized!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setView('list');
      setEditingArticle(null);
    }
  };

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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-12 rounded-[3rem] shadow-2xl w-full max-w-md border border-white/10">
          <div className="flex flex-col items-center mb-10">
             <div className="bg-red-600 p-4 rounded-3xl mb-4 shadow-xl shadow-red-900/20">
                <Film className="h-10 w-10 text-white" />
             </div>
             <h2 className="text-3xl font-black text-gray-900 brand-font">CineStream Admin</h2>
             <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Editorial Access Required</p>
          </div>
          <input 
            type="password" 
            placeholder="Passcode" 
            className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl mb-4 text-center font-black tracking-widest outline-none focus:border-red-600 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <button className="w-full bg-red-600 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-red-700 shadow-2xl shadow-red-200 transition-all active:scale-95">Enter Dashboard</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Premium Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-100 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-10 border-b flex items-center gap-4">
          <div className="bg-red-600 p-2 rounded-xl">
             <Film className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 brand-font">CMS</h1>
        </div>
        <nav className="flex-1 p-8 space-y-4">
          <button onClick={() => setView('list')} className={`w-full flex items-center p-5 rounded-[2rem] transition-all ${view === 'list' ? 'bg-red-50 text-red-600 font-black shadow-inner' : 'text-gray-400 hover:bg-gray-50 font-bold'}`}>
            <LayoutDashboard className="h-5 w-5 mr-3" /> Articles
          </button>
          <button onClick={() => startEdit()} className={`w-full flex items-center p-5 rounded-[2rem] transition-all ${view === 'edit' ? 'bg-red-50 text-red-600 font-black shadow-inner' : 'text-gray-400 hover:bg-gray-50 font-bold'}`}>
            <Plus className="h-5 w-5 mr-3" /> Create New
          </button>
          <button onClick={() => setView('settings')} className={`w-full flex items-center p-5 rounded-[2rem] transition-all ${view === 'settings' ? 'bg-red-50 text-red-600 font-black shadow-inner' : 'text-gray-400 hover:bg-gray-50 font-bold'}`}>
            <Settings className="h-5 w-5 mr-3" /> Settings
          </button>
        </nav>
        <div className="p-8">
           <button onClick={() => setIsAuthenticated(false)} className="w-full p-4 text-gray-400 font-black text-xs uppercase hover:text-red-600 transition-colors">Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
           <h2 className="text-4xl font-black text-gray-900 flex items-center gap-4">
              {view === 'list' ? 'Content Feed' : view === 'settings' ? 'Global Parameters' : 'Editor Board'}
              {view === 'edit' && <span className="bg-red-600 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">{editingArticle?.category}</span>}
           </h2>
           {successMsg && <div className="bg-green-600 text-white px-8 py-3 rounded-full font-black animate-bounce shadow-xl">{successMsg}</div>}
        </header>

        {view === 'list' ? (
          <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b">
                  <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    <th className="px-10 py-8">Title & Slug</th>
                    <th className="px-10 py-8">Category</th>
                    <th className="px-10 py-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {articles.map(article => (
                    <tr key={article.id} className="hover:bg-red-50/20 transition-colors group">
                      <td className="px-10 py-8">
                        <p className="font-black text-gray-900 text-xl group-hover:text-red-600 transition-colors">{article.title}</p>
                        <p className="text-xs text-gray-400 font-mono mt-1">/{article.slug}</p>
                      </td>
                      <td className="px-10 py-8">
                        <span className="text-[10px] font-black uppercase px-4 py-2 rounded-full bg-gray-100 text-gray-600">{article.category}</span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => startEdit(article)} className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Edit className="h-5 w-5" /></button>
                          <button onClick={() => handleDelete(article.id)} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all"><Trash2 className="h-5 w-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        ) : view === 'settings' ? (
          <div className="bg-white p-20 rounded-[4rem] text-center border border-gray-100 shadow-xl">
             <Settings className="h-20 w-20 text-gray-100 mx-auto mb-6" />
             <h3 className="text-2xl font-black text-gray-900 mb-2">Global Settings under Lock</h3>
             <p className="text-gray-400 font-medium">Contact system administrator for master configuration changes.</p>
          </div>
        ) : (
          <form onSubmit={handleSaveArticle} className="space-y-12">
            {/* Primary Details Card */}
            <section className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8">
                  <Sparkles className="h-10 w-10 text-red-50/50" />
               </div>
               <h3 className="text-2xl font-black mb-10 flex items-center gap-4 text-gray-900"><LayoutTemplate className="h-8 w-8 text-red-600" /> Identity & Routing</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="md:col-span-2 space-y-4">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Article Title</label>
                     <input 
                      required
                      className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-3xl font-black text-2xl outline-none focus:border-red-600 focus:bg-white transition-all"
                      placeholder="e.g. Best Netflix Movies to Watch Now"
                      value={editingArticle?.title || ''}
                      onChange={(e) => {
                        const title = e.target.value;
                        const slug = generateSlug(title, editingArticle?.category || Category.OTT);
                        setEditingArticle({...editingArticle!, title, slug});
                      }}
                     />
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Category Segment</label>
                     <select 
                      className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-3xl font-black text-lg outline-none focus:border-red-600 focus:bg-white transition-all"
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

                  {/* DYNAMIC: MAIN PLATFORM ONLY FOR MOVIE/NEWS */}
                  {(editingArticle?.category === Category.MOVIE || editingArticle?.category === Category.NEWS) && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-5">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Official Release Platform</label>
                       <div className="flex gap-4">
                          <select 
                            className={`flex-1 p-6 rounded-3xl font-black text-white ${PLATFORM_COLORS[editingArticle?.platform || Platform.THEATRICAL]} shadow-lg transition-all outline-none`}
                            value={editingArticle?.platform}
                            onChange={(e) => setEditingArticle({...editingArticle!, platform: e.target.value as Platform})}
                          >
                             {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                          <div className="bg-gray-100 p-6 rounded-3xl flex items-center justify-center">
                             <MonitorPlay className="h-6 w-6 text-gray-400" />
                          </div>
                       </div>
                    </div>
                  )}

                  <div className="md:col-span-2 space-y-4">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Cover Image</label>
                     <div className="flex gap-4">
                        <input className="flex-1 p-6 bg-gray-50 border-2 border-gray-100 rounded-3xl text-sm font-mono outline-none focus:border-red-600 transition-all" placeholder="Paste URL..." value={editingArticle?.imageUrl || ''} onChange={(e) => setEditingArticle({...editingArticle!, imageUrl: e.target.value})} />
                        <label className="cursor-pointer bg-gray-900 text-white px-10 rounded-3xl flex items-center gap-3 font-black text-sm hover:bg-black transition-all">
                           <Upload className="h-5 w-5" /> Import Local
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setEditingArticle({...editingArticle!, imageUrl: url}))} />
                        </label>
                     </div>
                  </div>

                  {/* DYNAMIC: TRAILER ONLY FOR MOVIE/NEWS */}
                  {(editingArticle?.category === Category.MOVIE || editingArticle?.category === Category.NEWS) && (
                    <div className="md:col-span-2 space-y-4 animate-in fade-in slide-in-from-bottom-5">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2"><Video className="h-4 w-4 text-red-600" /> Theatrical Trailer (YouTube Link)</label>
                       <input 
                        className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-3xl font-mono text-sm outline-none focus:border-red-600"
                        placeholder="e.g. https://www.youtube.com/watch?v=..."
                        value={editingArticle?.trailerUrl || ''}
                        onChange={(e) => setEditingArticle({...editingArticle!, trailerUrl: e.target.value})}
                       />
                    </div>
                  )}
               </div>
            </section>

            {/* DYNAMIC: OTT LISTICLE BUILDER */}
            {editingArticle?.category === Category.OTT && (
              <section className="bg-gray-950 p-16 rounded-[4rem] shadow-3xl relative">
                 <div className="flex flex-col md:flex-row items-center justify-between mb-16">
                    <div>
                       <h3 className="text-3xl font-black text-white flex items-center gap-4"><ListOrdered className="h-10 w-10 text-red-600" /> Listicle Content Generator</h3>
                       <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Individual Platform Mapping Active</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={addMovieItem}
                      className="bg-red-600 text-white px-10 py-5 rounded-[2rem] font-black flex items-center gap-3 hover:bg-red-700 shadow-2xl shadow-red-900/40 active:scale-95 transition-all mt-6 md:mt-0"
                    >
                      <Plus className="h-6 w-6" /> New Movie Entry
                    </button>
                 </div>

                 <div className="space-y-12">
                    {editingArticle?.movieList?.map((item, index) => (
                      <div key={item.id} className="bg-white/5 border-2 border-white/5 p-12 rounded-[3rem] relative animate-in fade-in slide-in-from-bottom-10">
                         <div className="absolute -top-6 -left-6 bg-red-600 text-white w-16 h-16 rounded-[2rem] flex items-center justify-center font-black text-2xl shadow-2xl border-8 border-gray-950">
                            {index + 1}
                         </div>
                         <button type="button" onClick={() => removeMovieItem(item.id)} className="absolute top-8 right-8 text-gray-500 hover:text-red-500 transition-colors"><Trash2 className="h-6 w-6"/></button>

                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Movie Name</label>
                                  <input className="w-full p-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white font-black text-xl outline-none focus:border-red-600" placeholder="Movie Title" value={item.title} onChange={(e) => updateMovieItem(item.id, 'title', e.target.value)} />
                               </div>
                               
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Streaming On</label>
                                  <select 
                                    className={`w-full p-5 rounded-2xl font-black text-white ${PLATFORM_COLORS[item.platform || Platform.NETFLIX]} shadow-xl transition-all border-none outline-none ring-4 ring-white/5`}
                                    value={item.platform}
                                    onChange={(e) => updateMovieItem(item.id, 'platform', e.target.value as Platform)}
                                  >
                                     {Object.values(Platform).filter(p => p !== Platform.THEATRICAL).map(p => <option key={p} value={p}>{p}</option>)}
                                  </select>
                               </div>
                            </div>

                            <div className="space-y-6">
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Media Preview</label>
                                  <div className="flex gap-3">
                                     <input className="flex-1 p-5 bg-white/5 border-2 border-white/10 rounded-2xl text-xs text-white/50" value={item.imageUrl} placeholder="Image Link" onChange={(e) => updateMovieItem(item.id, 'imageUrl', e.target.value)} />
                                     <label className="cursor-pointer bg-white/10 p-5 rounded-2xl flex items-center justify-center hover:bg-white/20">
                                        <Upload className="h-6 w-6 text-white" />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateMovieItem(item.id, 'imageUrl', url))} />
                                     </label>
                                  </div>
                                  {item.imageUrl && (
                                     <div className="h-24 w-full rounded-2xl overflow-hidden border-2 border-white/10 mt-2">
                                        <img src={item.imageUrl} className="w-full h-full object-cover opacity-80" />
                                     </div>
                                  )}
                               </div>
                            </div>

                            <div className="lg:col-span-2 space-y-6">
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Specific Trailer (Optional)</label>
                                  <input className="w-full p-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white text-xs font-mono outline-none focus:border-red-600" placeholder="YouTube URL" value={item.videoUrl} onChange={(e) => updateMovieItem(item.id, 'videoUrl', e.target.value)} />
                               </div>
                               
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Expert Opinion / Review</label>
                                  <textarea className="w-full p-6 bg-white/5 border-2 border-white/10 rounded-2xl text-white h-48 leading-relaxed outline-none focus:border-red-600" placeholder="Why is this movie in your Top 10?" value={item.description} onChange={(e) => updateMovieItem(item.id, 'description', e.target.value)} />
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                    {(!editingArticle.movieList || editingArticle.movieList.length === 0) && (
                       <div className="text-center py-20 text-gray-600 border-4 border-dashed border-white/5 rounded-[3rem]">
                          No entries added. Use the button above to build your Top List.
                       </div>
                    )}
                 </div>
              </section>
            )}

            {/* Global Content Editor */}
            <section className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
               <h3 className="text-2xl font-black mb-10 border-b pb-6">Editorial Narration</h3>
               <textarea required className="w-full p-10 bg-gray-50 border-2 border-gray-100 rounded-[3rem] h-96 text-xl leading-relaxed outline-none focus:border-red-600 focus:bg-white transition-all" placeholder="Introduction, insights, and conclusions..." value={editingArticle?.content || ''} onChange={(e) => setEditingArticle({...editingArticle!, content: e.target.value})} />
            </section>

            {/* Submission Actions */}
            <div className="flex gap-6 pb-24">
              <button type="submit" className="flex-1 bg-red-600 text-white py-8 rounded-[2.5rem] font-black text-3xl hover:bg-red-700 shadow-3xl shadow-red-200 active:scale-95 transition-all">
                Broadcast Content
              </button>
              <button type="button" onClick={() => setView('list')} className="px-16 bg-gray-100 text-gray-500 py-8 rounded-[2.5rem] font-black text-xl hover:bg-gray-200 transition-all">
                Cancel Session
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
