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
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Magnaporthe_grisea.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
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
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Scirpophaga_incertulas_female_moth.png/600px-Scirpophaga_incertulas_female_moth.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
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
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
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
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
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
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
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
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
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
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
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
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
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
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
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
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    season: 'Kharif',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd11',
    crop_name: 'Banana',
    disease_name: 'Panama Wilt (Fusarium oxysporum)',
    symptoms: 'Yellowing of older outer leaves starting from leaf margins, internal browning of pseudostem when cut.',
    causes: 'Soil-borne fungus Fusarium oxysporum f.sp. cubense, persists in soil for decades.',
    prevention: 'Plant resistant varieties (Grand Naine, Robusta), avoid replanting in infected soil.',
    treatment: 'Drench soil with Carbendazim 50 WP @ 1g/litre around the base. No effective cure after infection.',
    organic_solution: 'Soil drench with Pseudomonas fluorescens @ 2.5 kg/acre + Trichoderma harzianum @ 2.5 kg/acre.',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    season: 'All Season',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd12',
    crop_name: 'Banana',
    disease_name: 'Sigatoka Leaf Spot (Mycosphaerella musicola)',
    symptoms: 'Pale yellow streaks on young leaves, turning brown-black oval spots with yellow halo; premature leaf death.',
    causes: 'Fungus Mycosphaerella musicola, spreads by wind and rain splash in humid weather.',
    prevention: 'Remove and destroy infected leaves, maintain proper spacing for airflow.',
    treatment: 'Spray Propiconazole 25 EC @ 1ml/litre or Mancozeb 75 WP @ 2.5g/litre at 3-week intervals.',
    organic_solution: 'Spray Bordeaux mixture (1%) or Neem oil 5ml/litre every 15 days.',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    season: 'All Season',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd13',
    crop_name: 'Mango',
    disease_name: 'Powdery Mildew (Oidium mangiferae)',
    symptoms: 'White powdery coating on young leaves, flowers, and fruitlets. Flower drop leads to low fruit set.',
    causes: 'Fungus Oidium mangiferae, favored by dry weather with high humidity at night.',
    prevention: 'Plant resistant varieties, ensure proper pruning for air circulation, avoid dense canopy.',
    treatment: 'Spray Carbendazim 50 WP @ 1g/litre or Wettable Sulphur 80 WP @ 2g/litre at bud burst.',
    organic_solution: 'Spray 5% Neem seed kernel extract (NSKE) or dilute neem oil (3ml/litre) before bud break.',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    season: 'Rabi',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd14',
    crop_name: 'Mango',
    disease_name: 'Mango Hopper (Idioscopus clypealis)',
    symptoms: 'Nymphs and adults suck sap from tender shoots, flowers curl, dry up and drop. Sticky honeydew causes sooty mold.',
    causes: 'Mango leaf hopper insects thriving during flowering season.',
    prevention: 'Prune dense shoots before season, avoid excess nitrogen which promotes tender growth.',
    treatment: 'Spray Imidacloprid 17.8 SL @ 0.3ml/litre or Thiamethoxam 25 WG @ 0.3g/litre.',
    organic_solution: 'Spray Neem oil 5ml/litre + liquid soap 2ml/litre. Release natural predators like Chrysoperla larvae.',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    season: 'Rabi',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd15',
    crop_name: 'Coconut',
    disease_name: 'Root Wilt Disease',
    symptoms: 'Yellowing and drooping of lower fronds, spindle leaves appear bunched, button shedding, premature nut fall.',
    causes: 'Phytoplasma organism transmitted by mealybug Myndus crudus.',
    prevention: 'Grow resistant varieties, maintain tree nutrition, manage vector insects.',
    treatment: 'No complete cure. Inject Oxytetracycline HCl (25g/tree) into the trunk every 6 months.',
    organic_solution: 'Apply 50 kg well-decomposed FYM per palm + irrigation during summer; spray Neem oil on crown.',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    season: 'All Season',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd16',
    crop_name: 'Brinjal',
    disease_name: 'Shoot and Fruit Borer (Leucinodes orbonalis)',
    symptoms: 'Wilting of young shoots (dead heart), larvae bore into fruits causing rotting, pin holes on fruits.',
    causes: 'Leucinodes orbonalis larvae boring into tender shoots and fruits.',
    prevention: 'Install pheromone traps (5/acre), collect and destroy infested shoots and fruits.',
    treatment: 'Spray Spinosad 45 SC @ 0.3ml/litre or Chlorantraniliprole 18.5 SC @ 0.3ml/litre.',
    organic_solution: 'Release egg parasitoid Trichogramma chilonis @ 50,000/acre; spray Bt (Bacillus thuringiensis) @ 2g/litre.',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    season: 'All Season',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd17',
    crop_name: 'Potato',
    disease_name: 'Late Blight (Phytophthora infestans)',
    symptoms: 'Water-soaked, irregular grey-green spots on leaves and stems turning brown-black; white fluffy growth on underside.',
    causes: 'Oomycete Phytophthora infestans, spreads rapidly in cool, humid conditions.',
    prevention: 'Use certified seed tubers, avoid overhead irrigation, maintain proper plant spacing.',
    treatment: 'Spray Metalaxyl + Mancozeb 72 WP @ 2.5g/litre or Cymoxanil 8% + Mancozeb 64% WP @ 3g/litre.',
    organic_solution: 'Spray Copper Oxychloride 50 WP @ 3g/litre or Bordeaux mixture 1% as preventive spray.',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    season: 'Rabi',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd18',
    crop_name: 'Soybean',
    disease_name: 'Yellow Mosaic Disease',
    symptoms: 'Bright yellow-green mosaic patches on leaves, pods fail to develop, plants stunted.',
    causes: 'Mungbean Yellow Mosaic Virus (MYMV) transmitted by whitefly Bemisia tabaci.',
    prevention: 'Use resistant varieties (MACS 450, Phule Agrani), install yellow sticky traps.',
    treatment: 'No direct cure. Control the whitefly vector: Spray Thiamethoxam 25 WG @ 0.3g/litre.',
    organic_solution: 'Remove and destroy infected plants immediately; spray Neem oil 5ml/litre to control whitefly.',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    season: 'Kharif',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd19',
    crop_name: 'Cucumber',
    disease_name: 'Downy Mildew (Pseudoperonospora cubensis)',
    symptoms: 'Angular, yellow water-soaked patches between veins on upper leaf surface; grey-purple mold growth on lower side.',
    causes: 'Pseudoperonospora cubensis, spreads through wind and rain splash in cool, moist weather.',
    prevention: 'Use resistant varieties, drip irrigation instead of overhead, remove infected leaves.',
    treatment: 'Spray Metalaxyl + Mancozeb 72 WP @ 2.5g/litre or Dimethomorph 50 WP @ 1g/litre.',
    organic_solution: 'Spray Copper Oxychloride 3g/litre or diluted milk solution (1:9 milk to water) as a preventive.',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    season: 'All Season',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd20',
    crop_name: 'Tomato',
    disease_name: 'Early Blight (Alternaria solani)',
    symptoms: 'Dark brown concentric ring target-board spots on older leaves; lesions enlarge and cause defoliation.',
    causes: 'Fungus Alternaria solani favored by warm temperatures (24-29°C) and leaf wetness.',
    prevention: 'Crop rotation, use certified seeds, remove crop debris, stake plants for airflow.',
    treatment: 'Spray Chlorothalonil 75 WP @ 2g/litre or Azoxystrobin 23 SC @ 1ml/litre.',
    organic_solution: 'Spray Trichoderma viride @ 5g/litre or Copper Oxychloride 3g/litre every 10-14 days.',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    season: 'All Season',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd21',
    crop_name: 'Cotton',
    disease_name: 'Alternaria Leaf Spot',
    symptoms: 'Circular brown spots with concentric rings on leaves, spots dry up and fall leaving shot-hole appearance.',
    causes: 'Fungus Alternaria macrospora, severe in warm and humid conditions.',
    prevention: 'Crop rotation, seed treatment, remove infected debris promptly.',
    treatment: 'Spray Mancozeb 75 WP @ 2.5g/litre or Iprodione 50 WP @ 1.5g/litre.',
    organic_solution: 'Spray Neem leaf extract (5%) or Pseudomonas fluorescens @ 2.5g/litre.',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    season: 'Kharif',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd22',
    crop_name: 'Paddy',
    disease_name: 'Brown Planthopper (Nilaparvata lugens)',
    symptoms: 'Circular scorched "hopper burn" patches, plants dry up and collapse; muddy odor from infested fields.',
    causes: 'Nilaparvata lugens nymphs and adults sucking phloem sap at plant base.',
    prevention: 'Plant resistant varieties (IR 36, IR 64), reduce nitrogen application, drain field water.',
    treatment: 'Spray Buprofezin 25 SC @ 1ml/litre or Pymetrozine 50 WG @ 0.3g/litre.',
    organic_solution: 'Spray Neem oil 5ml/litre near plant base; install light traps to monitor pest pressure.',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    season: 'Kharif',
    created_at: new Date().toISOString(),
  },
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
          {t('diseases.inspectBtn')}
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
                      {t('diseases.analyzing')}
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-3">
                  <div className="flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="text-xl font-bold">{t('diseases.diagnosisTitle')}</h3>
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
                        <p>{t('diseases.examiningLeaves')}</p>
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
          <EmptyState icon={<Bug className="w-10 h-10" />} title={t('diseases.emptyTitle')} message={t('diseases.emptyMsg')} />
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
                    <Eye className="w-4 h-4" /> {t('diseases.viewGuide')}
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
                    <h4 className="text-base font-bold text-slate-800 dark:text-white">{t('diseases.symptoms')}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{selected.symptoms}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 flex items-center justify-center text-amber-500 shrink-0">
                    <Bug className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 dark:text-white">{t('diseases.causes')}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{selected.causes}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-500 shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 dark:text-white">{t('diseases.prevention')}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{selected.prevention}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FlaskRound className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-purple-900 dark:text-purple-300">{t('diseases.chemical')}</h4>
                    </div>
                    <p className="text-sm text-purple-800/80 dark:text-purple-300/80 leading-relaxed">{selected.treatment}</p>
                  </div>

                  <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Leaf className="w-5 h-5 text-green-600" />
                      <h4 className="font-bold text-green-900 dark:text-green-300">{t('diseases.organic')}</h4>
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
