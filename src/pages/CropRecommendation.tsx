import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sprout, Search, Download, Calendar, Droplets, Thermometer,
  FlaskConical, TrendingUp, FileText, Loader2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { supabase, type Crop, type FarmDetail } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { EmptyState, LoadingSpinner } from '../components/ui/Loading';
import CropImage from '../components/ui/CropImage';

import { defaultCrops } from '../data/defaultCrops';

type RecommendationResult = Crop & { confidence: number };

export default function CropRecommendation() {
  const { session } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [farmData, setFarmData] = useState<FarmDetail | null>(null);
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [search, setSearch] = useState('');
  const [allCrops, setAllCrops] = useState<Crop[]>([]);

  const calculateConfidence = (crop: Crop, farm: FarmDetail): number => {
    let score = 0;
    let total = 0;

    // Soil type match (30%)
    total += 30;
    const farmSoil = (farm.soil_type || '').toLowerCase();
    const cropSoil = (crop.soil_type || '').toLowerCase();
    if (farmSoil && cropSoil.includes(farmSoil)) {
      score += 30;
    } else if (
      (farmSoil.includes('loam') && cropSoil.includes('alluvial')) ||
      (farmSoil.includes('alluvial') && cropSoil.includes('loam')) ||
      (farmSoil.includes('clay') && cropSoil.includes('loam')) ||
      (farmSoil.includes('sandy') && cropSoil.includes('loam')) ||
      (farmSoil.includes('black') && cropSoil.includes('loam')) ||
      (farmSoil.includes('red') && cropSoil.includes('loam'))
    ) {
      score += 24;
    } else {
      score += 15; // Baseline general soil adaptability
    }

    // Season match (25%)
    total += 25;
    const farmSeason = (farm.current_season || '').toLowerCase();
    const cropSeason = (crop.suitable_season || '').toLowerCase();

    const isMonsoon = farmSeason.includes('monsoon') || farmSeason.includes('kharif') || farmSeason.includes('rain');
    const isWinter = farmSeason.includes('winter') || farmSeason.includes('rabi');
    const isSummer = farmSeason.includes('summer') || farmSeason.includes('zaid');
    const isAllSeason = farmSeason.includes('all');

    if (
      cropSeason.includes('all') ||
      isAllSeason ||
      (isMonsoon && (cropSeason.includes('monsoon') || cropSeason.includes('kharif'))) ||
      (isWinter && (cropSeason.includes('winter') || cropSeason.includes('rabi'))) ||
      (isSummer && (cropSeason.includes('summer') || cropSeason.includes('zaid')))
    ) {
      score += 25;
    } else {
      score += 12;
    }

    // Temperature match (20%)
    total += 20;
    const tempRange = crop.temperature_range?.match(/(\d+)\s*-\s*(\d+)/);
    const farmTemp = Number(farm.temperature);
    if (tempRange && !isNaN(farmTemp) && farmTemp > 0) {
      const min = Number(tempRange[1]);
      const max = Number(tempRange[2]);
      if (farmTemp >= min && farmTemp <= max) {
        score += 20;
      } else {
        const diff = Math.min(Math.abs(farmTemp - min), Math.abs(farmTemp - max));
        if (diff <= 5) score += 15;
        else if (diff <= 10) score += 10;
        else score += 6;
      }
    } else {
      score += 16;
    }

    // Rainfall match (15%)
    total += 15;
    const rainRange = crop.rainfall_range?.match(/(\d+)\s*-\s*(\d+)/);
    const farmRain = Number(farm.rainfall);
    if (rainRange && !isNaN(farmRain) && farmRain > 0) {
      const min = Number(rainRange[1]);
      const max = Number(rainRange[2]);
      if (farmRain >= min && farmRain <= max) {
        score += 15;
      } else {
        const diff = Math.min(Math.abs(farmRain - min), Math.abs(farmRain - max));
        if (diff <= 250) score += 12;
        else if (diff <= 500) score += 8;
        else score += 5;
      }
    } else {
      score += 12;
    }

    // Water availability (10%)
    total += 10;
    const waterReq = (crop.water_requirement || '').toLowerCase();
    const waterAvail = (farm.water_availability || '').toLowerCase();
    if (
      (waterReq.includes('high') && (waterAvail.includes('high') || waterAvail.includes('very'))) ||
      (waterReq.includes('low') && (waterAvail.includes('low') || waterAvail.includes('medium'))) ||
      (waterReq.includes('medium') && (waterAvail.includes('medium') || waterAvail.includes('high'))) ||
      !waterAvail
    ) {
      score += 10;
    } else {
      score += 6;
    }

    return Math.min(98, Math.max(55, Math.round((score / total) * 100)));
  };

  const getRankedCrops = (cropsList: Crop[], farm: FarmDetail | null): RecommendationResult[] => {
    if (!cropsList || cropsList.length === 0) return [];
    if (!farm) {
      // Default top suggestions when farm details are not yet entered
      return cropsList.slice(0, 12).map((c, i) => ({
        ...c,
        confidence: Math.max(70, 95 - i * 2),
      }));
    }
    return cropsList
      .map((crop) => ({ ...crop, confidence: calculateConfidence(crop, farm) }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 12);
  };

  useEffect(() => {
    const fetchFarmAndCrops = async () => {
      try {
        let farmRecord: FarmDetail | null = null;

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

        // Fetch crops from supabase
        const { data: dbCrops } = await supabase.from('crops').select('*');

        // Merge DB crops with default master crops to guarantee full catalog
        const combinedCrops = [...(dbCrops || [])];
        const seenNames = new Set(combinedCrops.map((c) => c.crop_name.toLowerCase().trim()));
        defaultCrops.forEach((dc) => {
          if (!seenNames.has(dc.crop_name.toLowerCase().trim())) {
            combinedCrops.push(dc);
            seenNames.add(dc.crop_name.toLowerCase().trim());
          }
        });

        setFarmData(farmRecord);
        setAllCrops(combinedCrops);

        // Auto-generate recommendations so user immediately sees results!
        const initialScored = getRankedCrops(combinedCrops, farmRecord);
        setResults(initialScored);

        if (session?.user?.id && initialScored.length > 0) {
          try {
            localStorage.setItem(`crop_recommendations_${session.user.id}`, JSON.stringify(initialScored.slice(0, 5)));
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Error fetching farm or crops:', err);
        // Fallback to default crops catalog
        setAllCrops(defaultCrops);
        setResults(getRankedCrops(defaultCrops, null));
      } finally {
        setLoading(false);
      }
    };
    fetchFarmAndCrops();
  }, [session?.user?.id]);

  const handleRecommend = async () => {
    setAnalyzing(true);
    setTimeout(async () => {
      const scored = getRankedCrops(allCrops.length > 0 ? allCrops : defaultCrops, farmData);
      setResults(scored);

      // Save top 5 recommendations in supabase & localStorage
      if (session?.user?.id && scored.length > 0) {
        const top5 = scored.slice(0, 5);
        try {
          localStorage.setItem(`crop_recommendations_${session.user.id}`, JSON.stringify(top5));
          for (const rec of top5) {
            await supabase.from('recommendations').insert({
              farmer_id: session.user.id,
              crop_id: rec.id,
              confidence: rec.confidence,
            });
          }
        } catch {
          // ignore save error
        }
      }
      setAnalyzing(false);
      showToast(`Found ${scored.length} recommended crops!`, 'success');
    }, 800);
  };

  const handleDownloadPDF = () => {
    if (results.length === 0) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('My Crop Suggestions', 20, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Farmer: ${session?.user?.email || 'N/A'}`, 20, 38);

    let y = 50;
    results.forEach((rec, i) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(14);
      doc.text(`${i + 1}. ${rec.crop_name} (${rec.confidence}% match)`, 20, y);
      doc.setFontSize(10);
      y += 7;
      doc.text(`Botanical Name: ${rec.scientific_name || 'N/A'}`, 25, y); y += 6;
      doc.text(`Soil Type: ${rec.soil_type} | Season: ${rec.suitable_season}`, 25, y); y += 6;
      doc.text(`Water: ${rec.water_requirement} | Duration: ${rec.growth_duration}`, 25, y); y += 6;
      doc.text(`Yield: ${rec.expected_yield} | Market: ${rec.market_value}`, 25, y); y += 6;
      doc.text(`Fertilizer: ${rec.fertilizer}`, 25, y); y += 10;
    });

    doc.save('crop-recommendations.pdf');
    showToast('PDF downloaded successfully', 'success');
  };

  const filteredResults = results.filter((r) =>
    r.crop_name.toLowerCase().includes(search.toLowerCase())
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
        title="Crop Suggestion"
        subtitle="Get smart crop suggestions based on your farm conditions"
        icon={<Sprout className="w-6 h-6" />}
        action={
          <div className="flex gap-2">
            {results.length > 0 && (
              <Button variant="outline" onClick={handleDownloadPDF} icon={<Download className="w-4 h-4" />}>PDF</Button>
            )}
            <Button onClick={handleRecommend} disabled={analyzing} icon={analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}>
              {analyzing ? 'Finding best crops...' : 'Get Crop Suggestions'}
            </Button>
          </div>
        }
      />

      {!farmData ? (
        <Card className="p-5 mb-6 border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 shrink-0">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-white text-sm">Personalize Your Crop Suggestions</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Showing top general agricultural crops. Add your farm soil, pH, and rainfall to get tailor-made suitability scores.
                </p>
              </div>
            </div>
            <Button onClick={() => navigate('/farm-details')} size="sm">Add Farm Details</Button>
          </div>
        </Card>
      ) : (
        <Card className="p-4 mb-6 bg-emerald-50/50 dark:bg-emerald-950/20 border-l-4 border-l-emerald-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                Active Farm Conditions
              </span>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium shadow-sm">
                  Soil: {farmData.soil_type || 'Loamy'} (pH {farmData.soil_ph ?? '6.5'})
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium shadow-sm">
                  Season: {farmData.current_season || 'All Seasons'}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium shadow-sm">
                  Temp: {farmData.temperature ?? '28'}°C
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium shadow-sm">
                  Rain: {farmData.rainfall ?? '800'} mm
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/farm-details')}>
              Update Farm Details
            </Button>
          </div>
        </Card>
      )}

      {analyzing && (
        <Card className="p-12 mb-6 text-center">
          <LoadingSpinner size="lg" />
          <p className="text-slate-500 dark:text-slate-400 mt-4">Finding the best crops for your farm...</p>
        </Card>
      )}

      {results.length > 0 && (
        <>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search crops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field max-w-md"
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <div className="relative h-40">
                    <CropImage src={rec.image_url} alt={rec.crop_name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur text-xs font-bold text-primary-600">
                      {rec.confidence}% match
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{rec.crop_name}</h3>
                    <p className="text-xs text-slate-400 italic">{rec.scientific_name}</p>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {rec.growth_duration}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Droplets className="w-3.5 h-3.5 text-slate-400" /> {rec.water_requirement}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Thermometer className="w-3.5 h-3.5 text-slate-400" /> {rec.temperature_range}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <TrendingUp className="w-3.5 h-3.5 text-slate-400" /> {rec.market_value}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <FlaskConical className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span>{rec.fertilizer}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300 mt-2">
                        <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span>Yield: {rec.expected_yield}</span>
                      </div>
                    </div>
                    {/* Confidence bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Match Score</span>
                        <span className="font-semibold text-primary-600">{rec.confidence}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${rec.confidence}%` }}
                          transition={{ duration: 0.8, delay: i * 0.05 }}
                          className={`h-full rounded-full ${rec.confidence > 75 ? 'bg-green-500' : rec.confidence > 50 ? 'bg-amber-500' : 'bg-slate-400'}`}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
