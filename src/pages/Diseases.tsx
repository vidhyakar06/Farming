import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, Search, AlertCircle, Shield, FlaskRound, Leaf, Eye, Calendar, Upload, X, Loader2, Sparkles, Sprout } from 'lucide-react';
import { supabase, type Disease } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { EmptyState, LoadingSpinner } from '../components/ui/Loading';
import CropImage from '../components/ui/CropImage';

const DEFAULT_DISEASES: Disease[] = [
  {
    id: 'd1',
    crop_name: 'Paddy',
    disease_name: 'Blast Disease (Magnaporthe oryzae)',
    symptoms: 'Spindle-shaped diamond spots with grey center on leaves; dark neck rot at flowering.',
    causes: 'High humidity (>90%), excessive nitrogen application, cool night temperatures.',
    prevention: 'Avoid excess nitrogen fertilizer, use blast-resistant varieties (IR 64, CO 51), seed treatment with Carbendazim.',
    treatment: 'Spray Tricyclazole 75 WP @ 120g/acre or Isoprothiolane 40 EC @ 300ml/acre.',
    organic_solution: 'Spray Pseudomonas fluorescens @ 1 kg/acre or 5% Neem seed kernel extract (NSKE).',
    image_url: '',
    season: 'Kharif',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd2',
    crop_name: 'Paddy',
    disease_name: 'Stem Borer (Scirpophaga incertulas)',
    symptoms: 'Dead heart in vegetative stage; White earhead with chaffy grains in reproductive stage.',
    causes: 'Larvae boring into central shoot and feeding internally.',
    prevention: 'Clip seedling leaf tips before transplanting, install 5 pheromone traps/acre.',
    treatment: 'Apply Chlorantraniliprole 18.5 SC @ 60 ml/acre or Cartap hydrochloride 4G @ 10 kg/acre.',
    organic_solution: 'Release Trichogramma egg parasitoids @ 60,000/acre; spray 5% Neem oil.',
    image_url: '',
    season: 'Kharif',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd3',
    crop_name: 'Tomato',
    disease_name: 'Leaf Curl Virus (ToLCV)',
    symptoms: 'Severe curling, puckering of leaves, stunting of plants with bushy growth.',
    causes: 'Tomato leaf curl virus transmitted by Whitefly (Bemisia tabaci).',
    prevention: 'Install 15 yellow sticky traps/acre, use border barrier crops like maize/sorghum.',
    treatment: 'Spray Acetamiprid 20 SP @ 50g/acre or Imidacloprid 17.8 SL @ 60ml/acre to control whiteflies.',
    organic_solution: 'Spray Neem oil (10,000 ppm) @ 5ml/L + garlic extract every 10 days.',
    image_url: '',
    season: 'All Season',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd4',
    crop_name: 'Cotton',
    disease_name: 'Pink Bollworm (Pectinophora gossypiella)',
    symptoms: 'Rosetted flowers, bore holes in developing bolls with pink larvae feeding on seeds and lint.',
    causes: 'High humidity, repeated monocropping of cotton.',
    prevention: 'Crop rotation, destroy crop residue, install 8-10 pheromone traps/acre.',
    treatment: 'Spray Emamectin benzoate 5 SG @ 100g/acre or Spinosad 45 SC @ 75ml/acre.',
    organic_solution: 'Spray Agniastra or Neem seed kernel extract 5%; release Trichogramma wasps.',
    image_url: '',
    season: 'Kharif',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd5',
    crop_name: 'Wheat',
    disease_name: 'Yellow Stripe Rust (Puccinia striiformis)',
    symptoms: 'Yellow pustules arranged in linear stripes on leaf surface, powder rubs off on fingers.',
    causes: 'Fungus Puccinia striiformis, cool temperatures (10-15°C) and persistent dew.',
    prevention: 'Early sowing, use rust-resistant cultivars (HD 2967, PBW 550).',
    treatment: 'Spray Propiconazole 25 EC @ 200ml/acre in 200L water.',
    organic_solution: 'Spray sour buttermilk (5L in 100L water) or Trichoderma viride.',
    image_url: '',
    season: 'Rabi',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd6',
    crop_name: 'Sugarcane',
    disease_name: 'Red Rot (Colletotrichum falcatum)',
    symptoms: 'Yellowing of upper leaves, red lesions on the midrib, sour alcohol smell when cane is split.',
    causes: 'Fungus spreading through infected setts and soil.',
    prevention: 'Use healthy setts, practice crop rotation, ensure good field drainage.',
    treatment: 'Sett treatment with Carbendazim 50 WP @ 1g/litre for 15 minutes before planting.',
    organic_solution: 'Treat setts with Trichoderma viride or Pseudomonas fluorescens.',
    image_url: '',
    season: 'All Season',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd7',
    crop_name: 'Maize',
    disease_name: 'Fall Armyworm (Spodoptera frugiperda)',
    symptoms: 'Large ragged holes on leaves, sawdust-like frass in the whorls, severe defoliation.',
    causes: 'Larvae of the Fall Armyworm moth feeding aggressively on whorls.',
    prevention: 'Early planting, intercropping with legumes, installing pheromone traps.',
    treatment: 'Spray Emamectin benzoate 5 SG @ 0.4g/litre or Spinetoram 11.7 SC @ 0.5ml/litre.',
    organic_solution: 'Whorl application of Neem seed kernel extract (NSKE) 5% or sand mixed with lime.',
    image_url: '',
    season: 'Kharif',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd8',
    crop_name: 'Onion',
    disease_name: 'Purple Blotch (Alternaria porri)',
    symptoms: 'Small, sunken, whitish flecks with purple centers on leaves, leading to leaf dieback.',
    causes: 'Fungus favored by warm, humid weather and heavy dew.',
    prevention: 'Proper spacing for ventilation, 3-year crop rotation, wide spacing.',
    treatment: 'Spray Mancozeb 75 WP @ 2.5g/litre or Tebuconazole 25.9 EC @ 1ml/litre.',
    organic_solution: 'Spray Panchagavya 3% or Neem oil 5ml/litre at initial stages.',
    image_url: '',
    season: 'Rabi',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd9',
    crop_name: 'Chilli',
    disease_name: 'Fruit Rot / Anthracnose',
    symptoms: 'Sunken, dark circular spots on ripe fruits, pinkish spore masses in humid weather.',
    causes: 'Fungus Colletotrichum capsici.',
    prevention: 'Use disease-free seeds, proper drainage, avoid overhead irrigation.',
    treatment: 'Spray Azoxystrobin 23 SC @ 1ml/litre or Copper Oxychloride 50 WP @ 2.5g/litre.',
    organic_solution: 'Seed treatment with Trichoderma viride @ 10g/kg; spray sour buttermilk.',
    image_url: '',
    season: 'Kharif',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd10',
    crop_name: 'Groundnut',
    disease_name: 'Tikka Disease (Leaf Spot)',
    symptoms: 'Dark brown circular spots with yellow halos on older leaves causing defoliation.',
    causes: 'Fungus Cercospora arachidicola favored by high humidity.',
    prevention: 'Crop rotation, early sowing, destroying plant debris.',
    treatment: 'Spray Chlorothalonil 75 WP @ 2g/litre or Hexaconazole 5 EC @ 1ml/litre.',
    organic_solution: 'Spray 5% NSKE (Neem Seed Kernel Extract) or Pseudomonas fluorescens.',
    image_url: '',
    season: 'Kharif',
    created_at: new Date().toISOString(),
  }
];

export default function Diseases() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Disease | null>(null);

  // AI Image Inspection State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inspectImage, setInspectImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const { data, error } = await supabase.from('diseases').select('*').order('crop_name');
        if (error || !data || data.length === 0) {
          setDiseases(DEFAULT_DISEASES);
        } else {
          setDiseases(data);
        }
      } catch {
        setDiseases(DEFAULT_DISEASES);
      } finally {
        setLoading(false);
      }
    };
    fetchDiseases();
  }, []);

  const filtered = diseases.filter((d) =>
    d.crop_name.toLowerCase().includes(search.toLowerCase()) ||
    d.disease_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      showToast('Image size must be less than 4MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setInspectImage(event.target.result as string);
        setAiDiagnosis(null);
        analyzeImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64Image: string) => {
    setIsAnalyzing(true);
    setAiDiagnosis(null);

    const apiKey = (import.meta as unknown as { env?: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      setIsAnalyzing(false);
      setAiDiagnosis("⚠️ Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file to enable AI image inspection.");
      return;
    }

    try {
      // Remove data:image/jpeg;base64, prefix
      const base64Data = base64Image.split(',')[1];
      const mimeType = base64Image.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)?.[0] || 'image/jpeg';

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: "You are an expert agricultural plant pathologist. Analyze this image of a crop/leaf. Identify the crop if possible, identify any disease or pest damage, and provide: 1) Disease/Pest Name, 2) Symptoms observed, 3) Causes, and 4) Actionable organic and chemical treatments. Keep the response concise, using markdown, emojis, and clear bullet points." },
                  {
                    inline_data: {
                      mime_type: mimeType,
                      data: base64Data
                    }
                  }
                ]
              }
            ],
            generationConfig: { temperature: 0.4, maxOutputTokens: 1024 }
          })
        }
      );

      if (!response.ok) throw new Error('Failed to analyze image');
      
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        setAiDiagnosis(text);
      } else {
        throw new Error('No diagnosis generated');
      }
    } catch (err) {
      console.error(err);
      setAiDiagnosis("⚠️ Failed to analyze the image. Please ensure the image is clear and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <PageHeader
          title={t('diseases.title')}
          subtitle={t('diseases.subtitle')}
          icon={<Bug className="w-6 h-6 text-primary-500" />}
        />
        
        {/* AI Inspect Image Button */}
        <Button
          onClick={() => fileInputRef.current?.click()}
          icon={<Upload className="w-4 h-4" />}
          className="shrink-0 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20"
        >
          Inspect Crop Image
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* AI Inspector Modal/Overlay */}
      <AnimatePresence>
        {inspectImage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8"
          >
            <Card className="p-1 sm:p-2 border-2 border-emerald-500/30 shadow-xl overflow-hidden relative bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
              <button
                onClick={() => setInspectImage(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-900/50 hover:bg-slate-900/80 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="grid md:grid-cols-5 gap-6 p-4">
                <div className="md:col-span-2 flex flex-col items-center gap-3">
                  <div className="relative w-full aspect-square max-h-[300px] rounded-2xl overflow-hidden bg-black/5 ring-1 ring-black/10">
                    <img src={inspectImage} alt="Crop to inspect" className="w-full h-full object-cover" />
                  </div>
                  {isAnalyzing && (
                    <div className="flex items-center gap-2 text-emerald-600 font-medium">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing crop health...
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-3">
                  <div className="flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="text-xl font-bold">AI Diagnosis Report</h3>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-slate-900/60 rounded-2xl p-5 min-h-[250px] shadow-inner ring-1 ring-black/5 dark:ring-white/5">
                    {isAnalyzing ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4 py-12">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Sprout className="w-12 h-12 text-emerald-500" />
                        </motion.div>
                        <p>Our AI is examining the leaves for pathogens...</p>
                      </div>
                    ) : aiDiagnosis ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-emerald prose-p:leading-relaxed prose-li:marker:text-emerald-500">
                        {aiDiagnosis.split('\n').map((line, i) => (
                          <p key={i} className="mb-2">{line}</p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={t('common.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="p-6">
          <EmptyState icon={<Bug className="w-10 h-10" />} title={t('diseases.title')} message={t('common.search')} />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((disease, i) => (
            <motion.div
              key={disease.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(disease)}
            >
              <Card className="overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 group">
                <div className="relative h-44">
                  <CropImage src={disease.image_url} alt={disease.disease_name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-slate-800/95 text-[10px] uppercase tracking-wider font-bold text-primary-600 shadow-sm">
                        {disease.crop_name}
                      </span>
                      {disease.season && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/95 text-[10px] uppercase tracking-wider font-bold text-white shadow-sm">
                          <Calendar className="w-3 h-3" /> {disease.season}
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary-300 transition-colors">{disease.disease_name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{disease.symptoms}</p>
                  <div className="flex items-center gap-1.5 text-xs text-primary-600 font-bold mt-4 tracking-wide uppercase">
                    <Eye className="w-4 h-4" /> View Treatment Guide
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="relative h-56">
                <CropImage src={selected.image_url} alt={selected.disease_name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/95 text-xs font-bold uppercase tracking-wider text-primary-600 shadow-sm">
                      {selected.crop_name}
                    </span>
                    {selected.season && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/95 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                        <Calendar className="w-3 h-3" /> {selected.season}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">{selected.disease_name}</h2>
                </div>
              </div>

              <div className="p-5 md:p-7 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 flex items-center justify-center text-red-500 shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 dark:text-white">Symptoms to Look For</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{selected.symptoms}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 flex items-center justify-center text-amber-500 shrink-0">
                    <Bug className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 dark:text-white">Primary Causes</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{selected.causes}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-500 shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 dark:text-white">Prevention Steps</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{selected.prevention}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FlaskRound className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-purple-900 dark:text-purple-300">Chemical Treatment</h4>
                    </div>
                    <p className="text-sm text-purple-800/80 dark:text-purple-300/80 leading-relaxed">{selected.treatment}</p>
                  </div>

                  <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Leaf className="w-5 h-5 text-green-600" />
                      <h4 className="font-bold text-green-900 dark:text-green-300">Organic Solution</h4>
                    </div>
                    <p className="text-sm text-green-800/80 dark:text-green-300/80 leading-relaxed">{selected.organic_solution}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
