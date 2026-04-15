import { useState, useEffect } from 'react';
import { 
  Newspaper, 
  ExternalLink, 
  Loader2, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';
import { getHealthNews, generateHealthImage } from '../services/geminiService';

function NewsImage({ item }: { item: any }) {
  const [imgSrc, setImgSrc] = useState<string | null>(item.imageUrl || null);
  const [generating, setGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);

  const getFallback = () => `https://picsum.photos/seed/${encodeURIComponent(item.title)}/800/400`;

  useEffect(() => {
    if (!item.imageUrl) {
      const fetchAiImage = async () => {
        setGenerating(true);
        try {
          const aiImage = await generateHealthImage(item.title);
          if (aiImage) {
            setImgSrc(aiImage);
          } else {
            setImgSrc(getFallback());
          }
        } catch (err) {
          console.error("AI Image generation failed:", err);
          setImgSrc(getFallback());
        } finally {
          setGenerating(false);
        }
      };
      fetchAiImage();
    }
  }, [item.imageUrl, item.title]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getFallback());
    }
  };

  return (
    <div className="relative h-full w-full bg-slate-100">
      {generating && (
        <div className="absolute inset-0 z-10 bg-slate-900/10 backdrop-blur-sm flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      )}
      <img 
        src={imgSrc || getFallback()} 
        alt={item.title}
        onError={handleError}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default function HealthNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await getHealthNews();
        setNews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Health News & Trends</h2>
          <p className="text-slate-500 mt-2 text-lg">Stay updated with the latest medical breakthroughs and wellness updates.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium"
          />
        </div>
      </header>

      <section className="relative">
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center text-slate-400 space-y-4 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <Loader2 className="w-16 h-16 animate-spin text-emerald-500" />
            <p className="text-xl font-bold">Scanning global health feeds...</p>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredNews.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
              >
                <div className="relative h-48 -mx-10 -mt-10 mb-8 overflow-hidden rounded-t-[3rem]">
                  <NewsImage item={item} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>

                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full uppercase tracking-widest">
                      {item.category || 'Medical Update'}
                    </span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors leading-tight">
                  {item.title}
                </h3>
                
                <p className="text-slate-500 leading-relaxed mb-8 flex-1">
                  {item.summary}
                </p>
                
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all"
                  >
                    Read Full Article <ArrowRight className="w-5 h-5" />
                  </a>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">AI Verified</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center text-slate-400 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <Newspaper className="w-16 h-16 mx-auto mb-4 opacity-10" />
            <p className="text-xl font-medium">No news stories found matching your search.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-emerald-600 font-bold hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </section>

      <section className="bg-slate-900 p-12 rounded-[3.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <TrendingUp className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-black text-white mb-6">Subscribe to Updates</h3>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Get the latest health trends and medical breakthroughs delivered directly to your portal every morning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all"
            />
            <button className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-900/20">
              Notify Me
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
