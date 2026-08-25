import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bug, Search, AlertCircle, Shield, FlaskRound, Leaf, Eye, Calendar } from 'lucide-react';
import { supabase, type Disease } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
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
];

export default function Diseases() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Disease | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t('diseases.title')}
        subtitle={t('diseases.subtitle')}
        icon={<Bug className="w-6 h-6" />}
      />

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
              <Card className="overflow-hidden cursor-pointer">
                <div className="relative h-40">
                  <CropImage src={disease.image_url} alt={disease.disease_name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 text-xs font-medium text-primary-600">
                        {disease.crop_name}
                      </span>
                      {disease.season && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-xs font-medium text-white">
                          <Calendar className="w-3 h-3" /> {disease.season}
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-lg">{disease.disease_name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{disease.symptoms}</p>
                  <div className="flex items-center gap-1 text-xs text-primary-600 font-medium mt-3">
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card max-w-2xl w-full max-h-[85vh] overflow-y-auto"
          >
            <div className="relative h-48">
              <CropImage src={selected.image_url} alt={selected.disease_name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/90 dark:bg-slate-800/90 flex items-center justify-center text-slate-600 hover:text-slate-900"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 text-xs font-medium text-primary-600">
                    {selected.crop_name}
                  </span>
                  {selected.season && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/90 text-xs font-medium text-white">
                      <Calendar className="w-3 h-3" /> {selected.season}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white">{selected.disease_name}</h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Symptoms</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{selected.symptoms}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500 shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Causes</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{selected.causes}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Prevention</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{selected.prevention}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 shrink-0">
                  <FlaskRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Treatment</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{selected.treatment}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Organic Solution</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{selected.organic_solution}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
