
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit, Trash2, Save, X, LayoutDashboard, Settings, 
  LogOut, CheckCircle, Globe, Users, HelpCircle, Film, Upload, Video, Image as ImageIcon
} from 'lucide-react';
import { Article, Category, Platform, SiteConfig, MovieListItem } from '../types.ts';
import { 
  getArticles, saveArticle, deleteArticle, 
  getSiteConfig, saveSiteConfig 
} from '../services/storage.ts';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(getSiteConfig());
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [view, setView] = useState<'list' | 'edit' | 'settings'>('list');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        alert("Maximum 10 movies allowed per blog.");
        return;
      }
      newList.push({
        id: Date.now().toString(),
        title: '',
        description: '',
        imageUrl: '',
        videoUrl: ''
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

  const updateMovieItem = (id: string, field: keyof MovieListItem, value: string) => {
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
      setSuccessMsg('Content published successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setView('list');
      setEditingArticle(null);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSiteConfig(siteConfig);
    setSuccessMsg('Settings updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteArticle(id);
      setArticles(getArticles());
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const updateListField = (field: 'cast' | 'language' | 'genre', value: string) => {
    if (editingArticle) {
      const list = value.split(',').map(s => s.trim()).filter(Boolean);
      setEditingArticle({ ...editingArticle, [field]: list });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-md">
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center brand-font">CineStream Admin</h2>
          <div className="space-y-4">
            <input 
              type="password" 
              placeholder="Admin Password" 
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-colors">
              Access Dashboard
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100 flex items-center">
          <Film className="h-6 w-6 text-red-600 mr-2" />
          <h1 className="text-xl font-black text-gray-900 brand-font">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setView('list')} className={`w-full flex items-center p-3 rounded-xl transition-colors ${view === 'list' ? 'bg-red-50 text-red-600 font-bold shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            <LayoutDashboard className="h-5 w-5 mr-3" /> All Posts
          </button>
          <button onClick={() => startEdit()} className="w-full flex items-center p-3 text-gray-500 hover:bg-gray-50 rounded-xl">
            <Plus className="h-5 w-5 mr-3" /> New Post
          </button>
          <button onClick={() => setView('settings')} className={`w-full flex items-center p-3 rounded-xl transition-colors ${view === 'settings' ? 'bg-red-50 text-red-600 font-bold shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Settings className="h-5 w-5 mr-3" /> Site Settings
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center p-3 text-gray-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors">
            <LogOut className="h-5 w-5 mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 z-10 shadow-sm backdrop-blur-md bg-white/80">
          <h2 className="text-xl font-bold text-gray-900">
            {view === 'list' ? 'Editorial Dashboard' : view === 'settings' ? 'Global Configuration' : editingArticle?.id ? 'Edit Article' : 'Draft New Article'}
          </h2>
          {view === 'list' && (
            <button onClick={() => startEdit()} className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold flex items-center hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95">
              <Plus className="h-4 w-4 mr-2" /> Publish News
            </button>
          )}
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          {successMsg && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center animate-bounce shadow-sm">
              <CheckCircle className="h-5 w-5 mr-2" /> {successMsg}
            </div>
          )}

          {view === 'list' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                  <tr>
                    <th className="px-6 py-4">Title & Slug</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Publish Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {articles.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">No posts found. Start by adding one!</td>
                    </tr>
                  )}
                  {articles.map(article => (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 text-sm line-clamp-1">{article.title}</p>
                        <p className="text-[11px] text-gray-400 font-mono tracking-tighter truncate max-w-xs">{article.slug}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                          article.category === Category.OTT ? 'bg-red-100 text-red-700' : 
                          article.category === Category.MOVIE ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>{article.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => startEdit(article)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleDelete(article.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : view === 'settings' ? (
            <form onSubmit={handleSaveSettings} className="space-y-8 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              {/* Settings Form Content (Omitted for brevity as same as before) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2"><Globe className="h-5 w-5 text-red-600" /> General Site Identity</h3>
                 </div>
                 <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">Site Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                      value={siteConfig.siteName}
                      onChange={(e) => setSiteConfig({...siteConfig, siteName: e.target.value})}
                    />
                 </div>
                 <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">Meta Description (SEO)</label>
                    <input 
                      required
                      type="text" 
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl"
                      value={siteConfig.description}
                      onChange={(e) => setSiteConfig({...siteConfig, description: e.target.value})}
                    />
                 </div>
                 <div className="space-y-4 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">Footer Tagline</label>
                    <textarea 
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl h-24"
                      value={siteConfig.footerText}
                      onChange={(e) => setSiteConfig({...siteConfig, footerText: e.target.value})}
                    />
                 </div>
                 <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2"><Users className="h-5 w-5 text-red-600" /> Social & Community Links</h3>
                 </div>
                 <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">WhatsApp Group Link</label>
                    <input type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl" value={siteConfig.whatsappLink} onChange={(e) => setSiteConfig({...siteConfig, whatsappLink: e.target.value})} />
                 </div>
                 <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">Telegram Channel Link</label>
                    <input type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl" value={siteConfig.telegramLink} onChange={(e) => setSiteConfig({...siteConfig, telegramLink: e.target.value})} />
                 </div>
              </div>
              <div className="pt-8 border-t flex justify-end">
                 <button type="submit" className="bg-red-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all">
                    Save Global Settings
                 </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSaveArticle} className="space-y-8 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">Content Title</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Top 10 Movies on Netflix this weekend"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-xl font-bold"
                    value={editingArticle?.title || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = editingArticle?.slug || generateSlug(title);
                      setEditingArticle({...editingArticle!, title, slug});
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">Permalink / Slug</label>
                  <input required type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs" value={editingArticle?.slug || ''} onChange={(e) => setEditingArticle({...editingArticle!, slug: e.target.value})} />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">Category</label>
                  <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl" value={editingArticle?.category} onChange={(e) => setEditingArticle({...editingArticle!, category: e.target.value as Category})}>
                    <option value={Category.OTT}>OTT Releases</option>
                    <option value={Category.MOVIE}>Movie Releases</option>
                    <option value={Category.NEWS}>Cinema News</option>
                  </select>
                </div>

                {/* Image Upload for Main Poster */}
                <div className="space-y-4 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter flex items-center justify-between">
                    <span>Main Feature Image</span>
                    <span className="text-[10px] text-gray-400">Direct URL or Upload</span>
                  </label>
                  <div className="flex gap-4">
                    <input 
                      required
                      type="text" 
                      placeholder="https://..."
                      className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl"
                      value={editingArticle?.imageUrl || ''}
                      onChange={(e) => setEditingArticle({...editingArticle!, imageUrl: e.target.value})}
                    />
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-4 rounded-xl flex items-center gap-2 text-sm font-bold">
                      <Upload className="h-4 w-4" /> Upload
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setEditingArticle({...editingArticle!, imageUrl: url}))} />
                    </label>
                  </div>
                  {editingArticle?.imageUrl && (
                    <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                       <img src={editingArticle.imageUrl} className="h-full w-full object-contain" alt="Preview" />
                    </div>
                  )}
                </div>

                {/* Dynamic Movie List Builder */}
                <div className="space-y-6 md:col-span-2 mt-10 p-6 bg-red-50/50 rounded-3xl border border-red-100/50">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold flex items-center gap-2"><Film className="h-5 w-5 text-red-600" /> Movie Listicle Items (Up to 10)</h3>
                      <button 
                        type="button" 
                        onClick={addMovieItem}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-700"
                      >
                        <Plus className="h-4 w-4" /> Add Item
                      </button>
                   </div>
                   
                   <div className="space-y-8">
                      {editingArticle?.movieList?.map((item, index) => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative group">
                           <button 
                            type="button" 
                            onClick={() => removeMovieItem(item.id)}
                            className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-red-600 p-1.5 rounded-full border border-gray-100 shadow-sm"
                           >
                             <X className="h-4 w-4" />
                           </button>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                 <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-1"><Edit className="h-3 w-3" /> Item #{index + 1} Title</label>
                                 <input 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                                    value={item.title}
                                    placeholder="Movie Title"
                                    onChange={(e) => updateMovieItem(item.id, 'title', e.target.value)}
                                 />
                                 
                                 <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-1"><Video className="h-3 w-3" /> YouTube Video URL</label>
                                 <input 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs"
                                    value={item.videoUrl}
                                    placeholder="https://youtube.com/watch?v=..."
                                    onChange={(e) => updateMovieItem(item.id, 'videoUrl', e.target.value)}
                                 />
                              </div>

                              <div className="space-y-4">
                                 <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-1"><ImageIcon className="h-3 w-3" /> Item Image</label>
                                 <div className="flex gap-2">
                                    <input 
                                      className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                                      value={item.imageUrl}
                                      placeholder="URL or Upload"
                                      onChange={(e) => updateMovieItem(item.id, 'imageUrl', e.target.value)}
                                    />
                                    <label className="cursor-pointer bg-gray-100 p-3 rounded-xl flex items-center justify-center">
                                      <Upload className="h-4 w-4 text-gray-500" />
                                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateMovieItem(item.id, 'imageUrl', url))} />
                                    </label>
                                 </div>
                                 {item.imageUrl && (
                                   <div className="h-20 w-full rounded-lg overflow-hidden border border-gray-50">
                                      <img src={item.imageUrl} className="h-full w-full object-cover" />
                                   </div>
                                 )}
                              </div>

                              <div className="md:col-span-2 space-y-4">
                                 <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Description</label>
                                 <textarea 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-24 text-sm"
                                    value={item.description}
                                    placeholder="Explain why this movie is a must-watch..."
                                    onChange={(e) => updateMovieItem(item.id, 'description', e.target.value)}
                                 />
                              </div>
                           </div>
                        </div>
                      ))}
                      
                      {(!editingArticle.movieList || editingArticle.movieList.length === 0) && (
                        <div className="text-center py-12 text-gray-400 italic border-2 border-dashed border-red-100 rounded-2xl">
                           No movies in this list yet. Click "Add Item" to start building your blog.
                        </div>
                      )}
                   </div>
                </div>

                <div className="space-y-4 md:col-span-2 mt-10">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">Article Body (Global Introduction/Conclusion)</label>
                  <textarea 
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl h-64 font-sans text-base leading-relaxed"
                    placeholder="General content for the blog post..."
                    value={editingArticle?.content || ''}
                    onChange={(e) => setEditingArticle({...editingArticle!, content: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-12 border-t mt-12">
                <button type="submit" className="flex-1 bg-red-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center hover:bg-red-700 shadow-xl shadow-red-200 transition-all active:scale-95">
                  <Save className="h-6 w-6 mr-2" /> Publish Now
                </button>
                <button type="button" onClick={() => setView('list')} className="px-10 bg-gray-100 text-gray-600 py-5 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                  Discard
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
