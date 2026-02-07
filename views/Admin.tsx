
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Save, X, LayoutDashboard, Settings, 
  LogOut, CheckCircle, Globe, Users, HelpCircle, Film 
} from 'lucide-react';
import { Article, Category, Platform, SiteConfig } from '../types';
import { 
  getArticles, saveArticle, deleteArticle, 
  getSiteConfig, saveSiteConfig 
} from '../services/storage';

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
      faqs: [{ q: '', a: '' }]
    });
    setView('edit');
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
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
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
                {/* Basic SEO Fields */}
                <div className="space-y-4 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">Content Title (Focus Keyword Here)</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Pushpa 2 OTT Release Date Leaked?"
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
                  <input 
                    required
                    type="text" 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs"
                    value={editingArticle?.slug || ''}
                    onChange={(e) => setEditingArticle({...editingArticle!, slug: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">Main Category</label>
                  <select 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700"
                    value={editingArticle?.category}
                    onChange={(e) => setEditingArticle({...editingArticle!, category: e.target.value as Category})}
                  >
                    <option value={Category.OTT}>OTT Releases</option>
                    <option value={Category.MOVIE}>Movie Releases</option>
                    <option value={Category.NEWS}>Cinema News</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">Distribution Platform</label>
                  <select 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl"
                    value={editingArticle?.platform}
                    onChange={(e) => setEditingArticle({...editingArticle!, platform: e.target.value as Platform})}
                  >
                    {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">Expected Release Date</label>
                  <input 
                    type="date" 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl"
                    value={editingArticle?.releaseDate}
                    onChange={(e) => setEditingArticle({...editingArticle!, releaseDate: e.target.value})}
                  />
                </div>

                <div className="space-y-4 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">Feature Image URL</label>
                  <input 
                    required
                    type="text" 
                    placeholder="https://..."
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl"
                    value={editingArticle?.imageUrl || ''}
                    onChange={(e) => setEditingArticle({...editingArticle!, imageUrl: e.target.value})}
                  />
                </div>

                <div className="space-y-4 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter flex items-center gap-2"><Users className="h-4 w-4" /> Cast & Crew (Comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="Allu Arjun, Rashmika Mandanna, Fahadh Faasil"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl"
                    value={editingArticle?.cast?.join(', ') || ''}
                    onChange={(e) => updateListField('cast', e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">Languages (Comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="Hindi, Telugu, Tamil"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl"
                    value={editingArticle?.language?.join(', ') || ''}
                    onChange={(e) => updateListField('language', e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">Genres (Comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="Action, Thriller"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl"
                    value={editingArticle?.genre?.join(', ') || ''}
                    onChange={(e) => updateListField('genre', e.target.value)}
                  />
                </div>

                <div className="space-y-4 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">Meta Description / Excerpt</label>
                  <textarea 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl h-24"
                    placeholder="Brief summary for social sharing and search results..."
                    value={editingArticle?.excerpt || ''}
                    onChange={(e) => setEditingArticle({...editingArticle!, excerpt: e.target.value})}
                  />
                </div>

                <div className="space-y-4 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-tighter">Article Body (HTML Supported)</label>
                  <textarea 
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl h-96 font-sans text-base leading-relaxed"
                    placeholder="Write your amazing story here..."
                    value={editingArticle?.content || ''}
                    onChange={(e) => setEditingArticle({...editingArticle!, content: e.target.value})}
                  />
                </div>

                <div className="space-y-4 md:col-span-2">
                   <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2 mt-8"><HelpCircle className="h-5 w-5 text-red-600" /> FAQ Section</h3>
                   <div className="space-y-4">
                      {editingArticle?.faqs?.map((faq, idx) => (
                        <div key={idx} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                           <div className="flex-1 space-y-2">
                              <input 
                                placeholder="Question" 
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm font-bold"
                                value={faq.q}
                                onChange={(e) => {
                                  const newFaqs = [...(editingArticle.faqs || [])];
                                  newFaqs[idx].q = e.target.value;
                                  setEditingArticle({...editingArticle, faqs: newFaqs});
                                }}
                              />
                              <textarea 
                                placeholder="Answer" 
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm h-20"
                                value={faq.a}
                                onChange={(e) => {
                                  const newFaqs = [...(editingArticle.faqs || [])];
                                  newFaqs[idx].a = e.target.value;
                                  setEditingArticle({...editingArticle, faqs: newFaqs});
                                }}
                              />
                           </div>
                           <button 
                            type="button"
                            onClick={() => {
                              const newFaqs = (editingArticle.faqs || []).filter((_, i) => i !== idx);
                              setEditingArticle({...editingArticle, faqs: newFaqs});
                            }}
                            className="p-2 text-gray-400 hover:text-red-600"
                           >
                             <Trash2 className="h-4 w-4" />
                           </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={() => setEditingArticle({...editingArticle!, faqs: [...(editingArticle?.faqs || []), {q: '', a: ''}]})}
                        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold hover:border-red-300 hover:text-red-400 transition-all flex items-center justify-center"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add FAQ Item
                      </button>
                   </div>
                </div>
              </div>

              <div className="flex gap-4 pt-12 border-t mt-12">
                <button type="submit" className="flex-1 bg-red-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center hover:bg-red-700 shadow-xl shadow-red-200 transition-all active:scale-95">
                  <Save className="h-6 w-6 mr-2" /> Finalize & Publish
                </button>
                <button type="button" onClick={() => setView('list')} className="px-10 bg-gray-100 text-gray-600 py-5 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                  Discard Draft
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
