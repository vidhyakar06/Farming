import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Images, Bug, Sprout, X, Search, ChevronLeft, ChevronRight,
  Calendar, Leaf, ZoomIn, Filter,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import PageHeader from '../components/ui/PageHeader';
import CropImage from '../components/ui/CropImage';
import { LoadingSpinner } from '../components/ui/Loading';

// ---------- Rich built-in image data ----------
interface GalleryItem {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  image_url: string;
  type: 'crop' | 'disease';
  season?: string;
}

const BUILTIN_CROPS: GalleryItem[] = [
  { id: 'g-paddy', name: 'Paddy (Rice)', subtitle: 'Oryza sativa', tag: 'Cereal', season: 'Kharif', type: 'crop', image_url: '/images/crops/paddy.png' },
  { id: 'g-wheat', name: 'Wheat', subtitle: 'Triticum aestivum', tag: 'Cereal', season: 'Rabi', type: 'crop', image_url: '/images/crops/wheat.jpg' },
  { id: 'g-tomato', name: 'Tomato', subtitle: 'Solanum lycopersicum', tag: 'Vegetable', season: 'All Season', type: 'crop', image_url: '/images/crops/tomato.jpg' },
  { id: 'g-cotton', name: 'Cotton', subtitle: 'Gossypium hirsutum', tag: 'Cash Crop', season: 'Kharif', type: 'crop', image_url: '/images/crops/cotton_amvac.jpg' },
  { id: 'g-sugarcane', name: 'Sugarcane', subtitle: 'Saccharum officinarum', tag: 'Cash Crop', season: 'All Season', type: 'crop', image_url: '/images/crops/sugarcane.jpg' },
  { id: 'g-maize', name: 'Maize (Corn)', subtitle: 'Zea mays', tag: 'Cereal', season: 'Kharif', type: 'crop', image_url: '/images/crops/maize.jpg' },
  { id: 'g-onion', name: 'Onion', subtitle: 'Allium cepa', tag: 'Vegetable', season: 'Rabi', type: 'crop', image_url: '/images/crops/onion.jpg' },
  { id: 'g-chilli', name: 'Chilli', subtitle: 'Capsicum annuum', tag: 'Spice', season: 'Kharif', type: 'crop', image_url: '/images/crops/chilli.jpg' },
  { id: 'g-banana', name: 'Banana', subtitle: 'Musa acuminata', tag: 'Fruit', season: 'All Season', type: 'crop', image_url: '/images/crops/banana.jpg' },
  { id: 'g-mango', name: 'Mango', subtitle: 'Mangifera indica', tag: 'Fruit', season: 'Summer', type: 'crop', image_url: '/images/crops/mango.jpg' },
  { id: 'g-coconut', name: 'Coconut', subtitle: 'Cocos nucifera', tag: 'Plantation', season: 'All Season', type: 'crop', image_url: '/images/crops/coconut.jpg' },
  { id: 'g-soybean', name: 'Soybean', subtitle: 'Glycine max', tag: 'Oilseed', season: 'Kharif', type: 'crop', image_url: '/images/crops/soybean.jpg' },
  { id: 'g-potato', name: 'Potato', subtitle: 'Solanum tuberosum', tag: 'Vegetable', season: 'Rabi', type: 'crop', image_url: '/images/crops/potato.jpg' },
  { id: 'g-groundnut', name: 'Groundnut', subtitle: 'Arachis hypogaea', tag: 'Oilseed', season: 'Kharif', type: 'crop', image_url: '/images/crops/groundnut.jpg' },
  { id: 'g-turmeric', name: 'Turmeric', subtitle: 'Curcuma longa', tag: 'Spice', season: 'Kharif', type: 'crop', image_url: '/images/crops/turmeric.jpg' },
  { id: 'g-ginger', name: 'Ginger', subtitle: 'Zingiber officinale', tag: 'Spice', season: 'Kharif', type: 'crop', image_url: '/images/crops/ginger.jpg' },
  { id: 'g-garlic', name: 'Garlic', subtitle: 'Allium sativum', tag: 'Spice', season: 'Rabi', type: 'crop', image_url: '/images/crops/garlic.jpg' },
  { id: 'g-mustard', name: 'Mustard', subtitle: 'Brassica juncea', tag: 'Oilseed', season: 'Rabi', type: 'crop', image_url: '/images/crops/mustard.jpg' },
  { id: 'g-cucumber', name: 'Cucumber', subtitle: 'Cucumis sativus', tag: 'Vegetable', season: 'All Season', type: 'crop', image_url: '/images/crops/cucumber.jpg' },
  { id: 'g-papaya', name: 'Papaya', subtitle: 'Carica papaya', tag: 'Fruit', season: 'All Season', type: 'crop', image_url: '/images/crops/papaya.jpg' },
  { id: 'g-watermelon', name: 'Watermelon', subtitle: 'Citrullus lanatus', tag: 'Fruit', season: 'Summer', type: 'crop', image_url: '/images/crops/watermelon.jpg' },
  { id: 'g-lettuce', name: 'Lettuce', subtitle: 'Lactuca sativa', tag: 'Vegetable', season: 'Rabi', type: 'crop', image_url: '/images/diseases/lettuce_pythium_wilt.jpg' },
  { id: 'g-variegated-foliage', name: 'Variegated Foliage / Ornamental', subtitle: 'Monstera / Philodendron spp.', tag: 'Plantation', season: 'All Season', type: 'crop', image_url: '/images/crops/plantly_var.webp' },
];

const BUILTIN_DISEASES: GalleryItem[] = [
  { id: 'gd-blast', name: 'Paddy Blast Disease', subtitle: 'Magnaporthe oryzae', tag: 'Paddy', season: 'Kharif', type: 'disease', image_url: '/images/diseases/paddy_blast.jpg' },
  { id: 'gd-stemborer', name: 'Stem Borer', subtitle: 'Scirpophaga incertulas', tag: 'Paddy', season: 'Kharif', type: 'disease', image_url: '/images/diseases/stem_borer.jpg' },
  { id: 'gd-leafcurl', name: 'Tomato Leaf Curl', subtitle: 'ToLCV Virus', tag: 'Tomato', season: 'All Season', type: 'disease', image_url: '/images/diseases/tomato_leaf_curl.jpg' },
  { id: 'gd-pinkboll', name: 'Pink Bollworm', subtitle: 'Pectinophora gossypiella', tag: 'Cotton', season: 'Kharif', type: 'disease', image_url: 'https://www.multiplexgroup.com/uploads/products/1709286012_364775.jpg' },
  { id: 'gd-powdery', name: 'Powdery Mildew', subtitle: 'Oidium mangiferae', tag: 'Mango', season: 'Rabi', type: 'disease', image_url: '/images/diseases/mango_powdery_mildew_greenlife.jpg' },
  { id: 'gd-rust', name: 'Yellow Stripe Rust', subtitle: 'Puccinia striiformis', tag: 'Wheat', season: 'Rabi', type: 'disease', image_url: '/images/diseases/yellow_rust.jpg' },
  { id: 'gd-faw', name: 'Fall Armyworm', subtitle: 'Spodoptera frugiperda', tag: 'Maize', season: 'Kharif', type: 'disease', image_url: '/images/diseases/fall_armyworm.jpg' },
  { id: 'gd-lateblight', name: 'Potato Late Blight', subtitle: 'Phytophthora infestans', tag: 'Potato', season: 'Rabi', type: 'disease', image_url: '/images/diseases/potato_late_blight_spudsmart.jpg' },
  { id: 'gd-anthrac', name: 'Anthracnose / Fruit Rot', subtitle: 'Colletotrichum capsici', tag: 'Chilli', season: 'Kharif', type: 'disease', image_url: '/images/diseases/chilli_anthracnose.jpg' },
  { id: 'gd-panama', name: 'Panama Wilt', subtitle: 'Fusarium oxysporum', tag: 'Banana', season: 'All Season', type: 'disease', image_url: '/images/diseases/banana_panama_wilt.jpg' },
  { id: 'gd-earlyblight', name: 'Early Blight', subtitle: 'Alternaria solani', tag: 'Tomato', season: 'All Season', type: 'disease', image_url: '/images/diseases/tomato_early_blight_lucid.jpg' },
  { id: 'gd-bph', name: 'Brown Planthopper', subtitle: 'Nilaparvata lugens', tag: 'Paddy', season: 'Kharif', type: 'disease', image_url: '/images/diseases/paddy_bph_irri.jpg' },
  { id: 'gd-downy', name: 'Downy Mildew', subtitle: 'Pseudoperonospora cubensis', tag: 'Cucumber', season: 'All Season', type: 'disease', image_url: '/images/diseases/cucumber_downy_mildew_5628815.jpg' },
  { id: 'gd-mosaic', name: 'Yellow Mosaic Disease', subtitle: 'MYMV Virus', tag: 'Soybean', season: 'Kharif', type: 'disease', image_url: '/images/diseases/bugwood_5598938.jpg' },
  { id: 'gd-cabbage-fusarium', name: 'Cabbage Fusarium Yellows', subtitle: 'Fusarium oxysporum', tag: 'Cabbage', season: 'Rabi', type: 'disease', image_url: '/images/diseases/cabbage_fusarium_yellows.jpg' },
  { id: 'gd-chickpea-rootrot', name: 'Chickpea Dry Root Rot', subtitle: 'Macrophomina phaseolina', tag: 'Chickpea', season: 'Rabi', type: 'disease', image_url: '/images/diseases/chickpea_dry_root_rot.webp' },
  { id: 'gd-cotton-alternaria', name: 'Alternaria Leaf Spot', subtitle: 'Alternaria macrospora', tag: 'Cotton', season: 'Kharif', type: 'disease', image_url: '/images/diseases/bing_oip_ge7gg.jpg' },
  { id: 'gd-lettuce-pythium', name: 'Lettuce Pythium Wilt', subtitle: 'Pythium uncinulatum', tag: 'Lettuce', season: 'Rabi', type: 'disease', image_url: '/images/diseases/lettuce_pythium_wilt.jpg' },
];

const CROP_TAGS = ['All', 'Cereal', 'Vegetable', 'Fruit', 'Cash Crop', 'Oilseed', 'Spice', 'Plantation'];
const DISEASE_TAGS = ['All', 'Paddy', 'Tomato', 'Wheat', 'Cotton', 'Maize', 'Chilli', 'Banana', 'Mango', 'Potato', 'Soybean', 'Cucumber', 'Cabbage', 'Chickpea', 'Lettuce'];

type Tab = 'crops' | 'diseases';

export default function Gallery() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>('crops');
  const [loading, setLoading] = useState(true);
  const [allCrops, setAllCrops] = useState<GalleryItem[]>(BUILTIN_CROPS);
  const [allDiseases, setAllDiseases] = useState<GalleryItem[]>(BUILTIN_DISEASES);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [cropRes, diseaseRes] = await Promise.all([
          supabase.from('crops').select('id, crop_name, scientific_name, image_url, suitable_season').order('crop_name'),
          supabase.from('diseases').select('id, disease_name, crop_name, image_url, symptoms').order('crop_name'),
        ]);

        // Always use BUILTIN_CROPS as source of truth (guaranteed working images)
        // Optionally enrich with DB metadata (scientific name, season) but never override images
        if (cropRes.data && cropRes.data.length > 0) {
          const enriched = BUILTIN_CROPS.map((builtin) => {
            const dbMatch = cropRes.data!.find(
              (c) =>
                builtin.name.toLowerCase().includes(c.crop_name.toLowerCase()) ||
                c.crop_name.toLowerCase().includes(builtin.name.toLowerCase().split(' ')[0])
            );
            return {
              ...builtin,
              id: dbMatch?.id || builtin.id,
              subtitle: dbMatch?.scientific_name || builtin.subtitle,
              season: dbMatch?.suitable_season || builtin.season,
              // image_url stays from builtin - never from DB
            };
          });
          setAllCrops(enriched);
        } else {
          setAllCrops(BUILTIN_CROPS);
        }

        if (diseaseRes.data && diseaseRes.data.length > 0) {
          const dbDiseases: GalleryItem[] = diseaseRes.data.map((d) => {
            const matchingBuiltin = BUILTIN_DISEASES.find(
              (b) =>
                b.name.toLowerCase().includes(d.disease_name.toLowerCase()) ||
                d.disease_name.toLowerCase().includes(b.name.toLowerCase()) ||
                b.tag.toLowerCase() === (d.crop_name || '').toLowerCase()
            );
            const isValidUrl = d.image_url && d.image_url.startsWith('http') && !d.image_url.includes('1536617621572');
            return {
              id: d.id,
              name: d.disease_name,
              subtitle: d.crop_name || '',
              tag: d.crop_name || 'General',
              season: matchingBuiltin?.season || '',
              type: 'disease' as const,
              image_url: isValidUrl ? d.image_url : (matchingBuiltin?.image_url || ''),
            };
          });
          setAllDiseases(dbDiseases.length > 0 ? dbDiseases : BUILTIN_DISEASES);
        } else {
          setAllDiseases(BUILTIN_DISEASES);
        }
      } catch {
        // fallback to built-in data
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const items = tab === 'crops' ? allCrops : allDiseases;
  const tags = tab === 'crops' ? CROP_TAGS : DISEASE_TAGS;

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        item.tag.toLowerCase().includes(search.toLowerCase());
      const matchTag = activeTag === 'All' || item.tag === activeTag;
      return matchSearch && matchTag;
    });
  }, [items, search, activeTag]);

  const openLightbox = (item: GalleryItem) => {
    const idx = filtered.findIndex((f) => f.id === item.id);
    setLightboxIdx(idx);
    setSelected(item);
  };

  const navigateLightbox = (dir: 1 | -1) => {
    const newIdx = (lightboxIdx + dir + filtered.length) % filtered.length;
    setLightboxIdx(newIdx);
    setSelected(filtered[newIdx]);
  };

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setActiveTag('All');
    setSearch('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('gallery.title')}
        subtitle={t('gallery.subtitle')}
        icon={<Images className="w-6 h-6 text-primary-500" />}
      />

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => handleTabChange('crops')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
            tab === 'crops'
              ? 'bg-gradient-to-r from-primary-600 to-emerald-600 text-white shadow-lg shadow-primary-500/30'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-400'
          }`}
        >
          <Sprout className="w-4 h-4" />
          🌾 {t('gallery.cropsTab')} ({allCrops.length})
        </button>
        <button
          onClick={() => handleTabChange('diseases')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
            tab === 'diseases'
              ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/30'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-red-400'
          }`}
        >
          <Bug className="w-4 h-4" />
          🐛 {t('gallery.diseasesTab')} ({allDiseases.length})
        </button>
      </div>

      {/* Search + Count */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('gallery.searchPlaceholder')}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 px-1">
          <Filter className="w-4 h-4" />
          <span>{filtered.length} {t('common.items')}</span>
        </div>
      </div>

      {/* Tag Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTag === tag
                ? tab === 'crops'
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-red-600 text-white shadow-md shadow-red-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-400'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500 dark:text-slate-400">
          <Images className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No images found for "<span className="text-primary-500">{search || activeTag}</span>"</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
        >
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.button
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.25, delay: i * 0.015 }}
                onClick={() => openLightbox(item)}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ring-2 ring-transparent hover:ring-primary-400 dark:hover:ring-primary-500"
              >
                <CropImage
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Tag chip */}
                <div className="absolute top-2 left-2">
                  <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${
                    item.type === 'crop'
                      ? 'bg-emerald-500/80 text-white'
                      : 'bg-red-500/80 text-white'
                  }`}>
                    {item.tag}
                  </span>
                </div>

                {/* Zoom icon */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ZoomIn className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* Name */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p className="text-white font-bold text-xs leading-tight truncate">{item.name}</p>
                  {item.subtitle && (
                    <p className="text-white/60 text-[10px] italic truncate mt-0.5">{item.subtitle}</p>
                  )}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Image */}
              <div className="relative aspect-video w-full overflow-hidden">
                <CropImage
                  src={selected.image_url}
                  alt={selected.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Close */}
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Counter */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium">
                  {lightboxIdx + 1} / {filtered.length}
                </div>

                {/* Nav arrows */}
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Name overlay */}
                <div className="absolute bottom-4 left-5 right-16">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${
                      selected.type === 'crop' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
                    }`}>
                      {selected.tag}
                    </span>
                    {selected.season && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-white/70">
                        <Calendar className="w-3 h-3" /> {selected.season}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">{selected.name}</h2>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  selected.type === 'crop'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-600'
                }`}>
                  {selected.type === 'crop' ? <Leaf className="w-6 h-6" /> : <Bug className="w-6 h-6" />}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-base">{selected.name}</p>
                  {selected.subtitle && (
                    <p className="text-sm italic text-slate-500 dark:text-slate-400">{selected.subtitle}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-0.5 capitalize">{selected.type} • {selected.tag}{selected.season ? ` • ${selected.season}` : ''}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
