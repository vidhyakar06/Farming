import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { LanguageCode } from '../context/LanguageContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedFollowUps?: string[];
}

interface IntentPattern {
  id: string;
  keywords: string[];
  tamilKeywords?: string[];
  hindiKeywords?: string[];
  teluguKeywords?: string[];
  spanishKeywords?: string[];
  followUps: Record<LanguageCode, string[]>;
  response: Record<LanguageCode, string>;
}

const INTENTS: IntentPattern[] = [
  {
    id: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'namaste', 'vanakkam', 'good morning', 'good evening', 'who are you', 'how are you', 'what can you do', 'help me', 'start'],
    tamilKeywords: ['வணக்கம்', 'ஹலோ', 'யார் நீ', 'உதவி', 'காலை வணக்கம்', 'மாலை வணக்கம்', 'நலமா'],
    hindiKeywords: ['नमस्ते', 'हेलो', 'आप कौन हैं', 'मदद', 'सुप्रभात', 'प्रणाम', 'कैसे हो'],
    teluguKeywords: ['నమస్కారం', 'హలో', 'మీరు ఎవరు', 'సహాయం', 'బాగున్నారా'],
    spanishKeywords: ['hola', 'buenos días', 'buenas tardes', 'quién eres', 'ayuda', 'cómo estás'],
    followUps: {
      en: ['Best crops for my soil', 'Fertilizer calculator', 'Pest control remedies', 'Government subsidies'],
      ta: ['என் மண்ணிற்கு ஏற்ற பயிர்', 'உர கணக்கீடு', 'பூச்சி மேலாண்மை தீர்வுகள்', 'அரசு மானியங்கள்'],
      hi: ['मेरी मिट्टी के लिए सबसे अच्छी फसल', 'उर्वरक की सही मात्रा', 'कीट नियंत्रण उपाय', 'सरकारी योजनाएं'],
      te: ['నేలకు అనుకూలమైన పంటలు', 'ఎరువుల లెక్కలు', 'పురుగుల నివారణ', 'ప్రభుత్వ పథకాలు'],
      es: ['Mejores cultivos para mi suelo', 'Cálculo de fertilizantes', 'Control de plagas', 'Subsidios agrícolas'],
    },
    response: {
      en: "🌾 **Hello! I am your Smart AI Agriculture & Crop Assistant.**\n\nI can help you with:\n- 🌱 **Crop Selection & Cultivation Guides** (Paddy, Wheat, Tomato, Cotton, Sugarcane, Banana, etc.)\n- 🧪 **Fertilizer Dosage & NPK Balancing** (Urea, DAP, MOP, Vermicompost)\n- 🐛 **Pest & Disease Diagnosis** with organic & chemical treatments\n- 💧 **Smart Irrigation & Water Saving** (Drip & Sprinkler schedules)\n- 🏛️ **Government Schemes & Subsidies** (PM-KISAN, PMFBY, KCC loans)\n- 📈 **Mandi Market Prices & Selling Tips**\n\nHow can I help your farm today?",
      ta: "🌾 **வணக்கம்! நான் உங்கள் ஸ்மார்ட் AI விவசாய ஆலோசகர்.**\n\nநான் உங்களுக்கு பின்வருவனவற்றில் உதவ முடியும்:\n- 🌱 **பயிர் தேர்வு மற்றும் சாகுபடி வழிகாட்டுதல்** (நெல், பருத்தி, தக்காளி, கரும்பு, வாழை போன்றவை)\n- 🧪 **உர அளவு மற்றும் NPK மேலாண்மை** (யுரியா, டிஏபி, இயற்கை உரங்கள்)\n- 🐛 **பூச்சி மற்றும் நோய் கட்டுப்பாடு** (இயற்கை மற்றும் ரசாயன முறைகள்)\n- 💧 **நுண்ணீர் பாசன முறைகள்** (சொட்டு நீர், தெளிப்பு நீர் பாசனம்)\n- 🏛️ **அரசு மானியங்கள் & திட்டங்கள்** (PM-KISAN, PMFBY பயிர் காப்பீடு, KCC கடன்)\n- 📈 **சந்தை விலை நிலவரம் மற்றும் விற்பனை உத்திகள்**\n\nஇன்று உங்கள் பண்ணை பற்றி என்ன அறிய விரும்புகிறீர்கள்?",
      hi: "🌾 **नमस्ते! मैं आपका स्मार्ट AI कृषि एवं फसल सहायक हूँ।**\n\nमैं आपकी इन विषयों में मदद कर सकता हूँ:\n- 🌱 **फसल चयन एवं खेती की सलाह** (धान, गेहूं, कपास, टमाटर, गन्ना आदि)\n- 🧪 **उर्वरक की सही मात्रा (NPK)** (यूरिया, डीएपी, जैविक खाद)\n- 🐛 **कीट एवं रोग पहचान और उपचार** (जैविक व रासायनिक उपाय)\n- 💧 **सिंचाई एवं जल प्रबंधन** (ड्रिप व फव्वारा सिंचाई)\n- 🏛️ **सरकारी योजनाएं एवं सब्सिडी** (पीएम-किसान, फसल बीमा, केसीसी)\n- 📈 **मंडी भाव एवं सही समय पर बिक्री की सलाह**\n\nआज आप किस विषय पर जानकारी चाहते हैं?",
      te: "🌾 **నమస్కారం! నేను మీ స్మార్ట్ AI వ్యవసాయ సహాయకుడిని.**\n\nనేను మీకు సహాయపడగలను:\n- 🌱 **పంటల ఎంపిక మరియు సాగు వివరాలు** (వరి, పత్తి, టమోటా, చెరకు, అరటి మొదలైనవి)\n- 🧪 **ఎరువుల సమతుల్యత మరియు NPK లెక్కలు** (యూరియా, డీఏపీ, సేంద్రీయ ఎరువులు)\n- 🐛 **పురుగులు మరియు తెగుళ్ల నివారణ** (సేంద్రీయ మరియు రసాయన పద్ధతులు)\n- 💧 **బిందు సేద్యం మరియు నీటి యాజమాన్యం**\n- 🏛️ **ప్రభుత్వ పథకాలు మరియు సబ్సిడీలు** (పీఎం-కిసాన్, పంట బీమా, కిసాన్ క్రెడిట్ కార్డు)\n- 📈 **మార్కెట్ ధరలు మరియు అమ్మకాల సలహాలు**\n\nఈరోజు మీకు ఏ సమాచారం కావాలి?",
      es: "🌾 **¡Hola! Soy tu Asistente Agrícola Inteligente con IA.**\n\nPuedo ayudarte con:\n- 🌱 **Selección y Guía de Cultivos** (Arroz, Trigo, Tomate, Algodón, Caña de azúcar, Plátano, etc.)\n- 🧪 **Dosis de Fertilizantes y Balance NPK** (Urea, DAP, MOP, Compost)\n- 🐛 **Diagnóstico y Control de Plagas** con tratamientos orgánicos y químicos\n- 💧 **Riego Inteligente y Ahorro de Agua** (Goteo y Aspersión)\n- 🏛️ **Subsidios y Programas Agrícolas** (Créditos y Seguros)\n- 📈 **Precios de Mercado y Estrategias de Venta**\n\n¿En qué puedo ayudarte hoy?",
    },
  },
  {
    id: 'paddy_cultivation',
    keywords: ['paddy', 'rice', 'stem borer', 'paddy blast', 'rice blast', 'harvest paddy', 'paddy fertilizer', 'paddy yield', 'paddy planting', 'brown planthopper'],
    tamilKeywords: ['நெல்', 'நெல் சாகுபடி', 'குருத்துப்பூச்சி', 'குலை நோய்', 'நெல் உரம்', 'நெல் அறுவடை', 'புகையான்'],
    hindiKeywords: ['धान', 'चावल', 'धान की खेती', 'तना छेदक', 'धान का ब्लास्ट', 'धान की कटाई', 'भूरा फुदका'],
    teluguKeywords: ['వరి', 'వరి సాగు', 'కాండం తొలుచు పురుగు', 'అగ్గి తెగులు', 'వరి కోత'],
    spanishKeywords: ['arroz', 'cultivo de arroz', 'piricularia', 'barrenador', 'cosecha de arroz'],
    followUps: {
      en: ['Paddy fertilizer schedule', 'Stem borer organic control', 'Best harvest moisture for paddy'],
      ta: ['நெல் உர மேலாண்மை அட்டவணை', 'குருத்துப்பூச்சி இயற்கை கட்டுப்பாடு', 'நெல் அறுவடை சரியான நேரம்'],
      hi: ['धान के लिए उर्वरक का समय', 'तना छेदक का जैविक इलाज', 'धान की कटाई का सही समय'],
      te: ['వరి ఎరువుల షెడ్యూల్', 'పురుగు నివారణ సేంద్రీయ పద్ధతి', 'వరి కోత సరైన సమయం'],
      es: ['Fertilización para arroz', 'Control de plagas en arroz', 'Cosecha de arroz'],
    },
    response: {
      en: "🌾 **Complete Paddy (Rice) Cultivation Guide:**\n\n1. **Soil & Climate:** Clayey or loamy soil (pH 5.5 - 7.0), temperature 22°C - 35°C.\n2. **Fertilizer (Per Acre):**\n   - **Basal:** 50 kg DAP + 25 kg MOP + 10 kg Zinc Sulphate.\n   - **Tillering (20-25 days):** 35 kg Urea + 10 kg Neem cake.\n   - **Panicle Initiation (45 days):** 35 kg Urea + 20 kg MOP.\n3. **Pest & Disease Control:**\n   - **Stem Borer:** Pheromone traps (5/acre) or Chlorantraniliprole 18.5 SC (60 ml/acre).\n   - **Blast Disease:** Tricyclazole 75 WP (120 g/acre) or Pseudomonas fluorescens.\n4. **Harvesting:** Harvest when 80-85% grains turn golden yellow (moisture 20-22%).",
      ta: "🌾 **முழுமையான நெல் சாகுபடி வழிகாட்டுதல்:**\n\n1. **மண் மற்றும் தட்பவெப்ப நிலை:** களிமண் அல்லது வண்டல் மண் சிறந்தது (pH 5.5 - 7.0).\n2. **உர பரிந்துரை (ஏக்கருக்கு):**\n   - **அடி உரம்:** 50 கிலோ DAP + 25 கிலோ பொட்டாஷ் (MOP) + 10 கிலோ ஜிங்க் சல்பேட்.\n   - **தூர்கட்டும் பருவம் (20-25 நாள்):** 35 கிலோ யுரியா + வேப்பம் புண்ணாக்கு 10 கிலோ.\n   - **கதிர் பருவம் (45 நாள்):** 35 கிலோ யுரியா + 20 கிலோ பொட்டாஷ்.\n3. **பூச்சி மற்றும் நோய் மேலாண்மை:**\n   - **குருத்துப்பூச்சி:** 5 இனக்கவர்ச்சி பொறிகள் வைக்கவும் அல்லது குளோரான்ட்ரனிலிப்ரோல் 60 மி.லி/ஏக்கர் தெளிக்கவும்.\n   - **குலை நோய்:** ட்ரைசைக்ளசோல் 75 WP (120 கிராம்/ஏக்கர்) தெளிக்கவும்.\n4. **அறுவடை:** 85% கதிர்கள் பொன்னிறமாக மாறும்போது அறுவடை செய்யவும்.",
      hi: "🌾 **धान (चावल) की उन्नत खेती और देखभाल:**\n\n1. **मिट्टी:** चिकनी दोमट मिट्टी सबसे उपयुक्त (pH 5.5 - 7.0)।\n2. **खाद प्रबंधन (प्रति एकड़):**\n   - बुवाई/रोपाई पर: 50 किलो DAP + 25 किलो MOP + 10 किलो जिंक सल्फेट।\n   - कल्ले फूटते समय (20-25 दिन): 35 किलो यूरिया + नीम खली।\n   - गाभा अवस्था पर (45 दिन): 35 किलो यूरिया + 20 किलो पोटाश।\n3. **कीट नियंत्रण:** तना छेदक के लिए 5 फेरोमोन ट्रैप लगाएं और ब्लास्ट के लिए ट्राइसाइक्लाजोल का छिड़काव करें।\n4. **कटाई:** जब 80-85% बालियां सुनहरी हो जाएं तब कटाई करें।",
      te: "🌾 **వరి సాగు సమగ్ర మార్గదర్శి:**\n\n1. **నేల & వాతావరణం:** బంకమట్టి లేదా ఒండ్రు నేలలు అనుకూలం (pH 5.5 - 7.0).\n2. **ఎరువుల మోతాదు (ఎకరాకు):**\n   - **నాట్లు వేసేటప్పుడు:** 50 కేజీల డీఏపీ + 25 కేజీల పొటాష్ + 10 కేజీల జింక్ సల్ఫేట్.\n   - **పిలకల దశ (20-25 రోజులు):** 35 కేజీల యూరియా + వేప పిండి.\n   - **చిరుపొట్ట దశ (45 రోజులు):** 35 కేజీల యూరియా + 20 కేజీల పొటాష్.\n3. **తెగుళ్ల నివారణ:** కాండం తొలుచు పురుగుకు లింగాకర్షక బుట్టలు, అగ్గి తెగులుకు ట్రైసైక్లాజోల్ పిచికారీ చేయండి.",
      es: "🌾 **Guía Completa de Cultivo de Arroz:**\n\n1. **Suelo:** Arcilloso o franco (pH 5.5 - 7.0).\n2. **Fertilización por Acre:** 50 kg DAP + 25 kg MOP al sembrar; 35 kg Urea en amacollamiento y 35 kg Urea en espigado.\n3. **Control de Plagas:** Trampas de feromonas para barrenador y Triciclazol 75 WP para Piricularia.\n4. **Cosecha:** Cosechar cuando el 85% de las espigas estén doradas.",
    },
  },
  {
    id: 'tomato_cultivation',
    keywords: ['tomato', 'tomatoes', 'tomato disease', 'tomato pest', 'blight tomato', 'leaf curl tomato', 'tomato price', 'tomato yield'],
    tamilKeywords: ['தக்காளி', 'தக்காளி சாகுபடி', 'இலைச்சுருள் நோய்', 'தக்காளி விலை', 'தக்காளி நோய்'],
    hindiKeywords: ['टमाटर', 'टमाटर की खेती', 'पत्ती मरोड़ रोग', 'टमाटर का भाव', 'टमाटर का झुलसा'],
    teluguKeywords: ['టమోటా', 'టమోటా సాగు', 'ఆకు ముడుత తెగులు', 'టమోటా ధర'],
    spanishKeywords: ['tomate', 'cultivo de tomate', 'riego de tomate', 'tizón de tomate', 'plagas tomate'],
    followUps: {
      en: ['Tomato leaf curl remedy', 'Tomato drip irrigation guide', 'Organic booster for tomato yield'],
      ta: ['தக்காளி இலைச்சுருள் தீர்வு', 'தக்காளி சொட்டு நீர் பாசனம்', 'தக்காளி விளைச்சல் அதிகரிக்க இயற்கை உரம்'],
      hi: ['टमाटर पत्ती मरोड़ का इलाज', 'टमाटर में ड्रिप सिंचाई', 'टमाटर की पैदावार बढ़ाने के उपाय'],
      te: ['టమోటా ఆకు ముడుత నివారణ', 'టమోటా డ్రిప్ సాగునీరు', 'టమోటా దిగుబడి పెంచే పద్ధతులు'],
      es: ['Control de plagas en tomate', 'Riego por goteo para tomate', 'Abono orgánico para tomate'],
    },
    response: {
      en: "🍅 **Tomato High-Yield Cultivation & Care:**\n\n1. **Best Soil & Spacing:** Well-drained red loamy soil (pH 6.0-7.0). Spacing: 60 cm x 45 cm on raised beds with drip irrigation.\n2. **Nutrient Management (Per Acre):**\n   - **Basal:** 10 tons FYM + 40 kg DAP + 30 kg Potash.\n   - **Fertigation via Drip:** 19:19:19 @ 3 kg/acre weekly during vegetative growth; 0:52:34 & 13:0:45 during fruiting.\n3. **Key Disease Remedies:**\n   - **Leaf Curl Virus:** Install yellow sticky traps (15/acre) + Spray Acetamiprid 20 SP or Neem oil 5ml/L.\n   - **Blight:** Spray Mancozeb 75 WP (2.5 g/L).",
      ta: "🍅 **தக்காளி அதிக விளைச்சல் சாகுபடி வழிகாட்டி:**\n\n1. **மண் மற்றும் நடவு:** நல்ல வடிகால் வசதியுள்ள செம்மண் (pH 6.0-7.0). பாத்திகளில் சொட்டு நீர் அமைத்து 60x45 செ.மீ இடைவெளியில் நடவு செய்யவும்.\n2. **உர மேலாண்மை:** 10 டன் தொழு உரம் + 40 கிலோ DAP + 30 கிலோ பொட்டாஷ். வளர்ச்சி பருவத்தில் 19:19:19 உரம் சொட்டு நீர் மூலம் வழங்கவும்.\n3. **இலைச்சுருள் நோய்:** மஞ்சள் ஒட்டும் பொறிகள் (15/ஏக்கர்) + வேப்பெண்ணெய் (5 மிலி/லிட்டர்) தெளிக்கவும்.\n4. **கருகல் நோய்:** மேன்கோசெப் (2.5 கிராம்/லிட்டர்) தெளிக்கவும்.",
      hi: "🍅 **टमाटर की बंपर पैदावार की संपूर्ण तकनीक:**\n\n1. **मिट्टी व रोपाई:** जल निकासी वाली दोमट मिट्टी (pH 6.0-7.0)। 60x45 सेमी दूरी पर पौधे लगाएं।\n2. **उर्वरक:** 10 टन गोबर खाद + 40 किलो DAP + 30 किलो पोटाश प्रति एकड़। ड्रिप से 19:19:19 दें।\n3. **पत्ती मरोड़ रोग:** 15 पीले स्टिकी कार्ड प्रति एकड़ लगाएं और नीम तेल (5 मिली/लीटर) छिड़कें।\n4. **झुलसा रोग:** मैंकोजेब (2.5 ग्राम/लीटर) का छिड़काव करें।",
      te: "🍅 **టమోటా సాగు సూచనలు:**\n\n1. **నేల & నాట్లు:** నీరు నిలవని ఎర్ర నేలలు అనుకూలం. 60x45 సెం.మీ దూరం పాటించండి.\n2. **ఎరువులు:** ఎకరాకు 10 టన్నుల పశువుల ఎరువు + 40 కేజీల డీఏపీ + 30 కేజీల పొటాష్.\n3. **ఆకు ముడుత తెగులు:** పసుపు జిగురు బోర్డులు (15/ఎకరా) మరియు వేప నూనె 5మి.లీ/లీటరు పిచికారీ చేయండి.",
      es: "🍅 **Cultivo de Tomate de Alto Rendimiento:**\n\n1. **Suelo:** Franco bien drenado (pH 6.0-7.0). Distancia: 60x45 cm.\n2. **Fertirriego:** NPK 19:19:19 en fase vegetativa; 13:0:45 en fructificación.\n3. **Plagas:** Trampas amarillas contra mosca blanca y Mancozeb para tizón.",
    },
  },
  {
    id: 'fertilizer_npk',
    keywords: ['fertilizer', 'urea', 'dap', 'mop', 'npk', 'soil nutrients', 'nitrogen deficiency', 'phosphorus', 'potassium', 'zinc', 'organic fertilizer', 'vermicompost'],
    tamilKeywords: ['உரம்', 'யுரியா', 'டிஏபி', 'பொட்டாஷ்', 'மண்புழு உரம்', 'நைட்ரஜன் குறைபாடு', 'இயற்கை உரம்'],
    hindiKeywords: ['उर्वरक', 'खाद', 'यूरिया', 'डीएपी', 'पोटाश', 'वर्मीकम्पोस्ट', 'जैविक खाद', 'नाइट्रोजन'],
    teluguKeywords: ['ఎరువులు', 'యూరియా', 'డీఏపీ', 'పొటాష్', 'సేంద్రీయ ఎరువులు', 'వర్మీకంపోస్ట్'],
    spanishKeywords: ['fertilizante', 'urea', 'dap', 'abono', 'compost', 'nutrientes'],
    followUps: {
      en: ['Calculate fertilizer for my land area', 'How to make Jeevamrutham at home', 'Difference between DAP and SSP'],
      ta: ['என் நில பரப்பிற்கு உர கணக்கீடு', 'வீட்டிலேயே ஜீவாமிர்தம் தயாரிப்பது எப்படி', 'DAP மற்றும் SSP வித்தியாசம்'],
      hi: ['मेरी जमीन के लिए खाद की गणना', 'घर पर जीवामृत बनाने की विधि', 'DAP और SSP में अंतर'],
      te: ['నా పొలానికి ఎరువుల లెక్కలు', 'జీవామృతం తయారీ విధానం', 'డీఏపీ మరియు ఎస్ఎస్‌పీ తేడా'],
      es: ['Calcular fertilizante por hectárea', 'Preparación de compost orgánico', 'Diferencia entre DAP y SSP'],
    },
    response: {
      en: "🧪 **Complete Fertilizer & Plant Nutrition Guide:**\n\n1. **Primary Nutrients (NPK):**\n   - **Nitrogen (Urea 46% N):** Promotes rapid leaf growth & lush green color. Split into 2-3 applications.\n   - **Phosphorus (DAP 18:46:0 / SSP):** Stimulates strong root development & early flowering. Apply 100% at sowing.\n   - **Potassium (MOP 60% K):** Builds disease resistance, fruit size, weight & grain gloss.\n2. **Micronutrients:** Zinc (10 kg Zinc Sulphate/acre for cereals), Boron (1g/L for fruit cracking).\n3. **Organic Alternatives:** Vermicompost (2 tons/acre) and Jeevamrutham (200L/acre with irrigation).",
      ta: "🧪 **முழுமையான உர மற்றும் பயிர் ஊட்டச்சத்து வழிகாட்டி:**\n\n1. **முதன்மை ஊட்டச்சத்துக்கள் (NPK):**\n   - **நைட்ரஜன் (யுரியா 46% N):** பயிர் வளர்ச்சி மற்றும் பசுமைக்கு. பிரித்து இடவும்.\n   - **பாஸ்பரஸ் (DAP / SSP):** வேர் வளர்ச்சி மற்றும் பூப்பதற்கு. அடி உரமாக இடவும்.\n   - **பொட்டாசியம் (பொட்டாஷ் 60% K):** நோய் எதிர்ப்பு மற்றும் விளைச்சல் எடைக்கு.\n2. **நுண்ணூட்டச்சத்துக்கள்:** ஜிங்க் சல்பேட் (10 கிலோ/ஏக்கர்), போரான் (1 கிராம்/லிட்டர்).\n3. **இயற்கை உரங்கள்:** மண்புழு உரம் (2 டன்/ஏக்கர்), ஜீவாமிர்தம் (200 லி/ஏக்கர்).",
      hi: "🧪 **उर्वरक एवं पोषण प्रबंधन की विस्तृत जानकारी:**\n\n1. **मुख्य पोषक तत्व (NPK):**\n   - **नाइट्रोजन (यूरिया):** वानस्पतिक वृद्धि और हरियाली के लिए 2-3 बार में दें।\n   - **फॉस्फोरस (DAP/SSP):** मजबूत जड़ों के लिए बुवाई के समय दें।\n   - **पोटाश (MOP):** चमक, दाने का वजन और रोग प्रतिरोधक क्षमता बढ़ाने के लिए।\n2. **सूक्ष्म पोषक तत्व:** जिंक सल्फेट 10 किलो प्रति एकड़ दें।\n3. **जैविक खाद:** केंचुआ खाद 2 टन प्रति एकड़ या जीवामृत 200 लीटर प्रति एकड़ दें।",
      te: "🧪 **ఎరువుల సమగ్ర మార్గదర్శి:**\n\n1. **ప్రధాన పోషకాలు (NPK):**\n   - **నత్రజని (యూరియా):** ఆకుల పెరుగుదలకు.\n   - **భాస్వరం (డీఏపీ):** వేర్ల బలానికి.\n   - **పొటాష్ (ఎంఓపీ):** నాణ్యత మరియు రోగనిరోధక శక్తికి.\n2. **సేంద్రీయ ఎరువులు:** వర్మీకంపోస్ట్ 2 టన్నులు/ఎకరా లేదా జీవామృతం 200 లీటర్లు/ఎకరా.",
      es: "🧪 **Guía de Fertilizantes y Nutrición:**\n\n1. **Nutrientes Principales:**\n   - **Nitrógeno (Urea):** Crecimiento vegetativo.\n   - **Fósforo (DAP):** Desarrollo de raíces.\n   - **Potasio (MOP):** Calidad de fruto y resistencia.\n2. **Orgánicos:** Vermicompost (2 t/acre) y biofertilizantes líquidos.",
    },
  },
  {
    id: 'pest_organic',
    keywords: ['pest', 'insects', 'organic pest', 'neem oil', 'jeevamrutham', 'panchagavya', 'natural farming', 'organic remedy', 'fungus', 'leaf spot', 'aphids', 'whitefly'],
    tamilKeywords: ['பூச்சி', 'பூச்சி மருந்து', 'இயற்கை பூச்சி விரட்டி', 'வேப்பெண்ணெய்', 'பஞ்சகாவ்யா', 'ஜீவாமிர்தம்', 'அசுவினி', 'வெள்ளை ஈ'],
    hindiKeywords: ['कीट', 'कीटनाशक', 'जैविक कीटनाशक', 'नीम का तेल', 'पंचगव्य', 'जीवामृत', 'माहू', 'सफेद मक्खी'],
    teluguKeywords: ['పురుగులు', 'సేంద్రీయ పురుగు మందు', 'వేప నూనె', 'తెల్ల దోమ', 'పేనుబంక'],
    spanishKeywords: ['plagas', 'insecticida', 'aceite de neem', 'control orgánico', 'pulgones', 'mosca blanca'],
    followUps: {
      en: ['How to prepare Agniastra', 'Yellow sticky traps guide', 'Natural fungicide recipes'],
      ta: ['அக்னி அஸ்திரம் தயாரிப்பது எப்படி', 'மஞ்சள் நிற ஒட்டும் பொறி பயன்பாடு', 'இயற்கை பூஞ்சாணக்கொல்லி'],
      hi: ['अग्निअस्त्र बनाने की विधि', 'पीले स्टिकी ट्रैप का उपयोग', 'प्राकृतिक फफूंदनाशक'],
      te: ['అగ్నిఅస్త్రం తయారీ', 'పసుపు రంగు జిగురు బోర్డులు', 'సేంద్రీయ ఫంగిసైడ్'],
      es: ['Preparación de bioinsecticidas', 'Uso de trampas de color', 'Fungicidas orgánicos'],
    },
    response: {
      en: "🌿 **Natural & Organic Pest Control Formulations:**\n\n1. **Neem Oil Spray:** Mix 5 ml Neem Oil (10,000 ppm) + 2 ml liquid soap in 1 Litre water. Controls Aphids, Whiteflies, Thrips, Caterpillars.\n2. **Agniastra:** Boil 10L Cow Urine + 1kg Neem leaves + 500g Green Chillies + 500g Garlic. Dilute 200 ml per 10L water tank.\n3. **Sour Buttermilk:** 5L fermented buttermilk in 100L water cures powdery mildew and fungal leaf spots.\n4. **Sticky Traps:** Install 15 Yellow sticky traps per acre for whitefly and aphids.",
      ta: "🌿 **இயற்கை பூச்சி விரட்டி மற்றும் மேலாண்மை:**\n\n1. **வேப்பெண்ணெய் கரைசல்:** 1 லிட்டர் தண்ணீருக்கு 5 மி.லி வேப்பெண்ணெய் + 2 மி.லி சோப் கலந்து தெளிக்கவும். அசுவினி, வெள்ளை ஈக்களைக் கட்டுப்படுத்தும்.\n2. **அக்னி அஸ்திரம்:** 10 லிட்டர் கோமியம் + 1 கிலோ வேப்பிலை + 500 கிராம் காரமான மிளகாய் + பூண்டு. புழுக்களை கட்டுப்படுத்தும்.\n3. **புளித்த மோர்:** சாம்பல் நோய் மற்றும் இலைப்புள்ளி நோய்களைக் குணப்படுத்தும்.\n4. **பொறிகள்:** ஏக்கருக்கு 15 மஞ்சள் நிற ஒட்டும் பொறிகளை வைக்கவும்.",
      hi: "🌿 **प्राकृतिक एवं जैविक कीट नियंत्रण:**\n\n1. **नीम तेल:** 5 मिली नीम तेल प्रति लीटर पानी में मिलाकर छिड़कें। माहू व सफेद मक्खी दूर होगी।\n2. **अग्निअस्त्र:** गोमूत्र, नीम, तीखी मिर्च व लहसुन से तैयार काढ़ा इल्लियों का खात्मा करता है।\n3. **खट्टी छाछ:** 5 लीटर पुरानी छाछ 100 लीटर पानी में फफूंद जनित रोगों पर छिड़कें।\n4. **पीले ट्रैप:** 15 पीले स्टिकी कार्ड प्रति एकड़ लगाएं।",
      te: "🌿 **సేంద్రీయ నివారణ చర్యలు:**\n\n1. **వేప నూనె:** లీటరు నీటికి 5 మి.లీ వేప నూనె పిచికారీ చేయండి.\n2. **అగ్నిఅస్త్రం:** ఆవు మూత్రం, వేప, మిర్చి మరియు వెల్లుల్లితో తయారు చేసిన కషాయం పురుగులను నాశనం చేస్తుంది.\n3. **పులిసిన మజ్జిగ:** ఫంగస్ తెగుళ్లను అరికడుతుంది.",
      es: "🌿 **Control Orgánico de Plagas:**\n\n1. **Aceite de Neem:** 5 ml por litro de agua contra pulgón y mosca blanca.\n2. **Suero Fermentado:** 5L en 100L de agua como biofungicida.\n3. **Trampas Cromáticas:** 15 trampas amarillas por acre.",
    },
  },
  {
    id: 'government_schemes',
    keywords: ['scheme', 'subsidy', 'pm kisan', 'pmksy', 'pmfby', 'kcc', 'kisan credit card', 'loan', 'soil health card', 'enam', 'government', 'grant', 'financial'],
    tamilKeywords: ['அரசு திட்டம்', 'மானியம்', 'பிஎம் கிசான்', 'பயிர் காப்பீடு', 'கிசான் கிரெடிட் கார்டு', 'விவசாய கடன்', 'மண்வள அட்டை'],
    hindiKeywords: ['सरकारी योजना', 'सब्सिडी', 'पीएम किसान', 'फसल बीमा', 'किसान क्रेडिट कार्ड', 'केसीसी', 'कृषि ऋण', 'मृदा स्वास्थ्य कार्ड'],
    teluguKeywords: ['ప్రభుత్వ పథకాలు', 'సబ్సిడీ', 'పీఎం కిసాన్', 'రైతు బంధు', 'పంట బీమా', 'రుణాలు'],
    spanishKeywords: ['subsidio', 'ayuda gobierno', 'crédito agrícola', 'seguro agrícola', 'financiamiento'],
    followUps: {
      en: ['How to apply for PM-KISAN ₹6000', 'Subsidy on Drip Irrigation', 'Crop insurance claim process'],
      ta: ['PM-KISAN ₹6000 விண்ணப்பிப்பது எப்படி', 'சொட்டு நீர் பாசன அரசு மானியம்', 'பயிர் காப்பீடு இழப்பீடு பெறும் முறை'],
      hi: ['पीएम किसान ₹6000 के लिए आवेदन कैसे करें', 'ड्रिप सिंचाई पर 55% सब्सिडी', 'फसल बीमा क्लेम प्रक्रिया'],
      te: ['పీఎం కిసాన్ దరఖాస్తు విధానం', 'డ్రిప్ సబ్సిడీ వివరాలు', 'పంట బీమా క్లెయిమ్ విధానం'],
      es: ['Cómo solicitar subsidios agrícolas', 'Subsidio para riego por goteo', 'Reclamación de seguro agrícola'],
    },
    response: {
      en: "🏛️ **Top Government Schemes & Subsidies for Farmers:**\n\n1. **PM-KISAN:** Direct financial support of **₹6,000 per year** in 3 installments into bank accounts.\n2. **PMKSY (Micro-Irrigation):** Up to **55% - 100% subsidy** on Drip & Sprinkler irrigation systems for small/marginal farmers.\n3. **Kisan Credit Card (KCC):** Crop loans up to ₹3 Lakhs at subsidized **4% interest rate**.\n4. **PMFBY (Crop Insurance):** Only 2% premium for Kharif and 1.5% for Rabi crops against flood/drought losses.\n5. **Soil Health Card:** Free laboratory testing of 12 chemical parameters of your field soil.",
      ta: "🏛️ **விவசாயிகளுக்கான முக்கிய அரசு திட்டங்கள் & மானியங்கள்:**\n\n1. **PM-KISAN திட்டம்:** ஆண்டுக்கு **₹6,000 நேரடி நிதி உதவி** (3 தவணைகளில் தலா ₹2,000 வங்கிக் கணக்கில்).\n2. **சொட்டு நீர் பாசன மானியம் (PMKSY):** சிறு, குறு விவசாயிகளுக்கு 100% வரை அரசு மானியம்.\n3. **கிசான் கிரெடிட் கார்டு (KCC):** வெறும் **4% மிகக் குறைந்த வட்டியில் விவசாய கடன்**.\n4. **பயிர் காப்பீட்டுத் திட்டம் (PMFBY):** குறைந்த பிரீமியத்தில் பயிர் இழப்பீட்டு பாதுகாப்பு.\n5. **மண்வள அட்டை திட்டம்:** உங்கள் நிலத்தின் 12 சத்துக்களையும் இலவசமாக பரிசோதித்துக் கொள்ளலாம்.",
      hi: "🏛️ **किसानों के लिए प्रमुख सरकारी योजनाएं और सब्सिडी:**\n\n1. **PM-KISAN:** प्रति वर्ष **₹6,000 की आर्थिक मदद** (₹2,000 की 3 किस्तें सीधे बैंक खाते में)।\n2. **PMKSY:** ड्रिप व फव्वारा सिंचाई पर **55% तक सब्सिडी**।\n3. **किसान क्रेडिट कार्ड (KCC):** समय पर चुकाने पर मात्र **4% ब्याज दर** पर ₹3 लाख तक का ऋण।\n4. **प्रधानमंत्री फसल बीमा (PMFBY):** खरीफ 2% व रबी 1.5% प्रीमियम पर प्राकृतिक आपदाओं से पूर्ण सुरक्षा।\n5. **मृदा स्वास्थ्य कार्ड:** मिट्टी की उर्वरता की निःशुल्क जांच।",
      te: "🏛️ **ప్రభుత్వ పథకాలు & సబ్సిడీల వివరాలు:**\n\n1. **పీఎం-కిసాన్:** సంవత్సరానికి **₹6,000 ఆర్థిక సహాయం** (3 విడతలలో బ్యాంక్ ఖాతాకు).\n2. **బిందు సేద్యం సబ్సిడీ (PMKSY):** డ్రిప్ మరియు స్ప్రింక్లర్లపై సబ్సిడీ.\n3. **కిసాన్ క్రెడిట్ కార్డ్ (KCC):** కేవలం **4% వడ్డీతో పంట రుణాలు**.\n4. **ప్రధానమంత్రి పంట బీమా (PMFBY):** ప్రకృతి వైపరీత్యాల నుండి పంటకు బీమా రక్షణ.",
      es: "🏛️ **Programas y Subsidios Agrícolas:**\n\n1. **Apoyo Financiero Directo:** Subsidios anuales para insumos agrícolas.\n2. **Riego Tecnificado:** Hasta 55% de subsidio en sistemas de goteo.\n3. **Crédito Preferencial:** Préstamos agrícolas con tasas de interés bajas.\n4. **Seguro Agrícola:** Protección contra sequías e inundaciones.",
    },
  },
  {
    id: 'market_price',
    keywords: ['market price', 'mandi rate', 'price of tomato', 'price of onion', 'mandi', 'sell crop', 'best time to sell', 'cold storage', 'enam portal'],
    tamilKeywords: ['சந்தை விலை', 'மண்டி விலை', 'தக்காளி விலை', 'வெங்காயம் விலை', 'பயிர் விற்பனை', 'விலை நிலவரம்'],
    hindiKeywords: ['मंडी भाव', 'बाजार मूल्य', 'टमाटर का भाव', 'प्याज का भाव', 'फसल कब बेचें', 'कोल्ड स्टोरेज'],
    teluguKeywords: ['మార్కెట్ ధరలు', 'మండి రేట్లు', 'టమోటా ధర', 'ఉల్లిపాయ ధర', 'పంట అమ్మకం'],
    spanishKeywords: ['precios de mercado', 'precio tomate', 'precio cebolla', 'vender cosecha', 'mandi'],
    followUps: {
      en: ['View live Market Prices tab', 'How to register on e-NAM', 'Cold storage tips for perishables'],
      ta: ['நேரலை சந்தை விலைகள் பக்கம் பார்க்க', 'e-NAM தளத்தில் பதிவு செய்வது எப்படி', 'காய்கறி சேமிப்பு முறைகள்'],
      hi: ['लाइव मंडी भाव पेज देखें', 'e-NAM पर पंजीकरण कैसे करें', 'सब्जियों के भंडारण के तरीके'],
      te: ['మార్కెట్ ధరల పేజీ చూడండి', 'ఈ-నామ్ రిజిస్ట్రేషన్ వివరాలు', 'నిల్వ పద్ధతులు'],
      es: ['Consultar precios de mercado', 'Técnicas de almacenamiento', 'Plataformas de venta'],
    },
    response: {
      en: "📈 **Smart Market & Price Intelligence Advice:**\n\n1. **Track Live Mandi Prices:** Check our **Market Prices** tab for real-time rates across 20+ mandis.\n2. **Grading & Sorting:** Separating grade A from grade B produce increases sale profits by 25-35%.\n3. **Direct Selling & FPOs:** Sell through Farmer Producer Organizations to eliminate middleman commissions.\n4. **e-NAM Portal:** Trade online with buyers across India for competitive bids.",
      ta: "📈 **சந்தை விலை மற்றும் விற்பனை வழிகாட்டுதல்:**\n\n1. நமது பயன்பாட்டின் **சந்தை விலைகள் (Market Prices)** பகுதியில் நேரலை விலைகளை பார்க்கலாம்.\n2. விளைபொருட்களைத் தரம் பிரித்து விற்பதால் 30% வரை கூடுதல் லாபம் கிடைக்கும்.\n3. இடைத்தரகர்கள் இன்றி உழவர் சந்தை அல்லது FPO மூலம் நேரடியாக விற்கவும்.\n4. e-NAM தளம் மூலம் இந்தியா முழுவதும் ஆன்லைனில் விற்கலாம்.",
      hi: "📈 **मंडी भाव एवं स्मार्ट बिक्री रणनीति:**\n\n1. हमारी ऐप के **बाजार मूल्य** पेज पर 20+ मंडियों के लाइव भाव देखें।\n2. ग्रेडिंग और छंटाई करने से 25-35% तक अधिक दाम मिलते हैं।\n3. FPO या किसान मंडी के माध्यम से बिचौलियों के बिना सीधे बेचें।\n4. e-NAM पोर्टल पर पंजीकरण कर पूरे भारत के खरीदारों से जुड़ें।",
      te: "📈 **మార్కెట్ ధరలు మరియు అమ్మకాల వ్యూహాలు:**\n\n1. మన యాప్‌లోని **మార్కెట్ ధరల పేజీ**లో లైవ్ ధరలను చూడండి.\n2. గ్రేడింగ్ చేసి అమ్మడం ద్వారా 25-35% ఎక్కువ లాభం పొందవచ్చు.\n3. దళారులు లేకుండా FPO లేదా రైతు బజార్ల ద్వారా నేరుగా అమ్మండి.",
      es: "📈 **Inteligencia de Mercados Agrícolas:**\n\n1. Consulte nuestra pestaña de **Precios de Mercado** para ver cotizaciones en tiempo real.\n2. Clasificar su cosecha por calidades incrementa sus ganancias hasta un 30%.\n3. Venda directamente a través de cooperativas agrícolas.",
    },
  },
];

function generateSmartFallback(query: string, lang: LanguageCode): { reply: string; followUps: string[] } {
  const lower = query.toLowerCase();

  let bestMatch: IntentPattern | null = null;
  let highestScore = 0;

  for (const intent of INTENTS) {
    let score = 0;
    const allKeywords = [
      ...intent.keywords,
      ...(intent.tamilKeywords || []),
      ...(intent.hindiKeywords || []),
      ...(intent.teluguKeywords || []),
      ...(intent.spanishKeywords || []),
    ];

    for (const kw of allKeywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += kw.length;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = intent;
    }
  }

  if (bestMatch && highestScore > 0) {
    return {
      reply: bestMatch.response[lang] || bestMatch.response.en,
      followUps: bestMatch.followUps[lang] || bestMatch.followUps.en,
    };
  }

  // Universal dynamic response tailored in the selected language
  const universalFallbacks: Record<LanguageCode, { reply: string; followUps: string[] }> = {
    en: {
      reply: `🌾 **Agricultural AI Consultation for:** *"${query}"*\n\n1. **Crop Health & Soil Care:** Ensure balanced nutrition (NPK) and adequate organic carbon using farmyard manure or vermicompost.\n2. **Pest & Disease Prevention:** Apply 5 ml Neem oil per liter of water during early infestation to prevent spread.\n3. **Water Management:** Implement drip or sprinkler irrigation to conserve up to 40% water.\n4. **Market & Advisory:** Explore our dedicated tabs for live mandi prices, disease photo inspection, and weather forecasts.\n\n*Feel free to ask about specific crops, diseases, fertilizer doses, or government grants!*`,
      followUps: ['Best crops for my soil', 'Fertilizer calculator', 'Pest control remedies', 'Government subsidies'],
    },
    ta: {
      reply: `🌾 **உங்கள் கேள்விக்கான விவசாய AI ஆலோசனை:** *"${query}"*\n\n1. **பயிர் மற்றும் மண் பராமரிப்பு:** தொழு உரம் அல்லது மண்புழு உரம் இட்டு மண்ணின் அங்கக வளத்தை மேம்படுத்துங்கள்.\n2. **பூச்சி மற்றும் நோய் கட்டுப்பாடு:** தொடக்க நிலையில் 5 மி.லி வேப்பெண்ணெய் கரைசல் தெளிப்பது நோய்களைத் தடுக்கும்.\n3. **நீர் மேலாண்மை:** சொட்டு நீர் பாசனம் அமைப்பதன் மூலம் 40% வரை தண்ணீரைச் சேமிக்கலாம்.\n4. **சந்தை மற்றும் வானிலை:** நேரலை மண்டி விலைகள் மற்றும் வானிலை முன்னறிவிப்புகளைப் பார்வையிடுங்கள்.\n\n*நெல், தக்காளி, பருத்தி, கரும்பு அல்லது அரசு திட்டங்கள் பற்றி மேலும் கேட்கலாம்!*`,
      followUps: ['என் மண்ணிற்கு ஏற்ற பயிர்', 'உர கணக்கீடு', 'பூச்சி மேலாண்மை தீர்வுகள்', 'அரசு மானியங்கள்'],
    },
    hi: {
      reply: `🌾 **आपके प्रश्न के लिए कृषि AI परामर्श:** *"${query}"*\n\n1. **फसल एवं मिट्टी स्वास्थ्य:** संतुलित NPK और गोबर की सड़ी खाद या वर्मीकम्पोस्ट का प्रयोग करें।\n2. **कीट एवं रोग रोकथाम:** शुरुआती अवस्था में 5 मिली नीम तेल प्रति लीटर पानी में मिलाकर छिड़कें।\n3. **जल प्रबंधन:** ड्रिप सिंचाई अपनाकर 40% तक पानी की बचत करें।\n4. **मंडी एवं मौसम:** लाइव मंडी भाव और मौसम पूर्वानुमान के लिए संबंधित पेज देखें।\n\n*धान, गेहूं, टमाटर, कपास या सरकारी योजनाओं के बारे में और प्रश्न पूछ सकते हैं!*`,
      followUps: ['मेरी मिट्टी के लिए सबसे अच्छी फसल', 'उर्वरक की सही मात्रा', 'कीट नियंत्रण उपाय', 'सरकारी योजनाएं'],
    },
    te: {
      reply: `🌾 **మీ ప్రశ్నకు వ్యవసాయ AI సలహా:** *"${query}"*\n\n1. **నేల మరియు పంట సంరక్షణ:** సేంద్రీయ ఎరువులతో నేల సారాన్ని పెంచుకోండి.\n2. **పురుగుల నివారణ:** ప్రారంభ దశలో లీటరు నీటికి 5 మి.లీ వేప నూనె పిచికారీ చేయండి.\n3. **సాగునీటి యాజమాన్యం:** బిందు సేద్యం ద్వారా నీటిని ఆదా చేయండి.\n4. **మార్కెట్ ధరలు:** తాజా మార్కెట్ ధరలు మరియు వాతావరణ సమాచారాన్ని పరిశీలించండి.`,
      followUps: ['నేలకు అనుకూలమైన పంటలు', 'ఎరువుల లెక్కలు', 'పురుగుల నివారణ', 'ప్రభుత్వ పథకాలు'],
    },
    es: {
      reply: `🌾 **Consulta Agrícola de IA para:** *"${query}"*\n\n1. **Salud del Suelo:** Aplique nutrición balanceada (NPK) y materia orgánica como vermicompost.\n2. **Control de Plagas:** Aplique 5 ml de aceite de neem por litro de agua ante los primeros síntomas.\n3. **Manejo del Agua:** Utilice riego por goteo para ahorrar hasta un 40% de agua.\n4. **Mercado y Clima:** Consulte nuestras secciones de precios en vivo y pronóstico del tiempo.`,
      followUps: ['Mejores cultivos para mi suelo', 'Cálculo de fertilizantes', 'Control de plagas', 'Subsidios agrícolas'],
    },
  };

  return universalFallbacks[lang] || universalFallbacks.en;
}

export function getStoredApiKey(): string {
  try {
    const local = localStorage.getItem('gemini_api_key');
    if (local && local.trim()) return local.trim();
  } catch {
    // Ignore localStorage errors
  }
  const envKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY ||
                 (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GOOGLE_API_KEY;
  return envKey ? envKey.trim() : '';
}

export function setStoredApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem('gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  } catch {
    // Ignore localStorage errors
  }
}

export async function getAIResponse(
  userQuery: string,
  language: LanguageCode,
  history: ChatMessage[] = []
): Promise<{ reply: string; followUps: string[] }> {
  const geminiApiKey = getStoredApiKey();

  if (geminiApiKey) {
    const langNames: Record<LanguageCode, string> = {
      en: 'English',
      ta: 'Tamil (தமிழ்)',
      hi: 'Hindi (हिंदी)',
      te: 'Telugu (తెలుగు)',
      es: 'Spanish (Español)',
    };

    const systemInstruction = `You are a helpful, intelligent, and versatile AI assistant named KrishiBot.
You specialize in Agriculture and Crop Advisory for Indian farmers, but you are also highly capable of answering ANY question the user asks on ANY topic.
CRITICAL LANGUAGE RULE: You MUST respond 100% in ${langNames[language]}. Do NOT mix English words unless they are technical terms or proper names. Every word and explanation must be completely in ${langNames[language]}.
Provide clear, actionable, and practical advice. Format responses with relevant emojis, bullet points, and step-by-step guidance where helpful.`;

    const modelsToTry = [
      'gemini-1.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-pro',
      'gemini-2.0-flash-exp',
    ];

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    for (const modelName of modelsToTry) {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction,
          safetySettings,
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 1024,
            topP: 0.9,
          },
        });

        // Build chat history (exclude last user message — that's the current query)
        const chatHistory = history.slice(-6).map((msg) => ({
          role: msg.role === 'assistant' ? ('model' as const) : ('user' as const),
          parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({ history: chatHistory });
        const result = await chat.sendMessage(userQuery);
        const text = result.response.text();

        if (text && text.trim()) {
          const fallback = generateSmartFallback(userQuery, language);
          return { reply: text.trim(), followUps: fallback.followUps };
        }
      } catch (e: any) {
        const msg = e?.message || '';
        // If rate limited or quota exceeded, try next model
        if (msg.includes('429') || msg.includes('quota') || msg.includes('overloaded')) {
          console.warn(`Model ${modelName} overloaded, trying next...`);
          continue;
        }
        // If it's a 404 Not Found (e.g. model not available for this key type) try next model
        if (msg.includes('404 Not Found') || msg.includes('is not found')) {
           console.warn(`Model ${modelName} not available for this key, trying next...`);
           continue;
        }
        // API key invalid
        if (msg.includes('400') || msg.includes('API_KEY') || msg.includes('invalid') || msg.includes('403')) {
          console.error('Invalid API key:', e);
          return { 
            reply: '⚠️ **API Key Error:** The Gemini API key provided is invalid or does not have access. Please ensure you generated a valid key from Google AI Studio (usually starts with "AIzaSy..."). \n\nClick the "Set API Key" button above to update your key.', 
            followUps: [] 
          };
        }
        console.warn(`Gemini model ${modelName} error:`, e);
      }
    }
    
    // If we exhausted all models and none worked but they had a key:
    return {
      reply: '⚠️ **Connection Error:** Could not connect to Gemini AI. The API key might be restricted, or the models are not available in your region. \n\nPlease generate a new standard API key from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) and try again.',
      followUps: []
    };
  }

  return generateSmartFallback(userQuery, language);
}
