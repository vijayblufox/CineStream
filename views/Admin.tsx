
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
  [Platform.NETFLIX]: 'bg-red-600',
  [Platform.PRIME]: 'bg-blue-500',
  [Platform.HOTSTAR]: 'bg-blue-900',
  [Platform.ZEE5]: 'bg-purple-600',
  [Platform.SONYLIV]: 'bg-indigo-700',
  [Platform.JIOHOTSTAR]: 'bg-blue-800',
  [Platform.AHA]: 'bg-orange-600',
  [Platform.THEATRICAL]: 'bg-gray-900',
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
      platform: Platform.NETFLIX,
      releaseDate: new Date().toISOString().split('T')[0],
      language: ['Hindi'],
      genre: ['Drama'],
      cast: [],
      director: '',
      imageUrl: '',
      publishedAt: new Date().toISOString(),
      faqs: [{ q: '', a: '' }],
      movieList: []
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

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArticle) {
      saveArticle(editingArticle as Article);
      setArticles(getArticles());
      setSuccessMsg('Article published successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setView('list');
      setEditingArticle(null);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSiteConfig(siteConfig);
    setSuccessMsg('Settings updated!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this post permanently?')) {
      deleteArticle(id);
      setArticles(getArticles());
    }
  };

  const generateSlug = (title: string, category: string) => {
    const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const prefix = category === Category.OTT ? 'ott-' : category === Category.MOVIE ? 'movie-' : 'news-';
    return prefix + base;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
          <div className="flex justify-center mb-6">
             <div className="bg-red-600 p-4 rounded-2xl">
                <Film className="h-10 w-10 text-white" />
             </div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2 text-center brand-font">CineStream India</h2>
          <p className="text-center text-gray-400 text-sm mb-8 font-medium">Internal Content Management System</p>
          <div className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Admin Password" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-600 outline-none transition-all font-bold text-center tracking-widest"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-200 active:scale-95">
              Login to CMS
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-gray-100 flex items-center">
          <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
             <Film className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-black text-gray-900 brand-font">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-6 space-y-3">
          <button onClick={() => setView('list')} className={`w-full flex items-center p-4 rounded-2xl transition-all ${view === 'list' ? 'bg-red-50 text-red-600 font-bold shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            <LayoutDashboard className="h-5 w-5 mr-3" /> Dashboard
          </button>
          <button onClick={() => startEdit()} className={`w-full flex items-center p-4 rounded-2xl transition-all ${view === 'edit' ? 'bg-red-50 text-red-600 font-bold shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Plus className="h-5 w-5 mr-3" /> New Blog Post
          </button>
          <button onClick={() => setView('settings')} className={`w-full flex items-center p-4 rounded-2xl transition-all ${view === 'settings' ? 'bg-red-50 text-red-600 font-bold shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Settings className="h-5 w-5 mr-3" /> Site Settings
          </button>
        </nav>
        <div className="p-6 border-t border-gray-100">
          <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center p-4 text-gray-400 hover:text-red-600 rounded-2xl hover:bg-red-50 transition-all font-bold">
            <LogOut className="h-5 w-5 mr-3" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 z-50">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
             {view === 'list' ? 'Editorial Content' : view === 'settings' ? 'Global Settings' : 'Create Article'}
          </h2>
        </header>

        <div className="p-10 max-w-6xl mx-auto">
          {successMsg && (
            <div className="mb-8 bg-green-50 border-2 border-green-100 text-green-700 p-5 rounded-3xl flex items-center animate-bounce shadow-sm">
              <CheckCircle className="h-6 w-6 mr-3" /> <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {view === 'list' ? (
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
               <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                  <tr>
                    <th className="px-8 py-6">Article Details</th>
                    <th className="px-8 py-6">Category</th>
                    <th className="px-8 py-6">Publish Date</th>
                    <th className="px-8 py-6 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {articles.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-gray-300 italic font-medium">No articles yet.</td>
                    </tr>
                  )}
                  {articles.map(article => (
                    <tr key={article.id} className="hover:bg-red-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <p className="font-black text-gray-900 text-lg">{article.title}</p>
                        <p className="text-xs text-gray-400 font-mono mt-1">/{article.slug}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black uppercase px-3 py-1.5 rounded-full bg-gray-100">{article.category}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-gray-500 uppercase">{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => startEdit(article)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit className="h-5 w-5" /></button>
                          <button onClick={() => handleDelete(article.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 className="h-5 w-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : view === 'settings' ? (
            <div className="space-y-8 bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 text-center py-20">
               <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
               <p className="text-gray-400">Settings module is currently under maintenance.</p>
               <button onClick={() => setView('list')} className="text-red-600 font-black uppercase text-xs">Return to Dashboard</button>
            </div>
          ) : (
            <form onSubmit={handleSaveArticle} className="space-y-12">
              {/* Blog Basics */}
              <section className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl">
                 <h3 className="text-xl font-black mb-8 flex items-center gap-3 border-b pb-4"><LayoutTemplate className="h-6 w-6 text-red-600" /> Blog Content</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 space-y-3">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Main Title</label>
                       <input 
                         required
                         type="text" 
                         className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-red-600 transition-all text-2xl font-black"
                         placeholder="Enter blog title..."
                         value={editingArticle?.title || ''}
                         onChange={(e) => {
                           const title = e.target.value;
                           const slug = generateSlug(title, editingArticle?.category || Category.OTT);
                           setEditingArticle({...editingArticle!, title, slug});
                         }}
                       />
                    </div>
                    
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Category</label>
                       <select 
                        className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl font-bold" 
                        value={editingArticle?.category} 
                        onChange={(e) => {
                          const category = e.target.value as Category;
                          const slug = generateSlug(editingArticle?.title || '', category);
                          setEditingArticle({...editingArticle!, category, slug});
                        }}
                       >
                          <option value={Category.OTT}>OTT Releases</option>
                          <option value={Category.MOVIE}>Movie Releases</option>
                          <option value={Category.NEWS}>Cinema News</option>
                       </select>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Main Platform / Source</label>
                       <div className="flex gap-2">
                          <select 
                            className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl font-bold" 
                            value={editingArticle?.platform} 
                            onChange={(e) => setEditingArticle({...editingArticle!, platform: e.target.value as Platform})}
                          >
                             {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                          <div className={`w-16 rounded-2xl ${PLATFORM_COLORS[editingArticle?.platform || Platform.NETFLIX]} transition-colors flex items-center justify-center`}>
                             <MonitorPlay className="h-6 w-6 text-white" />
                          </div>
                       </div>
                    </div>

                    <div className="md:col-span-2 space-y-3">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Feature Image</label>
                       <div className="flex gap-4">
                          <input className="flex-1 p-5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-mono" placeholder="Image URL..." value={editingArticle?.imageUrl || ''} onChange={(e) => setEditingArticle({...editingArticle!, imageUrl: e.target.value})} />
                          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-5 rounded-2xl flex items-center gap-2 font-black text-sm">
                             <Upload className="h-5 w-5" /> Upload
                             <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setEditingArticle({...editingArticle!, imageUrl: url}))} />
                          </label>
                       </div>
                    </div>
                 </div>
              </section>

              {/* LISTICLE BUILDER (OTT Listicles) */}
              {editingArticle?.category === Category.OTT && (
                <section className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl">
                   <div className="flex items-center justify-between mb-10">
                      <div>
                         <h3 className="text-2xl font-black text-white flex items-center gap-3"><ListOrdered className="h-8 w-8 text-red-600" /> OTT Listicle Template</h3>
                         <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Individual OTT Selection Enabled</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={addMovieItem}
                        className="bg-red-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-red-700 shadow-xl shadow-red-200 transition-all active:scale-95"
                      >
                        <Plus className="h-5 w-5" /> Add New Item
                      </button>
                   </div>

                   <div className="space-y-8">
                      {editingArticle?.movieList?.map((item, index) => (
                        <div key={item.id} className="bg-white/5 border border-white/10 p-10 rounded-[2rem] relative">
                           <div className="absolute -top-4 -left-4 bg-red-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border-4 border-gray-900">
                              {index + 1}
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Movie Title</label>
                                 <input className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold" value={item.title} onChange={(e) => updateMovieItem(item.id, 'title', e.target.value)} />
                                 
                                 <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Streaming Platform</label>
                                 <select 
                                  className={`w-full p-4 rounded-2xl font-black text-white ${PLATFORM_COLORS[item.platform || Platform.NETFLIX]} transition-colors`}
                                  value={item.platform}
                                  onChange={(e) => updateMovieItem(item.id, 'platform', e.target.value as Platform)}
                                 >
                                    {Object.values(Platform).filter(p => p !== Platform.THEATRICAL).map(p => <option key={p} value={p}>{p}</option>)}
                                 </select>
                              </div>

                              <div className="space-y-4">
                                 <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Item Image</label>
                                 <div className="flex gap-2">
                                    <input className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-white" value={item.imageUrl} placeholder="URL or Upload" onChange={(e) => updateMovieItem(item.id, 'imageUrl', e.target.value)} />
                                    <label className="cursor-pointer bg-white/10 p-4 rounded-2xl">
                                       <Upload className="h-5 w-5 text-gray-400" />
                                       <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateMovieItem(item.id, 'imageUrl', url))} />
                                    </label>
                                 </div>
                              </div>

                              <div className="md:col-span-2 space-y-4">
                                 <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Review / Description</label>
                                 <textarea className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white h-32" value={item.description} onChange={(e) => updateMovieItem(item.id, 'description', e.target.value)} />
                              </div>
                           </div>
                           <button onClick={() => removeMovieItem(item.id)} className="mt-4 text-red-400 hover:text-red-600 flex items-center gap-1 font-bold text-xs uppercase"><Trash2 className="h-3 w-3" /> Remove Item</button>
                        </div>
                      ))}
                   </div>
                </section>
              )}

              {/* Main Content Body */}
              <section className="bg-white p-10 rounded-3xl shadow-xl">
                 <h3 className="text-xl font-black mb-8 border-b pb-4">Global Content</h3>
                 <textarea required className="w-full p-8 bg-gray-50 border border-gray-200 rounded-3xl h-64 text-lg" placeholder="Write intro and outro..." value={editingArticle?.content || ''} onChange={(e) => setEditingArticle({...editingArticle!, content: e.target.value})} />
              </section>

              <div className="flex gap-6">
                <button type="submit" className="flex-1 bg-red-600 text-white py-6 rounded-3xl font-black text-2xl hover:bg-red-700 shadow-2xl active:scale-95 transition-all">
                  Publish Blog
                </button>
                <button type="button" onClick={() => setView('list')} className="px-12 bg-gray-100 text-gray-600 py-6 rounded-3xl font-black text-xl hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
