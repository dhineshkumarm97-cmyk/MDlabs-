import { useState, useEffect, FormEvent, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import initialPrompts from '../../prompts-data.json';
import { 
  UserAnswers, 
  TrendingPrompt 
} from '../types';
import { 
  Plus, 
  Copy, 
  Check, 
  Compass, 
  Image as ImageIcon, 
  Sparkles, 
  Heart, 
  Share2, 
  Trash2, 
  Bookmark, 
  Search,
  ChevronDown,
  Info,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 16
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 14
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: {
      duration: 0.15
    }
  }
};

const WALLPAPER_THEMES = [
  {
    name: "Cosmic Neon Horizon",
    tags: ["cosmic", "neon", "galaxy", "stellar", "space"],
    prompt: "A beautiful high-definition mobile wallpaper of a cosmic neon horizon, glowing celestial galaxies merging with futuristic glass spires, high contrast purple and electric teal, vapor aesthetic, cinematic lighting, 8k resolution, ultra-detailed --ar 9:16",
    ids: [
      "photo-1419242902214-272b3f66ee7a", "photo-1518531933037-91b2f5f229cc", "photo-1519681393784-d120267933ba",
      "photo-1446776811953-b23d57bd21aa", "photo-1506318137071-a8e063b4bec0", "photo-1541701494587-cb58502866ab",
      "photo-1451187580459-43490279c0fa", "photo-1502134249126-9f3755a50d78", "photo-1538370965046-79c0d6907d47"
    ]
  },
  {
    name: "Cyberpunk Terminal Rain",
    tags: ["cyberpunk", "neon", "rain", "street", "city"],
    prompt: "Intricate command-line terminal on a futuristic cyber visor, heavy midnight rain on glowing glass street signs, reflections, atmospheric cyberpunk neon glow, retrofuturistic, unreal engine render, hyper-detailed --ar 9:16",
    ids: [
      "photo-1525547719571-a2d4ac8945e2", "photo-1504384308090-c894fdcc538d", "photo-1542831371-29b0f74f9713",
      "photo-1515621061946-eff1c2a352bd", "photo-1618843479313-40f8afb4b4d8", "photo-1617531653332-bd46c24f2068",
      "photo-1509198397868-475647b2a1e5", "photo-1511512578047-dfb367046420", "photo-1511512578047-dfb367332145"
    ]
  },
  {
    name: "Zen Minimalist Dunes",
    tags: ["zen", "minimal", "peace", "abstract", "pastel"],
    prompt: "Stunning minimalist sand dunes stretching under a peaceful pastel sunset sky, clean elegant organic lines, abstract tranquil atmosphere, high end soft focus nature photography, award-winning composition --ar 9:16",
    ids: [
      "photo-1507525428034-b723cf961d3e", "photo-1533090161767-e6ffed986c88", "photo-1528459801416-a9e53bbf4e17",
      "photo-1501854140801-50d01698950b", "photo-1540206351-d6465b3ac5c1", "photo-1509316975850-ff9c5edd0cd9",
      "photo-1504851149312-7a075b496cc7", "photo-1518156677180-95a2893f3e9f", "photo-1500485035595-cbeaf2741630"
    ]
  },
  {
    name: "Mystical Emerald Forest",
    tags: ["forest", "nature", "myth", "foliage", "trees"],
    prompt: "Dreamy dense emerald forest path, ancient gnarled oak trees glowing with tiny magical spores, soft warm sun rays breaking through foliage, fantasy landscape illustration, cozy ambient mood --ar 9:16",
    ids: [
      "photo-1447752875215-b2761acb3c5d", "photo-1441974231531-c6227db76b6e", "photo-1469474968028-56623f02e42e",
      "photo-1513836279014-a89f7a76ae86", "photo-1473448912268-2022ce9509d8", "photo-1502082553048-f009c37129b9",
      "photo-1518531933555-d3d5fdcc558d", "photo-1511497584788-876760111969", "photo-1511497584788-876760111970"
    ]
  },
  {
    name: "Retro Synthwave Grid",
    tags: ["retro", "synthwave", "vaporwave", "sunset", "90s"],
    prompt: "Classic 1980s synthwave grid road rising toward a glowing neon wireframe horizon, wireframe sunrise, vibrant cyberpunk sunset, retro outrun aesthetic background, 3d retrowave vector render --ar 9:16",
    ids: [
      "photo-1557683316-973673baf926", "photo-1563089145-599997674d42", "photo-1579546929518-9e396f3cc809",
      "photo-1618005182384-a83a8bd57fbe", "photo-1550684848-fac1c5b4e853", "photo-1554080353-a576cf803bda",
      "photo-1601042879364-f3947d3f9c16", "photo-1561070791-2526d30994b5", "photo-1561070791-2526d30994b6"
    ]
  },
  {
    name: "Ethereal Magical Sky",
    tags: ["dreamy", "magic", "pastel", "clouds", "airway"],
    prompt: "Ethereal magical sky bathed in dreamy pink and golden sunset rays, majestic fluffy cumulus clouds parting, warm volumetric lighting, angelic peaceful heaven background, majestic landscape, 4k --ar 9:16",
    ids: [
      "photo-1483728642387-6c3bdd6c93e5", "photo-1518709268805-4e9042af9f23", "photo-1494790108377-be9c29b29330",
      "photo-1517582080012-f24e2ec5ad92", "photo-1532980400857-e8d9d2757f58", "photo-1516339901601-2e1d62dc0c45",
      "photo-1520690214124-2405c5217036", "photo-1502790371629-27b4b3aa3453", "photo-1502790371629-27b4b3aa3454"
    ]
  },
  {
    name: "Abstract Fluid Aura",
    tags: ["ink", "fluid", "abstract", "art", "psych"],
    prompt: "Beautiful premium fluid acrylic pour art showcasing a swirling aura of liquid metallic gold, emerald green, and rich navy blue, marble fluid dynamics, abstract modern art wallpaper --ar 9:16",
    ids: [
      "photo-1541701494587-cb58502866ab", "photo-1618005182384-a83a8bd57fbe", "photo-1528459801416-a9e53bbf4e17",
      "photo-1554080353-a576cf803bda", "photo-1579783900882-c0d3dad7b119", "photo-1550684848-fac1c5b4e853",
      "photo-1541625602330-2277a4c46182", "photo-1550537687-c91072c4792d", "photo-1550537687-c91072c4792e"
    ]
  },
  {
    name: "Epic Flame Samurai",
    tags: ["samurai", "anime", "action", "epic", "combat"],
    prompt: "Dynamic combat pose of a dual-wielding fire samurai, legendary glowing crimson flames trailing his blades, ink wash splatter art, splash artwork, high velocity action pose, epic fantasy concept art --ar 9:16",
    ids: [
      "photo-1548102245-c7bf7c569ff4", "photo-1509114397022-ed747cca3f65", "photo-1600585154340-be6161a56a0c",
      "photo-1486915309851-b0cc1f8a0084", "photo-1534447677768-be436bb09401", "photo-1518709268805-4e9042af9f23",
      "photo-1578632767115-351597cf2477", "photo-1509114397022-ed747cca3f66", "photo-1509114397022-ed747cca3f67"
    ]
  },
  {
    name: "Luxury Elite Lifestyle",
    tags: ["luxury", "car", "yacht", "rich", "mansion"],
    prompt: "Super sleek million-dollar hypercar resting infront of an ultra-modern steel & glass architectural villa at sunset, quiet pool reflections, cinematic high-class lifestyle wallpaper, 8k --ar 9:16",
    ids: [
      "photo-1525609004556-c46c7d6cf0a3", "photo-1567899378494-47b22a2ae96a", "photo-1546182990-dffeafbe841d",
      "photo-1540962351504-03099e0a754b", "photo-1614162692292-7ac56d7f7f1e", "photo-1600585154340-be6161a56a0c",
      "photo-1512917774080-9991f1c4c750", "photo-1505691938895-1758d7feb511", "photo-1505691938895-1758d7feb512"
    ]
  }
];

const generateWallpapers = (): TrendingPrompt[] => {
  const seededWallpapers: TrendingPrompt[] = [];
  const totalTarget = 295;
  for (let i = 1; i <= totalTarget; i++) {
    const theme = WALLPAPER_THEMES[(i - 1) % WALLPAPER_THEMES.length];
    const idSuffix = theme.ids[(i - 1) % theme.ids.length];
    const imageUrl = `https://images.unsplash.com/${idSuffix}?auto=format&fit=crop&w=640&h=1136&q=80`;
    
    seededWallpapers.push({
      id: `wallpaper-seed-${i}`,
      title: `${theme.name} #${Math.ceil(i / WALLPAPER_THEMES.length)}`,
      promptText: theme.prompt,
      imageUrl: imageUrl,
      category: "AI Wallpapers",
      likes: Math.floor(Math.sin(i) * 200) + 250,
      tags: [...theme.tags, "wallpaper", "viral", "4k"]
    });
  }
  return seededWallpapers;
};

const repairPromptItem = (p: any): TrendingPrompt => {
  let imageUrl = p.imageUrl || "";
  
  if (!imageUrl || imageUrl.includes("picsum.photos")) {
    const category = p.category || "AI Fantasy Art";
    let fallbackId = "photo-1579783900882-c0d3dad7b119";
    if (category === "Cinematic Portraits") {
      fallbackId = "photo-1509631179647-0177331693ae";
    } else if (category === "AI Fantasy Art") {
      fallbackId = "photo-1518709268805-4e9042af9f23";
    } else if (category === "Couple & Love Aesthetic") {
      fallbackId = "photo-1516589178581-6cd7833ae3b2";
    } else if (category === "Travel & Nature") {
      fallbackId = "photo-1469474968028-56623f02e42e";
    } else if (category === "Luxury Lifestyle") {
      fallbackId = "photo-1614162692292-7ac56d7f7f1e";
    } else if (category === "Motivational & Success") {
      fallbackId = "photo-1506126613408-eca07ce68773";
    } else if (category === "Devotional & Spiritual") {
      fallbackId = "photo-1609137144813-f93fb2380584";
    } else if (category === "Viral Poster Designs") {
      fallbackId = "photo-1561070791-2526d30994b5";
    } else if (category === "Food Photography") {
      fallbackId = "photo-1476224203421-9ac39bcb3327";
    } else if (category === "Future & Sci-Fi") {
      fallbackId = "photo-1511512578047-dfb367046420";
    } else if (category === "AI Wallpapers") {
      fallbackId = "photo-1419242902214-272b3f66ee7a";
    }
    
    imageUrl = `https://images.unsplash.com/${fallbackId}?auto=format&fit=crop&w=800&q=80`;
  }
  
  return {
    id: p.id,
    title: p.title || "Unnamed Reference",
    promptText: p.promptText || p.prompt || "Perfect high aesthetic details, cinematic masterpiece, highly detailed",
    imageUrl: imageUrl,
    category: p.category || "AI Fantasy Art",
    likes: typeof p.likes === 'number' ? p.likes : 120,
    tags: Array.isArray(p.tags) ? p.tags : ["creative", "midjourney"]
  };
};

const repairAndSeedPrompts = (rawPrompts: any[]): TrendingPrompt[] => {
  const seededWallpapers = generateWallpapers();
  const otherItems = Array.isArray(rawPrompts) ? rawPrompts.filter(p => {
    if (!p) return false;
    if (p.category === "AI Wallpapers" && p.id && p.id.startsWith("wallpaper-seed-")) {
      return false;
    }
    return true;
  }) : [];
  
  const repairedOtherItems = otherItems.map(repairPromptItem);
  return [...seededWallpapers, ...repairedOtherItems];
};

interface PromptGalleryProps {
  answers: UserAnswers;
  onReset: () => void;
}

export default function PromptGallery({ answers, onReset }: PromptGalleryProps) {
  const [prompts, setPrompts] = useState<TrendingPrompt[]>(() => {
    const localData = localStorage.getItem('mdlabs_prompts_db');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          return repairAndSeedPrompts(parsed);
        }
      } catch (err) {
        console.error('Failed to parse local prompts dataset cache', err);
      }
    }
    return repairAndSeedPrompts(initialPrompts as TrendingPrompt[]);
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Previewing Full Immersive Image State
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<TrendingPrompt | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCategory, setNewCategory] = useState('Cinematic Portraits');
  const [newTags, setNewTags] = useState('');

  // Toast notifications for clipboard copies
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Track prompt IDs uploaded by the current local browser
  const [myUploadedPromptIds, setMyUploadedPromptIds] = useState<string[]>([]);

  // Load from database if any exist
  useEffect(() => {
    fetchPrompts();
    const saved = localStorage.getItem('mdlabs_my_prompt_ids');
    if (saved) {
      try {
        setMyUploadedPromptIds(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse my uploaded prompt ids', e);
      }
    }
  }, []);

  // Keyboard accessibility for Esc key on fullscreen preview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPreviewImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchPrompts = async () => {
    try {
      const res = await fetch('/api/prompts');
      if (res.ok) {
        const data = await res.json();
        const repaired = repairAndSeedPrompts(data);
        setPrompts(repaired);
        localStorage.setItem('mdlabs_prompts_db', JSON.stringify(repaired));
      } else {
        throw new Error('API returned error status');
      }
    } catch (e) {
      console.warn('API fetch not available, loading from local storage/preset fallback', e);
      const localData = localStorage.getItem('mdlabs_prompts_db');
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          if (parsed && Array.isArray(parsed) && parsed.length > 0) {
            const repaired = repairAndSeedPrompts(parsed);
            setPrompts(repaired);
            return;
          }
        } catch (err) {
          console.error('Failed to parse local prompts dataset cache', err);
        }
      }
      // If local storage is empty, initialize with pre-seeded database
      const repaired = repairAndSeedPrompts(initialPrompts as TrendingPrompt[]);
      setPrompts(repaired);
      localStorage.setItem('mdlabs_prompts_db', JSON.stringify(repaired));
    }
  };

  const handleAddPrompt = async (e: FormEvent) => {
    e.preventDefault();

    const finalImageUrl = newImageUrl.trim();
    const finalPromptText = newPromptText.trim();
    const tagsArray = newTags ? newTags.split(',').map(t => t.trim()).filter(Boolean) : [newCategory.toLowerCase(), 'creative'];

    const newPromptObject: TrendingPrompt = {
      id: `prompt-client-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: newTitle.trim() || `Prompt #${prompts.length + 1}`,
      promptText: finalPromptText,
      imageUrl: finalImageUrl,
      category: newCategory,
      likes: 0,
      tags: tagsArray
    };

    // Optimistically update local React state and cache first
    setPrompts(prev => {
      const updated = [newPromptObject, ...prev];
      localStorage.setItem('mdlabs_prompts_db', JSON.stringify(updated));
      return updated;
    });

    setMyUploadedPromptIds(prev => {
      const updated = [...prev, newPromptObject.id];
      localStorage.setItem('mdlabs_my_prompt_ids', JSON.stringify(updated));
      return updated;
    });

    // Attempt backend sync, if a backend exists
    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPromptObject.title,
          promptText: newPromptObject.promptText,
          imageUrl: newPromptObject.imageUrl,
          category: newPromptObject.category,
          tags: newPromptObject.tags
        })
      });
      if (res.ok) {
        const createdPrompt = await res.json();
        // SWAP client id with database id
        setPrompts(prev => {
          const filtered = prev.filter(p => p.id !== newPromptObject.id);
          const updated = [createdPrompt, ...filtered];
          localStorage.setItem('mdlabs_prompts_db', JSON.stringify(updated));
          return updated;
        });
        setMyUploadedPromptIds(prev => {
          const filtered = prev.filter(id => id !== newPromptObject.id);
          const updated = [...filtered, createdPrompt.id];
          localStorage.setItem('mdlabs_my_prompt_ids', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.warn('Backend API has not registered the addition, prompt is kept 100% locally', err);
    }
    
    // Reset form
    setNewTitle('');
    setNewPromptText('');
    setNewImageUrl('');
    setNewCategory('Cinematic Portraits');
    setNewTags('');
    setShowAddForm(false);
  };

  const handleDeletePrompt = async (id: string, e: MouseEvent) => {
    e.stopPropagation();

    // Optimistically delete from UI and local storage
    setPrompts(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('mdlabs_prompts_db', JSON.stringify(updated));
      return updated;
    });

    setMyUploadedPromptIds(prev => {
      const updated = prev.filter(item => item !== id);
      localStorage.setItem('mdlabs_my_prompt_ids', JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch(`/api/prompts/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('Backend API delete failed, kept local deletions only', err);
    }
  };

  const handleLikePrompt = async (id: string, e: MouseEvent) => {
    e.stopPropagation();

    // Optimistically increment likes in local UI and cache
    setPrompts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
      localStorage.setItem('mdlabs_prompts_db', JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch(`/api/prompts/${id}/like`, {
        method: 'POST'
      });
    } catch (err) {
      console.warn('Backend API like failed, increment saved locally', err);
    }
  };

  const handleCopyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Categorization
  const categories = [
    'All',
    'AI Wallpapers',
    'Cinematic Portraits',
    'AI Fantasy Art',
    'Couple & Love Aesthetic',
    'Travel & Nature',
    'Luxury Lifestyle',
    'Motivational & Success',
    'Devotional & Spiritual',
    'Viral Poster Designs',
    'Food Photography',
    'Future & Sci-Fi'
  ];

  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Whenever searchable criteria or category changes, reset pagination to Page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalItems = filteredPrompts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedPrompts = filteredPrompts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      {/* Dynamic Upper Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent tracking-tight leading-none">
                MDlabs
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Regional Hub: <span className="text-indigo-600 font-semibold">{answers.village}</span> &bull; {answers.age}
              </p>
            </div>
          </div>

          {/* Action button removed per user request */}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
        
        {/* Onboarding Metadata Summary Card */}
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-violet-100 bg-white/20 px-2.5 py-1 rounded-full">
                Curator Dashboard Active
              </span>
              <h2 className="text-2xl mt-3 font-bold tracking-tight">
                Welcome back, {answers.name}! 👋
              </h2>
            </div>
          </div>
        </div>

        {/* Dynamic Image & Prompt Creator Panel Drawer */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-md shadow-slate-100">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    Publish Prompt & Reference Image
                  </h3>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleAddPrompt} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        PROMPT TITLE
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Cyberpunk Rainy Tokyo Street, Unreal Engine"
                        className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-505 rounded-xl focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        PROMPT CATEGORY
                      </label>
                      <select
                        className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none rounded-xl text-slate-700 font-medium"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      >
                        <option value="AI Wallpapers">AI Wallpapers</option>
                        <option value="Cinematic Portraits">Cinematic Portraits</option>
                        <option value="AI Fantasy Art">AI Fantasy Art</option>
                        <option value="Couple & Love Aesthetic">Couple & Love Aesthetic</option>
                        <option value="Travel & Nature">Travel & Nature</option>
                        <option value="Luxury Lifestyle">Luxury Lifestyle</option>
                        <option value="Motivational & Success">Motivational & Success</option>
                        <option value="Devotional & Spiritual">Devotional & Spiritual</option>
                        <option value="Viral Poster Designs">Viral Poster Designs</option>
                        <option value="Food Photography">Food Photography</option>
                        <option value="Future & Sci-Fi">Future & Sci-Fi</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      REAL IMAGE URL (OPTIONAL)
                    </label>
                    <input
                      type="url"
                      placeholder="Paste image URL here, or leave blank"
                      className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-505 rounded-xl focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 font-mono"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      AI PROMPT TEXT (OPTIONAL)
                    </label>
                    <textarea
                      placeholder="Enter custom prompt formula text here, or leave blank"
                      rows={3}
                      className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-505 rounded-xl focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 font-mono"
                      value={newPromptText}
                      onChange={(e) => setNewPromptText(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      TAGS (COMMA SEPARATED)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. midjourney, cinematic, 3d render"
                      className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-505 rounded-xl focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2 rounded-xl transition shadow-xs cursor-pointer"
                    >
                      Add to Collection
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter and Search Bar controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          {/* Categories Horizontal Scrubber */}
          <div className="w-full md:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search prompt keywords..."
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Output prompts catalog */}
        {filteredPrompts.length === 0 ? (
          /* Empty State as requested: user will send prompts & images later, so we design pristine layout placeholders */
          <div className="w-full text-center py-16 px-6 bg-white border border-slate-100 rounded-2xl shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 mx-auto flex items-center justify-center text-slate-400 mb-4">
              <ImageIcon className="w-8 h-8" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">
              Prompt Workspace Ready
            </h3>
            
            <p className="text-slate-500 text-sm max-w-md mx-auto mt-2 leading-relaxed">
              No matching prompts were found. Try searching for other keywords, tags, or categories above.
            </p>

            {/* Aesthetic outline grid showing expected future items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12 opacity-40 select-none pointer-events-none">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="border border-dashed border-slate-300 rounded-2xl p-4 text-left flex flex-col justify-between h-72">
                  <div className="bg-slate-100 w-full h-32 rounded-xl flex items-center justify-center font-mono text-[10px] text-slate-400">
                    Skeletor Preview Image
                  </div>
                  <div>
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-slate-100 rounded w-full mb-1"></div>
                    <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-2">
                    <div className="h-4 bg-slate-100 rounded w-10"></div>
                    <div className="h-4 bg-slate-100 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Staggered Prompt Cards Grid once populated */}
            <motion.div 
              key={`${safeCurrentPage}-${selectedCategory}-${searchQuery}`}
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              className={`grid ${selectedCategory === 'AI Wallpapers' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}
            >
              <AnimatePresence mode="popLayout">
                {paginatedPrompts.map((p) => (
                  <motion.div
                    key={p.id}
                    layoutId={p.id}
                    variants={cardVariants}
                    className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
                  >
                    {/* Aspect-card Image section */}
                    <div 
                      onClick={() => p.imageUrl && setSelectedPreviewImage(p)}
                      className={`relative ${p.category === 'AI Wallpapers' ? 'aspect-[9/16]' : 'aspect-video'} w-full overflow-hidden bg-slate-100 flex items-center justify-center transition-all ${p.imageUrl ? 'cursor-zoom-in active:scale-[0.99] group-hover:brightness-95' : ''}`}
                      title={p.imageUrl ? "Click to expand image" : ""}
                    >
                      {p.imageUrl ? (
                        <>
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/30 opacity-80"></div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-linear-to-tr from-slate-50 to-indigo-50/50 flex flex-col items-center justify-center text-slate-400/80 p-4 border-b border-slate-100 select-none">
                          <ImageIcon className="w-6 h-6 text-slate-400/80 mb-1" />
                          <span className="text-[10px] font-semibold text-slate-400/80 tracking-wider uppercase">Empty Image Slot</span>
                        </div>
                      )}
                      
                      {/* Floating pill tags */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
                          {p.category}
                        </span>
                        {myUploadedPromptIds.includes(p.id) && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                            My Upload
                          </span>
                        )}
                      </div>

                      {myUploadedPromptIds.includes(p.id) && (
                        <button
                          onClick={(e) => handleDeletePrompt(p.id, e)}
                          className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white font-semibold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer z-10"
                          title="Delete your uploaded prompt"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}

                      <div className="absolute bottom-3 inset-x-3 text-white">
                        <h4 className="font-bold text-sm tracking-tight truncate">
                          {p.title}
                        </h4>
                      </div>
                    </div>

                    {/* Text Details & Interactive Action block */}
                    <div className={`${p.category === 'AI Wallpapers' ? 'p-3' : 'p-4'} flex-1 flex flex-col justify-between`}>
                      <div>
                        {/* Sub-tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {p.tags.map((tag) => (
                            <span key={tag} className="text-[10px] bg-slate-50 border border-slate-100 text-slate-500 py-0.5 px-2 rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Prompt area */}
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 relative group/prompt hover:bg-slate-100/50 transition duration-200 min-h-[72px] flex flex-col justify-center">
                          <span className="text-[9px] font-mono tracking-wider font-semibold text-indigo-500 block mb-1 font-sans">
                            PROMPT STRUCTURE:
                          </span>
                          {p.promptText ? (
                            <p className="font-mono text-[11px] text-slate-700 leading-relaxed max-h-24 overflow-y-auto break-words select-all">
                              {p.promptText}
                            </p>
                          ) : (
                            <p className="font-mono text-[10px] text-slate-400 italic">
                              Empty Prompt Slot
                            </p>
                          )}
                          
                          <button
                            onClick={() => handleCopyToClipboard(p.id, p.promptText)}
                            className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-white border border-slate-200 shadow-xs hover:shadow-sm text-slate-500 hover:text-slate-800 transition flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === p.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-[9px] font-semibold text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-semibold">Copy Formula</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Footer social stats */}
                      <div className={`flex items-center justify-between ${p.category === 'AI Wallpapers' ? 'mt-1 pt-2' : 'mt-4 pt-3'} border-t border-slate-100`}>
                        <button
                          onClick={(e) => handleLikePrompt(p.id, e)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-pink-600 transition cursor-pointer"
                        >
                          <Heart className="w-4 h-4 text-slate-400 group-hover:text-pink-500" />
                          <span>{p.likes}</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-mono font-medium">
                            REF ID: {p.id.substring(0, 10)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Downward Page numbers Pagination bar */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center justify-center gap-6 mt-12 mb-8">
                {/* Visual Status Text */}
                <div className="text-[13px] text-slate-400 font-medium font-sans">
                  Showing <span className="font-semibold text-slate-600">{startIndex + 1}</span> - <span className="font-semibold text-slate-600">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="font-semibold text-slate-600">{totalItems}</span> prompt collections
                </div>

                {/* Stylish Pagination Buttons Grid */}
                <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl px-4">
                  {/* Previous Button - hidden if page 1 to perfectly keep the clean positive sequence */}
                  {safeCurrentPage > 1 && (
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="w-12 h-12 flex items-center justify-center text-lg font-bold rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800 transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs"
                      title="Previous Page"
                    >
                      &laquo;
                    </button>
                  )}

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-12 h-12 flex items-center justify-center text-[15px] font-bold rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
                        safeCurrentPage === pageNumber
                          ? 'bg-[#2f80ed] text-white border border-transparent shadow-[0_5px_15px_rgba(47,128,237,0.4)]'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-400/50 hover:text-indigo-600 hover:shadow-2xs'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  {/* Next Button shaped nicely with » symbol */}
                  {safeCurrentPage < totalPages && (
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="px-6 h-12 flex items-center justify-center text-lg font-bold rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800 transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs"
                      title="Next Page"
                    >
                      &raquo;
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* High-Fidelity Immersive Image Lightbox Portal / Modal Overlay */}
      <AnimatePresence>
        {selectedPreviewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPreviewImage(null)}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 sm:p-8 cursor-zoom-out"
          >
            {/* Close Trigger Button */}
            <button
              onClick={() => setSelectedPreviewImage(null)}
              className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white shadow-lg transition-all duration-200 cursor-pointer"
              title="Close Preview (Esc)"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Immersive Image Display Container */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // Prevent close on clicking image frame
              className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center cursor-default bg-slate-900/50 p-2 sm:p-3 rounded-2xl border border-slate-800 shadow-2xl"
            >
              <img
                src={selectedPreviewImage.imageUrl}
                alt={selectedPreviewImage.title}
                referrerPolicy="no-referrer"
                className="rounded-xl max-w-full max-h-[65vh] md:max-h-[70vh] object-contain shadow-2xl transition-all select-none"
              />

              {/* Dynamic Bottom Information Overlay Card */}
              <div className="mt-4 sm:mt-5 text-center text-white px-4 sm:px-6 w-full max-w-2xl">
                <span className="text-[10px] font-mono tracking-widest font-semibold text-indigo-400 bg-indigo-500/15 px-3 py-1 rounded-full uppercase">
                  {selectedPreviewImage.category}
                </span>
                
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-100 mt-2 sm:mt-2.5 truncate">
                  {selectedPreviewImage.title}
                </h3>
                
                {selectedPreviewImage.promptText ? (
                  <div className="mt-3 text-left">
                    <span className="text-[9px] font-mono tracking-wider font-semibold text-slate-400 block mb-1">
                      COPYABLE FORMULA:
                    </span>
                    <p className="text-xs text-slate-300 font-mono bg-slate-950/60 border border-slate-800 p-3 rounded-xl max-h-24 overflow-y-auto break-words select-all leading-relaxed">
                      {selectedPreviewImage.promptText}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic mt-2">No prompt formula registered for this reference image</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
