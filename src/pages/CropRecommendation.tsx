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
import { useLanguage } from '../context/LanguageContext';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { EmptyState, LoadingSpinner } from '../components/ui/Loading';
import CropImage from '../components/ui/CropImage';

type RecommendationResult = Crop & { confidence: number };

const DEFAULT_CROPS: Crop[] = [
  { id: 'c1', crop_name: 'Paddy', scientific_name: 'Oryza sativa', soil_type: 'Clayey / Loamy', suitable_season: 'Kharif', water_requirement: 'High (1200-1500 mm)', temperature_range: '22-32°C', rainfall_range: '1000-1500 mm', fertilizer: 'Urea: 50kg, DAP: 50kg, MOP: 25kg', growth_duration: '120-140 days', expected_yield: '4-5 tons/acre', market_value: 'High', image_url: '/images/crops/paddy.png' },
  { id: 'c2', crop_name: 'Wheat', scientific_name: 'Triticum aestivum', soil_type: 'Loamy / Clay Loam', suitable_season: 'Rabi', water_requirement: 'Medium (450-650 mm)', temperature_range: '15-25°C', rainfall_range: '500-750 mm', fertilizer: 'Urea: 60kg, DAP: 55kg, MOP: 20kg', growth_duration: '110-130 days', expected_yield: '3-4 tons/acre', market_value: 'High', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Vehn%C3%A4pelto_6.jpg/600px-Vehn%C3%A4pelto_6.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { id: 'c3', crop_name: 'Cotton', scientific_name: 'Gossypium hirsutum', soil_type: 'Black / Regur Soil', suitable_season: 'Kharif', water_requirement: 'Medium (600-800 mm)', temperature_range: '21-30°C', rainfall_range: '600-1000 mm', fertilizer: 'NPK: 60:30:30 kg/acre', growth_duration: '150-180 days', expected_yield: '1.5-2.5 tons/acre', market_value: 'Very High', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/CottonPlant.JPG/600px-CottonPlant.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { id: 'c4', crop_name: 'Tomato', scientific_name: 'Solanum lycopersicum', soil_type: 'Red Loam / Sandy Loam', suitable_season: 'All Season', water_requirement: 'Medium (400-600 mm)', temperature_range: '18-28°C', rainfall_range: '500-700 mm', fertilizer: 'FYM: 10t, DAP: 40kg, Potash: 30kg', growth_duration: '90-110 days', expected_yield: '15-20 tons/acre', market_value: 'High', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/600px-Tomato_je.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { id: 'c5', crop_name: 'Onion', scientific_name: 'Allium cepa', soil_type: 'Sandy Loam', suitable_season: 'Rabi / Kharif', water_requirement: 'Medium (350-550 mm)', temperature_range: '15-28°C', rainfall_range: '400-600 mm', fertilizer: 'NPK: 40:20:30 kg/acre', growth_duration: '100-120 days', expected_yield: '10-15 tons/acre', market_value: 'High', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mixed_onions.jpg/600px-Mixed_onions.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { id: 'c6', crop_name: 'Sugarcane', scientific_name: 'Saccharum officinarum', soil_type: 'Deep Rich Loamy', suitable_season: 'All Season', water_requirement: 'High (1500-2500 mm)', temperature_range: '20-35°C', rainfall_range: '1100-1500 mm', fertilizer: 'Urea: 100kg, SSP: 125kg, MOP: 50kg', growth_duration: '300-365 days', expected_yield: '40-50 tons/acre', market_value: 'Very High', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Saccharum_officinarum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-125.jpg/600px-Saccharum_officinarum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-125.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { id: 'c7', crop_name: 'Maize', scientific_name: 'Zea mays', soil_type: 'Well-drained Loam', suitable_season: 'Kharif / Rabi', water_requirement: 'Medium (500-750 mm)', temperature_range: '18-30°C', rainfall_range: '600-900 mm', fertilizer: 'Urea: 50kg, DAP: 45kg, MOP: 25kg', growth_duration: '90-110 days', expected_yield: '3-4 tons/acre', market_value: 'Medium', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Zea_mays_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-283.jpg/600px-Zea_mays_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-283.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { id: 'c8', crop_name: 'Chilli', scientific_name: 'Capsicum annuum', soil_type: 'Black / Red Loam', suitable_season: 'Kharif', water_requirement: 'Low-Medium (400-600 mm)', temperature_range: '20-30°C', rainfall_range: '500-800 mm', fertilizer: 'NPK: 50:25:25 kg/acre', growth_duration: '120-150 days', expected_yield: '2-3 tons dry/acre', market_value: 'Very High', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Madame_Jeanette_and_other_chillies.jpg/600px-Madame_Jeanette_and_other_chillies.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { id: 'c9', crop_name: 'Lettuce', scientific_name: 'Lactuca sativa', soil_type: 'Rich Sandy / Loamy', suitable_season: 'Rabi', water_requirement: 'Medium (300-500 mm)', temperature_range: '15-22°C', rainfall_range: '400-600 mm', fertilizer: 'NPK: 30:20:20 kg/acre', growth_duration: '60-80 days', expected_yield: '6-8 tons/acre', market_value: 'High', image_url: '/images/diseases/lettuce_pythium_wilt.jpg' }
];

export default function CropRecommendation() {
  const { session } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [farmData, setFarmData] = useState<FarmDetail | null>(null);
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [search, setSearch] = useState('');
  const [allCrops, setAllCrops] = useState<Crop[]>([]);

  useEffect(() => {
    const fetchFarmAndCrops = async () => {
      if (!session?.user?.id) return;
      const [farm, crops] = await Promise.all([
        supabase.from('farm_details').select('*').eq('farmer_id', session.user.id).order('created_at', { ascending: false }).maybeSingle(),
        supabase.from('crops').select('*'),
      ]);
      setFarmData(farm.data as FarmDetail | null);
      setAllCrops(crops.data?.length ? crops.data : DEFAULT_CROPS);
      setLoading(false);
    };
    fetchFarmAndCrops();
  }, [session?.user?.id]);

  const calculateConfidence = (crop: Crop, farm: FarmDetail): number => {
    let score = 0;
    let total = 0;

    // Soil type match (30%)
    total += 30;
    if (crop.soil_type === farm.soil_type) score += 30;
    else if (crop.soil_type === 'Loamy' && farm.soil_type === 'Alluvial') score += 20;

    // Season match (25%)
    total += 25;
    if (crop.suitable_season === farm.current_season) score += 25;
    else if (crop.suitable_season === 'All') score += 15;

    // Temperature match (20%)
    total += 20;
    const tempRange = crop.temperature_range?.match(/(\d+)-(\d+)/);
    if (tempRange) {
      const min = Number(tempRange[1]);
      const max = Number(tempRange[2]);
      if (farm.temperature >= min && farm.temperature <= max) score += 20;
      else if (Math.abs(farm.temperature - (min + max) / 2) < 10) score += 10;
    }

    // Rainfall match (15%)
    total += 15;
    const rainRange = crop.rainfall_range?.match(/(\d+)-(\d+)/);
    if (rainRange) {
      const min = Number(rainRange[1]);
      const max = Number(rainRange[2]);
      if (farm.rainfall >= min && farm.rainfall <= max) score += 15;
      else if (Math.abs(farm.rainfall - (min + max) / 2) < 50) score += 8;
    }

    // Water availability (10%)
    total += 10;
    const waterReq = crop.water_requirement?.toLowerCase() || '';
    const waterAvail = farm.water_availability?.toLowerCase() || '';
    if ((waterReq.includes('high') && (waterAvail.includes('high') || waterAvail.includes('very'))) ||
        (waterReq.includes('low') && (waterAvail.includes('low') || waterAvail.includes('medium'))) ||
        (waterReq.includes('medium') && waterAvail.includes('medium'))) {
      score += 10;
    }

    return Math.round((score / total) * 100);
  };

  const handleRecommend = async () => {
    if (!farmData) {
      showToast('Please add your farm details first', 'warning');
      return;
    }
    setAnalyzing(true);
    setTimeout(async () => {
      const scored = allCrops
        .map((crop) => ({ ...crop, confidence: calculateConfidence(crop, farmData) }))
        .sort((a, b) => b.confidence - a.confidence);

      setResults(scored);
      setAnalyzing(false);

      if (scored.length > 0) {
        try {
          await supabase.from('recommendations').insert({
            farmer_id: session?.user?.id,
            crop_id: scored[0].id,
            confidence: scored[0].confidence,
          });
        } catch (err) {
          console.error('Failed to save recommendation:', err);
        }
      }
    }, 1000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Crop Recommendations Report', 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
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
        title={t('crop.title')}
        subtitle={t('crop.subtitle')}
        icon={<Sprout className="w-6 h-6" />}
        action={
          <div className="flex gap-2">
            {results.length > 0 && (
              <Button variant="outline" onClick={handleDownloadPDF} icon={<Download className="w-4 h-4" />}>PDF</Button>
            )}
            <Button onClick={handleRecommend} disabled={analyzing} icon={analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}>
              {analyzing ? t('common.loading') : t('crop.getRecommendation')}
            </Button>
          </div>
        }
      />

      {!farmData && (
        <Card className="p-6 mb-6">
          <EmptyState
            icon={<Sprout className="w-10 h-10" />}
            title={t('farm.title')}
            message={t('farm.subtitle')}
            action={<Button onClick={() => navigate('/farm-details')}>{t('farm.title')}</Button>}
          />
        </Card>
      )}

      {farmData && results.length === 0 && !analyzing && (
        <Card className="p-8 mb-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 mx-auto mb-4">
            <Sprout className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{t('crop.title')}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
            {t('crop.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-sm text-slate-600 dark:text-slate-300">
              {t('crop.soilType')}: {farmData.soil_type}
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-sm text-slate-600 dark:text-slate-300">
              {t('crop.season')}: {farmData.current_season}
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-sm text-slate-600 dark:text-slate-300">
              {t('crop.temperature')}: {farmData.temperature}°C
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-sm text-slate-600 dark:text-slate-300">
              {t('crop.rainfall')}: {farmData.rainfall}mm
            </div>
          </div>
        </Card>
      )}

      {analyzing && (
        <Card className="p-12 mb-6 text-center">
          <LoadingSpinner size="lg" />
          <p className="text-slate-500 dark:text-slate-400 mt-4">{t('common.loading')}</p>
        </Card>
      )}

      {results.length > 0 && (
        <>
          <div className="mb-6">
            <input
              type="text"
              placeholder={t('common.search')}
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
                      {rec.confidence}% {t('dash.match')}
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
                        <span>{t('crop.yield')}: {rec.expected_yield}</span>
                      </div>
                    </div>
                    {/* Confidence bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">{t('crop.confidence')}</span>
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
