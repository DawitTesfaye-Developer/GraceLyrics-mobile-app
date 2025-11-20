import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ViewState, CategoryType, Song, AppSettings } from './types';
import { MOCK_SONGS, CATEGORIES } from './constants';
import { 
  IconCross, IconHome, IconList, IconHeart, IconSettings, 
  IconSearch, IconMusic, IconShare, IconPlay, IconPause, IconArrowLeft 
} from './components/Icons';

// --- Context & Utilities ---

const storage = {
  getFavorites: (): string[] => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  },
  toggleFavorite: (id: string) => {
    const favs = storage.getFavorites();
    const newFavs = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
    localStorage.setItem('favorites', JSON.stringify(newFavs));
    return newFavs;
  },
  getSettings: (): AppSettings => {
    try {
      const saved = localStorage.getItem('settings');
      return saved ? JSON.parse(saved) : { fontSize: 18, darkMode: false, autoScrollSpeed: 2 };
    } catch {
      return { fontSize: 18, darkMode: false, autoScrollSpeed: 2 };
    }
  },
  saveSettings: (settings: AppSettings) => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }
};

// --- Components ---

const Header = ({ 
  title, 
  onBack, 
  rightAction,
  transparent = false
}: { 
  title: string; 
  onBack?: () => void; 
  rightAction?: React.ReactNode; 
  transparent?: boolean;
}) => (
  <div className={`h-16 pt-safe flex items-center justify-between px-4 sticky top-0 z-30 transition-all duration-300 ${transparent ? 'bg-transparent' : 'bg-holy-cream/95 dark:bg-warm-dark/95 backdrop-blur-md border-b border-stone-200/50 dark:border-stone-700/50 shadow-sm'}`}>
    <div className="flex items-center gap-3">
      {onBack ? (
        <button onClick={onBack} className="p-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors text-holy-navy dark:text-holy-gold">
          <IconArrowLeft className="w-6 h-6" />
        </button>
      ) : (
         <div className="p-2 bg-holy-gold/10 rounded-full backdrop-blur-sm">
           <IconCross className="w-6 h-6 text-holy-gold" />
         </div>
      )}
      <h1 className={`font-serif text-xl font-bold tracking-wide line-clamp-1 ${transparent ? 'text-white shadow-black/20 drop-shadow-md' : 'text-holy-navy dark:text-paper-white'}`}>
        {title}
      </h1>
    </div>
    <div>
      {rightAction}
    </div>
  </div>
);

const Navigation = ({ 
  current, 
  onChange 
}: { 
  current: ViewState; 
  onChange: (v: ViewState) => void; 
}) => {
  const navItems = [
    { view: ViewState.HOME, icon: IconHome, label: 'Home' },
    { view: ViewState.CATEGORY_LIST, icon: IconList, label: 'Topics' },
    { view: ViewState.FAVORITES, icon: IconHeart, label: 'Saved' },
    { view: ViewState.SETTINGS, icon: IconSettings, label: 'Config' },
  ];

  return (
    <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-lg border-t border-stone-200 dark:border-stone-800 fixed bottom-0 w-full flex justify-around items-start pt-3 z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] pb-safe min-h-[5.5rem]">
      {navItems.map((item) => {
        const isActive = current === item.view;
        return (
          <button 
            key={item.view} 
            onClick={() => onChange(item.view)}
            className={`flex flex-col items-center gap-1.5 p-1 w-16 rounded-xl transition-all duration-300 group ${isActive ? 'text-holy-gold -translate-y-1' : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'}`}
          >
            <div className={`relative transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
              <item.icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} filled={isActive && item.view === ViewState.FAVORITES} />
              {isActive && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-holy-gold" />}
            </div>
            <span className={`text-[10px] font-sans font-bold tracking-wider uppercase transition-opacity ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const SongCard: React.FC<{ song: Song; onClick: () => void; delay?: number }> = ({ song, onClick, delay = 0 }) => (
  <div 
    onClick={onClick}
    style={{ animationDelay: `${delay}ms` }}
    className="animate-slide-up group bg-white dark:bg-stone-800 p-4 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 mb-3 flex items-center gap-4 active:scale-[0.98] transition-all duration-200 cursor-pointer hover:shadow-md hover:border-holy-gold/30"
  >
    <div className="w-12 h-12 rounded-full bg-soft-blue/30 dark:bg-stone-700 flex items-center justify-center shrink-0 group-hover:bg-holy-gold/20 transition-colors">
      <IconMusic className="w-6 h-6 text-holy-navy dark:text-holy-gold opacity-70 group-hover:scale-110 transition-transform" />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-serif font-bold text-lg text-holy-navy dark:text-paper-white truncate">{song.title}</h3>
      <p className="text-sm text-stone-500 dark:text-stone-400 truncate flex items-center gap-2">
        <span>{song.artist}</span>
        <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-600" />
        <span className="text-holy-gold text-xs font-bold uppercase tracking-wider">{song.category}</span>
      </p>
    </div>
    <div className="text-stone-300 dark:text-stone-600">
       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
    </div>
  </div>
);

// --- Views ---

const HomeView = ({ 
  onSongSelect, 
  onCategorySelect, 
  songs 
}: { 
  onSongSelect: (s: Song) => void; 
  onCategorySelect: (c: CategoryType) => void;
  songs: Song[];
}) => {
  const [search, setSearch] = useState('');
  
  const filteredSongs = useMemo(() => {
    if (!search) return songs.slice(0, 5); // Show top 5 initially
    return songs.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.artist.toLowerCase().includes(search.toLowerCase()));
  }, [search, songs]);

  return (
    <div className="pb-28 animate-fade-in min-h-screen">
      {/* Decorative Header BG */}
      <div className="relative h-64 bg-holy-navy dark:bg-black overflow-hidden rounded-b-[3rem] shadow-xl mb-6 group pt-safe">
         <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-holy-gold via-transparent to-transparent" />
         <div className="absolute top-0 right-0 p-10 opacity-10 transform group-hover:rotate-6 transition-transform duration-1000">
            <IconCross className="w-56 h-56 text-white rotate-12" />
         </div>
         
         <div className="absolute bottom-16 left-8 z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-[1px] w-8 bg-holy-gold" />
              <p className="text-holy-gold font-bold text-xs tracking-[0.2em] uppercase">Daily Devotion</p>
            </div>
            <h2 className="text-white font-serif text-4xl font-bold leading-tight">Praise Him <br/><span className="text-white/80 font-normal italic">with Gladness</span></h2>
         </div>
      </div>

      {/* Search */}
      <div className="px-6 -mt-14 relative z-10 mb-10">
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-1 flex items-center gap-3 border border-stone-100 dark:border-stone-700">
          <div className="pl-4">
            <IconSearch className="w-5 h-5 text-stone-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search hymn, lyrics, artist..."
            className="w-full py-4 bg-transparent outline-none text-lg text-holy-navy dark:text-white placeholder-stone-400 font-sans"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Carousel */}
      {!search && (
        <div className="mb-10">
          <div className="px-6 flex justify-between items-end mb-5">
            <h3 className="font-serif text-2xl font-bold text-holy-navy dark:text-paper-white">Collections</h3>
          </div>
          <div className="flex overflow-x-auto px-6 gap-4 pb-8 scrollbar-hide snap-x">
            {CATEGORIES.map((cat, i) => (
              <button 
                key={cat} 
                onClick={() => onCategorySelect(cat)}
                style={{ animationDelay: `${i * 100}ms` }}
                className="animate-slide-up snap-start shrink-0 w-36 h-36 rounded-3xl bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 shadow-sm flex flex-col items-center justify-center p-4 gap-3 hover:border-holy-gold hover:shadow-lg transition-all group active:scale-95"
              >
                <div className="w-12 h-12 rounded-full bg-stone-50 dark:bg-stone-700 flex items-center justify-center text-holy-gold group-hover:bg-holy-gold group-hover:text-white transition-colors">
                  <IconMusic className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-center text-holy-navy dark:text-stone-200 leading-tight">{cat}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent/Search Results */}
      <div className="px-6">
        <h3 className="font-serif text-2xl font-bold text-holy-navy dark:text-paper-white mb-6">
          {search ? 'Search Results' : 'New & Trending'}
        </h3>
        <div className="flex flex-col">
          {filteredSongs.map((song, idx) => (
            <SongCard key={song.id} song={song} onClick={() => onSongSelect(song)} delay={idx * 50} />
          ))}
          {filteredSongs.length === 0 && (
             <div className="text-center py-12 text-stone-400">
               <p>No songs found matching "{search}".</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CategoryListView = ({ 
  categories, 
  onSelect 
}: { 
  categories: CategoryType[]; 
  onSelect: (c: CategoryType) => void; 
}) => (
  <div className="pb-28 animate-fade-in px-6 pt-6">
     <div className="grid grid-cols-1 gap-4">
       {categories.map((cat, idx) => (
         <button 
          key={cat}
          onClick={() => onSelect(cat)}
          className="h-28 bg-white dark:bg-stone-800 rounded-3xl border-l-[6px] border-holy-gold shadow-sm flex items-center px-8 hover:shadow-md active:scale-[0.98] transition-all"
          style={{ animationDelay: `${idx * 50}ms` }}
         >
            <div className="flex-1 text-left">
              <h3 className="font-serif text-2xl font-bold text-holy-navy dark:text-paper-white">{cat}</h3>
              <p className="text-xs text-stone-400 uppercase tracking-wider mt-1 font-bold">Browsable Collection</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-stone-50 dark:bg-stone-700 flex items-center justify-center">
               <IconArrowLeft className="w-5 h-5 text-stone-400 rotate-180" />
            </div>
         </button>
       ))}
     </div>
  </div>
);

const SongListView = ({ 
  songs, 
  onSelect 
}: { 
  songs: Song[]; 
  onSelect: (s: Song) => void; 
}) => (
  <div className="pb-28 animate-slide-up px-6 pt-6">
     {songs.map((song, idx) => (
       <SongCard key={song.id} song={song} onClick={() => onSelect(song)} delay={idx * 50} />
     ))}
     {songs.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-stone-400">
          <IconMusic className="w-16 h-16 mb-4 opacity-20" />
          <p>No songs in this collection yet.</p>
        </div>
     )}
  </div>
);

const FavoritesView = ({ 
  songs, 
  favorites, 
  onSelect 
}: { 
  songs: Song[]; 
  favorites: string[]; 
  onSelect: (s: Song) => void; 
}) => {
  const favSongs = songs.filter(s => favorites.includes(s.id));
  return (
    <div className="pb-28 animate-fade-in px-6 pt-6">
      {favSongs.length > 0 ? (
        favSongs.map((song, idx) => (
          <SongCard key={song.id} song={song} onClick={() => onSelect(song)} delay={idx * 50} />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-stone-400">
          <div className="w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <IconHeart className="w-10 h-10 text-stone-300" />
          </div>
          <h3 className="text-xl font-bold text-holy-navy dark:text-stone-200 mb-2 font-serif">No Favorites Yet</h3>
          <p className="text-center max-w-xs text-sm text-stone-500">Tap the heart icon on any lyric page to save it here for offline worship.</p>
        </div>
      )}
    </div>
  );
};

const SettingsView = ({ 
  settings, 
  onUpdate 
}: { 
  settings: AppSettings; 
  onUpdate: (s: AppSettings) => void; 
}) => (
  <div className="pb-28 animate-fade-in px-6 pt-8">
    <section className="bg-white dark:bg-stone-800 rounded-3xl p-6 shadow-sm mb-6 border border-stone-100 dark:border-stone-700">
      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-8 flex items-center gap-2">
        <IconSettings className="w-4 h-4" /> Appearance
      </h3>
      
      <div className="flex justify-between items-center mb-10">
        <span className="font-serif text-xl text-holy-navy dark:text-paper-white">Night Mode</span>
        <button 
          onClick={() => onUpdate({ ...settings, darkMode: !settings.darkMode })}
          className={`w-16 h-9 rounded-full p-1 transition-all duration-300 ${settings.darkMode ? 'bg-holy-gold' : 'bg-stone-200'}`}
        >
          <div className={`w-7 h-7 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${settings.darkMode ? 'translate-x-7' : 'translate-x-0'}`}>
             {settings.darkMode ? <div className="w-2 h-2 bg-holy-navy rounded-full" /> : <div className="w-2 h-2 bg-orange-300 rounded-full" />}
          </div>
        </button>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-4">
           <span className="font-serif text-xl text-holy-navy dark:text-paper-white">Font Size</span>
           <span className="text-holy-gold font-bold font-mono">{settings.fontSize}px</span>
        </div>
        <input 
          type="range" 
          min="14" 
          max="36" 
          step="2"
          value={settings.fontSize}
          onChange={(e) => onUpdate({ ...settings, fontSize: parseInt(e.target.value) })}
          className="w-full h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-holy-gold hover:accent-yellow-600 transition-all"
        />
        <div className="mt-6 p-6 bg-holy-cream dark:bg-warm-dark rounded-xl border border-stone-200 dark:border-stone-600 shadow-inner">
           <p className="font-serif text-holy-navy dark:text-paper-white transition-all text-center leading-relaxed" style={{ fontSize: `${settings.fontSize}px` }}>
             Amazing grace! How sweet the sound...
           </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-4">
           <span className="font-serif text-xl text-holy-navy dark:text-paper-white">Auto Scroll Speed</span>
           <span className="text-holy-gold font-bold font-mono">{settings.autoScrollSpeed}x</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="5" 
          step="1"
          value={settings.autoScrollSpeed}
          onChange={(e) => onUpdate({ ...settings, autoScrollSpeed: parseInt(e.target.value) })}
          className="w-full h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-holy-gold hover:accent-yellow-600 transition-all"
        />
      </div>
    </section>

    <section className="bg-white dark:bg-stone-800 rounded-3xl p-8 shadow-sm border border-stone-100 dark:border-stone-700">
      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-6">About</h3>
      <div className="text-center">
         <div className="w-20 h-20 bg-holy-cream dark:bg-warm-dark rounded-full mx-auto flex items-center justify-center mb-4 border-4 border-holy-gold/20">
            <IconCross className="w-10 h-10 text-holy-gold" />
         </div>
         <h2 className="font-serif font-bold text-2xl text-holy-navy dark:text-paper-white mb-1">GraceLyrics</h2>
         <p className="text-stone-400 text-xs uppercase tracking-widest mb-6">Mobile Edition v1.0.2</p>
         <p className="text-stone-600 dark:text-stone-400 italic text-sm leading-loose font-serif relative px-4">
           <span className="absolute -top-2 left-0 text-4xl text-holy-gold/20 font-serif">"</span>
           Let the message of Christ dwell among you richly as you teach and admonish one another with all wisdom through psalms, hymns, and songs from the Spirit.
           <span className="absolute -bottom-4 right-0 text-4xl text-holy-gold/20 font-serif">"</span>
         </p>
         <p className="mt-4 text-xs font-bold text-stone-400">— Colossians 3:16</p>
      </div>
    </section>
  </div>
);

const LyricsView = ({ 
  song, 
  settings, 
  isFavorite, 
  onToggleFavorite 
}: { 
  song: Song; 
  settings: AppSettings;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Smooth Auto-scroll logic with RequestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = 0;
    
    const scroll = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      
      // Throttle to ~60fps
      const deltaTime = timestamp - lastTimestamp;
      if (deltaTime >= 16) {
        if (scrollRef.current) {
           const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
           
           // Stop if reached bottom
           if (scrollTop + clientHeight >= scrollHeight - 1) {
             setIsAutoScrolling(false);
           } else {
             // Calculate pixel movement based on speed setting
             // Speed 0 = 0px, Speed 1 = 0.5px, Speed 5 = 2.5px per frame
             const moveAmount = settings.autoScrollSpeed === 0 ? 0 : (0.3 * settings.autoScrollSpeed);
             if (moveAmount > 0) {
                scrollRef.current.scrollTop += moveAmount;
             }
           }
        }
        lastTimestamp = timestamp;
      }
      
      if (isAutoScrolling) {
        animationFrameId = requestAnimationFrame(scroll);
      }
    };

    if (isAutoScrolling && settings.autoScrollSpeed > 0) {
      animationFrameId = requestAnimationFrame(scroll);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isAutoScrolling, settings.autoScrollSpeed]);

  // Audio simulation logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: song.title,
          text: `${song.title} - ${song.artist}\n\n${song.lyrics}\n\nShared via GraceLyrics App`
        });
      } catch (err) { console.log('Share cancelled'); }
    } else {
      // Fallback
      alert(`Copied to clipboard:\n${song.title}`);
    }
  };

  return (
    <div className="h-full flex flex-col bg-paper-white dark:bg-warm-dark animate-slide-up relative z-40">
      
      {/* Action Bar (Floating) */}
      <div className="absolute bottom-10 right-6 flex flex-col gap-4 z-50 pb-safe">
        <button 
          onClick={() => setIsAutoScrolling(!isAutoScrolling)}
          className={`w-14 h-14 rounded-full shadow-xl border border-stone-100 dark:border-stone-600 flex items-center justify-center transition-all duration-300 ${isAutoScrolling ? 'bg-holy-gold text-white animate-pulse' : 'bg-white dark:bg-stone-800 text-holy-navy dark:text-stone-200'}`}
        >
          {isAutoScrolling ? (
            <IconPause className="w-6 h-6" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
          )}
        </button>
        
        <button 
          onClick={onToggleFavorite}
          className="w-14 h-14 rounded-full bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-600 shadow-xl flex items-center justify-center text-rose-500 transition-transform hover:scale-110 active:scale-90"
        >
          <IconHeart className="w-7 h-7" filled={isFavorite} />
        </button>

        <button 
          onClick={handleShare}
          className="w-14 h-14 rounded-full bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-600 shadow-xl flex items-center justify-center text-sky-500 transition-transform hover:scale-110 active:scale-90"
        >
          <IconShare className="w-6 h-6" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto lyrics-scroll px-6 pb-48 pt-6 overscroll-contain"
      >
        {/* Song Meta */}
        <div className="text-center mb-12 border-b-2 border-stone-100 dark:border-stone-700/50 pb-8 relative">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-holy-gold/20 rounded-full" />
          <h2 className="font-serif text-4xl font-bold text-holy-navy dark:text-holy-gold mb-3 mt-4 leading-tight">{song.title}</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-widest">{song.artist}</p>
          
          {/* Audio Player Simulation */}
          <div className="mt-8 bg-white dark:bg-stone-800 rounded-2xl p-3 shadow-sm flex items-center gap-4 w-full max-w-sm mx-auto border border-stone-100 dark:border-stone-700">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-holy-navy text-white flex items-center justify-center shadow-md hover:bg-holy-gold transition-colors shrink-0"
            >
              {isPlaying ? <IconPause className="w-5 h-5" /> : <IconPlay className="w-5 h-5 ml-1" />}
            </button>
            <div className="flex-1 min-w-0">
               <div className="flex justify-between text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  <span>{isPlaying ? 'Playing' : 'Preview'}</span>
                  <span>{Math.floor(progress)}%</span>
               </div>
               <div className="h-2 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-holy-gold transition-all duration-100 ease-linear" 
                   style={{ width: `${progress}%` }}
                 />
               </div>
            </div>
          </div>
        </div>

        {/* Lyrics Text */}
        <div 
          className="font-serif text-holy-navy dark:text-paper-white leading-relaxed whitespace-pre-wrap text-center px-2"
          style={{ fontSize: `${settings.fontSize}px`, lineHeight: '1.9' }}
        >
          {song.lyrics}
        </div>

        <div className="mt-20 flex flex-col items-center gap-4 opacity-30">
           <div className="w-full h-[1px] bg-stone-300 max-w-[100px]" />
           <IconCross className="w-8 h-8 text-stone-400 dark:text-stone-500" />
           <div className="w-full h-[1px] bg-stone-300 max-w-[100px]" />
        </div>
      </div>
    </div>
  );
};

// --- Main App Container ---

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());
  const [favorites, setFavorites] = useState<string[]>(storage.getFavorites());
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  // Theme Management
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storage.saveSettings(settings);
  }, [settings.darkMode]);

  useEffect(() => {
    storage.saveSettings(settings);
  }, [settings]);

  // Navigation Handlers
  const navigateTo = (v: ViewState) => {
    setView(v);
    if (v === ViewState.HOME) {
      setSelectedCategory(null);
      setSelectedSong(null);
    }
  };

  const handleCategorySelect = (cat: CategoryType) => {
    setSelectedCategory(cat);
    setView(ViewState.SONG_LIST);
  };

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song);
    setView(ViewState.LYRICS);
  };

  const toggleFavorite = () => {
    if (selectedSong) {
      const newFavs = storage.toggleFavorite(selectedSong.id);
      setFavorites(newFavs);
    }
  };

  // Header Logic
  const getHeaderProps = () => {
    switch (view) {
      case ViewState.HOME: return { title: 'GraceLyrics', onBack: undefined, transparent: true };
      case ViewState.CATEGORY_LIST: return { title: 'Song Categories', onBack: undefined };
      case ViewState.FAVORITES: return { title: 'My Saved Songs', onBack: undefined };
      case ViewState.SETTINGS: return { title: 'Settings', onBack: undefined };
      case ViewState.SONG_LIST: return { title: selectedCategory || 'Songs', onBack: () => setView(ViewState.CATEGORY_LIST) };
      case ViewState.LYRICS: return { title: 'Now Reading', onBack: () => setView(selectedCategory ? ViewState.SONG_LIST : ViewState.HOME) };
      default: return { title: 'GraceLyrics', onBack: undefined };
    }
  };

  const headerProps = getHeaderProps();

  return (
    <div className={`h-full flex flex-col ${settings.darkMode ? 'dark' : ''}`}>
      <div className="flex-1 flex flex-col h-full bg-holy-cream dark:bg-warm-dark transition-colors duration-500 relative">
        
        {/* Header (Conditionally Rendered for Home to be absolute/transparent) */}
        {view === ViewState.HOME ? (
           <div className="absolute top-0 left-0 right-0 z-40">
             <Header {...headerProps} />
           </div>
        ) : (
           <Header {...headerProps} />
        )}

        <main className="flex-1 overflow-y-auto relative scrollbar-hide bg-transparent overscroll-contain">
          {view === ViewState.HOME && (
            <HomeView 
              onCategorySelect={handleCategorySelect}
              onSongSelect={handleSongSelect}
              songs={MOCK_SONGS}
            />
          )}

          {view === ViewState.CATEGORY_LIST && (
            <CategoryListView 
              categories={CATEGORIES} 
              onSelect={handleCategorySelect} 
            />
          )}

          {view === ViewState.SONG_LIST && selectedCategory && (
            <SongListView 
              songs={MOCK_SONGS.filter(s => s.category === selectedCategory)}
              onSelect={handleSongSelect}
            />
          )}

          {view === ViewState.FAVORITES && (
            <FavoritesView 
              songs={MOCK_SONGS}
              favorites={favorites}
              onSelect={handleSongSelect}
            />
          )}

          {view === ViewState.SETTINGS && (
            <SettingsView 
              settings={settings}
              onUpdate={setSettings}
            />
          )}

          {view === ViewState.LYRICS && selectedSong && (
            <div className="absolute inset-0 z-50 bg-white dark:bg-warm-dark">
              <Header {...headerProps} />
              <LyricsView 
                song={selectedSong}
                settings={settings}
                isFavorite={favorites.includes(selectedSong.id)}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          )}
        </main>

        {/* Only show Nav Bar if not reading lyrics */}
        {view !== ViewState.LYRICS && (
          <Navigation current={view} onChange={navigateTo} />
        )}
      </div>
    </div>
  );
}