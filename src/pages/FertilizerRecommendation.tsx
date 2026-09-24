import { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical,
  Search,
  AlertTriangle,
  Beaker,
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Scale,
  Leaf,
  Layers,
  Flame,
  Droplets,
} from 'lucide-react';
import { supabase, type Fertilizer, type FarmDetail } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { EmptyState, LoadingSpinner } from '../components/ui/Loading';
import { defaultFertilizers } from '../data/defaultFertilizers';

type CategoryFilter = 'all' | 'priority' | 'nitrogen' | 'phosphorus' | 'potassium' | 'organic' | 'micronutrient';

interface EnrichedFertilizer extends Fertilizer {
  priority: 'high' | 'recommended' | 'maintenance';
  category: 'nitrogen' | 'phosphorus' | 'potassium' | 'organic' | 'micronutrient' | 'conditioner';
  matchReason: string;
  badgeLabel: string;
  badgeColor: string;
}

export default function FertilizerRecommendation() {
  const { session } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [farmData, setFarmData] = useState<FarmDetail | null>(null);
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<CategoryFilter>('all');
  const [farmAcres, setFarmAcres] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let farmRecord: FarmDetail | null = null;

        // Try getting farm details from Supabase if authenticated
        if (session?.user?.id) {
          const { data } = await supabase
            .from('farm_details')
            .select('*')
            .eq('farmer_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          farmRecord = data as FarmDetail | null;

          if (!farmRecord) {
            try {
              const cached = localStorage.getItem(`farm_details_${session.user.id}`);
              if (cached) farmRecord = JSON.parse(cached);
            } catch {
              // ignore
            }
          }
        }

        // Global fallback cache if any
        if (!farmRecord) {
          try {
            const cachedGlobal = localStorage.getItem('active_farm_details');
            if (cachedGlobal) farmRecord = JSON.parse(cachedGlobal);
          } catch {
            // ignore
          }
        }

        // Fetch fertilizers from Supabase
        const { data: dbFertilizers } = await supabase.from('fertilizers').select('*');

        // Merge DB data with local default catalog to ensure full reliable availability
        const combined = [...(dbFertilizers || [])];
        const seenNames = new Set(combined.map((f) => f.fertilizer_name.toLowerCase().trim()));
        defaultFertilizers.forEach((df) => {
          if (!seenNames.has(df.fertilizer_name.toLowerCase().trim())) {
            combined.push(df);
            seenNames.add(df.fertilizer_name.toLowerCase().trim());
          }
        });

        setFarmData(farmRecord);
        setFertilizers(combined);
      } catch (err) {
        console.error('Error fetching farm or fertilizer data:', err);
        setFertilizers(defaultFertilizers);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.id]);

  // Categorize and rank each fertilizer based on soil conditions
  const enrichedFertilizers = useMemo<EnrichedFertilizer[]>(() => {
    return fertilizers.map((fert) => {
      const name = fert.fertilizer_name.toLowerCase();
      const cond = (fert.soil_condition || '').toLowerCase();

      // Categorize
      let category: EnrichedFertilizer['category'] = 'conditioner';
      if (name.includes('urea') || name.includes('ammonium') || cond.includes('nitrogen deficient')) {
        category = 'nitrogen';
      } else if (name.includes('dap') || name.includes('ssp') || name.includes('phosphate') || cond.includes('phosphorus')) {
        category = 'phosphorus';
      } else if (name.includes('mop') || name.includes('potash') || name.includes('potassium')) {
        category = 'potassium';
      } else if (name.includes('vermicompost') || name.includes('neem') || name.includes('bio-fertilizer') || cond.includes('organic')) {
        category = 'organic';
      } else if (name.includes('zinc') || name.includes('borax') || name.includes('ferrous') || name.includes('solubor')) {
        category = 'micronutrient';
      }

      // Determine priority & reason based on actual farm test values
      let priority: EnrichedFertilizer['priority'] = 'maintenance';
      let matchReason = 'Balanced nutrition and maintenance for active crop cycles';
      let badgeLabel = 'Standard Care';
      let badgeColor = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

      if (farmData) {
        const ph = Number(farmData.soil_ph);
        const n = Number(farmData.nitrogen);
        const p = Number(farmData.phosphorus);
        const k = Number(farmData.potassium);

        // Low Nitrogen conditions (< 50 kg/acre)
        if (n > 0 && n < 50 && (category === 'nitrogen' || name.includes('dap') || name.includes('urea'))) {
          priority = 'high';
          matchReason = `Directly corrects low soil Nitrogen (${n} kg/acre) to restore lush vegetative growth`;
          badgeLabel = 'High Priority (Low N)';
          badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700';
        }
        // Low Phosphorus conditions (< 30 kg/acre)
        else if (p > 0 && p < 30 && (category === 'phosphorus' || name.includes('dap') || name.includes('ssp'))) {
          priority = 'high';
          matchReason = `Directly replenishes deficit Phosphorus (${p} kg/acre) for rapid root & seedling development`;
          badgeLabel = 'High Priority (Low P)';
          badgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300 dark:border-blue-700';
        }
        // Low Potassium conditions (< 50 kg/acre)
        else if (k > 0 && k < 50 && (category === 'potassium' || name.includes('mop') || name.includes('potash'))) {
          priority = 'high';
          matchReason = `Supplies vital Potassium (${k} kg/acre) to improve drought tolerance, pest resistance & fruit quality`;
          badgeLabel = 'High Priority (Low K)';
          badgeColor = 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-300 dark:border-purple-700';
        }
        // Acidic soil amendment (pH < 5.8)
        else if (ph > 0 && ph < 5.8 && (name.includes('lime') || name.includes('dolomite') || name.includes('ssp'))) {
          priority = 'high';
          matchReason = `Neutralizes acidic soil (pH ${ph}) and supplies essential calcium/magnesium buffers`;
          badgeLabel = 'pH Sweetener (Acidic)';
          badgeColor = 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-300 dark:border-rose-700';
        }
        // Alkaline/Sodic soil amendment (pH > 7.8)
        else if (ph > 7.8 && (name.includes('gypsum') || name.includes('zinc') || name.includes('ferrous'))) {
          priority = 'high';
          matchReason = `Reclaims alkaline soil (pH ${ph}) and mobilizes locked micronutrients`;
          badgeLabel = 'pH Conditioner (Alkaline)';
          badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700';
        }
        // Organic boosters for healthy soils
        else if (category === 'organic') {
          priority = 'recommended';
          matchReason = 'Improves soil humus, water holding capacity, and beneficial rhizosphere microflora';
          badgeLabel = 'Organic Soil Booster';
          badgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
        } else if (category === 'micronutrient') {
          priority = 'recommended';
          matchReason = 'Prevents trace element chlorosis and supports enzyme activation';
          badgeLabel = 'Micronutrient Fortifier';
          badgeColor = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800';
        }
      } else {
        if (category === 'organic') {
          priority = 'recommended';
          matchReason = 'Universal organic soil conditioner suitable for all crops';
          badgeLabel = 'Organic Soil Builder';
          badgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
        } else if (category === 'nitrogen' || category === 'phosphorus') {
          priority = 'recommended';
          matchReason = 'Core essential macronutrient formulation for standard field cultivation';
          badgeLabel = 'Core Nutrient';
          badgeColor = 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
        }
      }

      return {
        ...fert,
        priority,
        category,
        matchReason,
        badgeLabel,
        badgeColor,
      };
    });
  }, [fertilizers, farmData]);

  // Sort: High priority first, then recommended, then maintenance
  const sortedFertilizers = useMemo(() => {
    return [...enrichedFertilizers].sort((a, b) => {
      const priorityWeight = { high: 3, recommended: 2, maintenance: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
  }, [enrichedFertilizers]);

  // Filter based on search & category
  const filteredFertilizers = useMemo(() => {
    return sortedFertilizers.filter((f) => {
      const matchesSearch =
        f.fertilizer_name.toLowerCase().includes(search.toLowerCase()) ||
        f.soil_condition.toLowerCase().includes(search.toLowerCase()) ||
        f.application_method.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'priority') return f.priority === 'high';
      if (selectedFilter === 'nitrogen') return f.category === 'nitrogen';
      if (selectedFilter === 'phosphorus') return f.category === 'phosphorus';
      if (selectedFilter === 'potassium') return f.category === 'potassium';
      if (selectedFilter === 'organic') return f.category === 'organic';
      if (selectedFilter === 'micronutrient') return f.category === 'micronutrient';
      return true;
    });
  }, [sortedFertilizers, search, selectedFilter]);

  const handleRefreshAnalysis = () => {
    if (farmData) {
      const highPriorityCount = enrichedFertilizers.filter((f) => f.priority === 'high').length;
      showToast(
        highPriorityCount > 0
          ? `Analysis updated! Found ${highPriorityCount} priority fertilizers for your soil.`
          : 'Analysis updated! Soil nutrients are well-balanced; general fertilizers recommended.',
        'success'
      );
    } else {
      showToast('Showing complete fertilizer catalog. Add farm details for custom matching.', 'info');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading fertilizer recommendations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fertilizer Recommendations"
        subtitle="Precision nutrient guidance and dosage advice based on your soil test parameters"
        icon={<FlaskConical className="w-6 h-6 text-amber-500" />}
        action={
          <div className="flex items-center gap-2">
            <Button onClick={handleRefreshAnalysis} variant="secondary" icon={<Sparkles className="w-4 h-4 text-amber-500" />}>
              Re-Analyze Soil
            </Button>
            {!farmData && (
              <Button onClick={() => navigate('/farm-details')} icon={<ArrowRight className="w-4 h-4" />}>
                Add Farm Details
              </Button>
            )}
          </div>
        }
      />

      {/* Soil Nutrients Banner */}
      {farmData ? (
        <Card className="p-5 bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-transparent border-amber-200/50 dark:border-amber-900/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Soil Profile Active
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Season: <strong className="text-slate-700 dark:text-slate-200">{farmData.current_season || 'All Season'}</strong> • Soil: <strong className="text-slate-700 dark:text-slate-200">{farmData.soil_type || 'Loam'}</strong>
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mt-1">
                Your Farm Nutrient Balance & Needs
              </h3>
            </div>
            <Link
              to="/farm-details"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline shrink-0"
            >
              Update Soil Test <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* pH */}
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Soil pH</span>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">
                {farmData.soil_ph != null ? farmData.soil_ph : 'N/A'}
              </p>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md mt-1 inline-block ${
                  farmData.soil_ph < 6.0
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                    : farmData.soil_ph > 7.5
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                }`}
              >
                {farmData.soil_ph < 6.0 ? 'Acidic' : farmData.soil_ph > 7.5 ? 'Alkaline' : 'Balanced (6.0-7.5)'}
              </span>
            </div>

            {/* Nitrogen */}
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nitrogen (N)</span>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">
                {farmData.nitrogen != null ? farmData.nitrogen : 'N/A'}{' '}
                <span className="text-xs font-normal text-slate-400">kg/ac</span>
              </p>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md mt-1 inline-block ${
                  (farmData.nitrogen ?? 0) < 50
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                    : (farmData.nitrogen ?? 0) > 120
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                }`}
              >
                {(farmData.nitrogen ?? 0) < 50 ? 'Deficient (<50)' : (farmData.nitrogen ?? 0) > 120 ? 'High (>120)' : 'Optimum'}
              </span>
            </div>

            {/* Phosphorus */}
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phosphorus (P)</span>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">
                {farmData.phosphorus != null ? farmData.phosphorus : 'N/A'}{' '}
                <span className="text-xs font-normal text-slate-400">kg/ac</span>
              </p>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md mt-1 inline-block ${
                  (farmData.phosphorus ?? 0) < 30
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                }`}
              >
                {(farmData.phosphorus ?? 0) < 30 ? 'Deficient (<30)' : 'Optimum'}
              </span>
            </div>

            {/* Potassium */}
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Potassium (K)</span>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">
                {farmData.potassium != null ? farmData.potassium : 'N/A'}{' '}
                <span className="text-xs font-normal text-slate-400">kg/ac</span>
              </p>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md mt-1 inline-block ${
                  (farmData.potassium ?? 0) < 50
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                }`}
              >
                {(farmData.potassium ?? 0) < 50 ? 'Deficient (<50)' : 'Optimum'}
              </span>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-5 bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-amber-950/20 dark:to-emerald-950/20 border-amber-200/60 dark:border-amber-900/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">
                  Personalized Dosage Calculator Available
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Save your farm soil test report (NPK & pH) to receive prioritized recommendations that highlight exactly what nutrient deficiencies your field needs.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => navigate('/farm-details')}
              className="shrink-0"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Add Farm Details
            </Button>
          </div>
        </Card>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search fertilizers by name, nutrient, or crop use..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 pr-4 py-2 text-sm w-full"
          />
        </div>

        {/* Farm Acreage Multiplier */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
          <Scale className="w-4 h-4 text-primary-500" />
          <span>Farm Area:</span>
          <select
            value={farmAcres}
            onChange={(e) => setFarmAcres(Number(e.target.value))}
            className="bg-transparent font-bold text-slate-800 dark:text-white cursor-pointer focus:outline-none"
          >
            <option value={0.5}>0.5 Acre</option>
            <option value={1}>1.0 Acre (Standard)</option>
            <option value={2}>2.0 Acres</option>
            <option value={3}>3.0 Acres</option>
            <option value={5}>5.0 Acres</option>
            <option value={10}>10.0 Acres</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { key: 'all' as CategoryFilter, label: `All Fertilizers (${sortedFertilizers.length})`, icon: Layers },
          ...(farmData
            ? [
                {
                  key: 'priority' as CategoryFilter,
                  label: `High Priority (${sortedFertilizers.filter((f) => f.priority === 'high').length})`,
                  icon: Sparkles,
                },
              ]
            : []),
          { key: 'nitrogen' as CategoryFilter, label: 'Nitrogen (N)', icon: Flame },
          { key: 'phosphorus' as CategoryFilter, label: 'Phosphorus (P)', icon: Droplets },
          { key: 'potassium' as CategoryFilter, label: 'Potassium (K)', icon: FlaskConical },
          { key: 'organic' as CategoryFilter, label: 'Organic & Bio', icon: Leaf },
          { key: 'micronutrient' as CategoryFilter, label: 'Micronutrients', icon: Beaker },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedFilter(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Fertilizer Cards Grid */}
      {filteredFertilizers.length === 0 ? (
        <Card className="p-8 text-center">
          <EmptyState
            icon={<FlaskConical className="w-10 h-10 text-slate-400" />}
            title="No Fertilizers Found"
            message="No fertilizer matched your search or filter. Try a broader search term or clear the filter."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setSelectedFilter('all');
                }}
              >
                Clear Filters
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredFertilizers.map((fert, i) => (
              <motion.div
                key={fert.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
              >
                <Card
                  className={`h-full flex flex-col justify-between p-5 border transition-all duration-200 hover:shadow-md ${
                    fert.priority === 'high'
                      ? 'border-amber-300/80 dark:border-amber-600/50 bg-gradient-to-b from-amber-50/40 via-white to-white dark:from-amber-950/20 dark:via-slate-800 dark:to-slate-800'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            fert.category === 'organic'
                              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                              : fert.category === 'nitrogen'
                              ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'
                              : fert.category === 'phosphorus'
                              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
                              : fert.category === 'potassium'
                              ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400'
                              : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'
                          }`}
                        >
                          {fert.category === 'organic' ? (
                            <Leaf className="w-5 h-5" />
                          ) : (
                            <Beaker className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 dark:text-white text-base leading-snug">
                            {fert.fertilizer_name}
                          </h3>
                          <span className="text-[11px] text-slate-400 capitalize">
                            {fert.category} formulation
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Priority Badge */}
                    <div className="mb-3">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${fert.badgeColor}`}>
                        {fert.priority === 'high' && <Sparkles className="w-3 h-3 text-amber-600" />}
                        {fert.badgeLabel}
                      </span>
                    </div>

                    {/* Soil Matching Note */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 mb-3 text-xs">
                      <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        {fert.matchReason}
                      </p>
                    </div>

                    {/* Soil Condition */}
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Target Condition:</span>{' '}
                      {fert.soil_condition}
                    </div>

                    {/* Specifications */}
                    <div className="space-y-2.5 text-xs">
                      {/* Quantity / Dosage */}
                      <div className="flex items-start gap-2 bg-emerald-50/60 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                        <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-emerald-900 dark:text-emerald-300">Dosage per acre</span>
                            {farmAcres !== 1 && (
                              <span className="text-[10px] text-emerald-600 font-semibold">
                                ({farmAcres}x for your {farmAcres} ac)
                              </span>
                            )}
                          </div>
                          <p className="text-slate-700 dark:text-slate-200 font-medium mt-0.5">{fert.quantity}</p>
                        </div>
                      </div>

                      {/* Application Method */}
                      <div className="flex items-start gap-2 p-1">
                        <FlaskConical className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Application Method:</span>
                          <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {fert.application_method}
                          </p>
                        </div>
                      </div>

                      {/* Precautions */}
                      {fert.precautions && (
                        <div className="flex items-start gap-2 p-1 text-amber-700 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg p-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                          <p className="text-[11px] leading-relaxed font-medium">
                            <span className="font-bold">Caution:</span> {fert.precautions}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
