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
  followUps: {
    en: string[];
    ta: string[];
    hi: string[];
    te: string[];
    es: string[];
  };
  response: {
    en: string;
    ta: string;
    hi: string;
    te: string;
    es: string;
  };
}

const INTENTS: IntentPattern[] = [
  {
    id: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'namaste', 'vanakkam', 'good morning', 'good evening', 'who are you', 'how are you', 'what can you do', 'help me'],
    tamilKeywords: ['வணக்கம்', 'ஹலோ', 'யார் நீ', 'உதவி', 'காலை வணக்கம்'],
    hindiKeywords: ['नमस्ते', 'हेलो', 'आप कौन हैं', 'मदद', 'सुप्रभात', 'प्रणाम'],
    teluguKeywords: ['నమస్కారం', 'హలో', 'మీరు ఎవరు', 'సహాయం'],
    followUps: {
      en: ['Best crops for my soil', 'Fertilizer calculator', 'Pest control remedies', 'Government subsidies'],
      ta: ['என் மண்ணிற்கு ஏற்ற பயிர்', 'உர கணக்கீடு', 'பூச்சி மேலாண்மை தீர்வுகள்', 'அரசு மானியங்கள்'],
      hi: ['मेरी मिट्टी के लिए सबसे अच्छी फसल', 'उर्वरक की सही मात्रा', 'कीट नियंत्रण उपाय', 'सरकारी योजनाएं'],
      te: ['నేలకు అనుకూలమైన పంటలు', 'ఎరువుల లెక్కలు', 'పురుగుల నివారణ', 'ప్రభుత్వ పథకాలు'],
      es: ['Mejores cultivos para mi suelo', 'Cálculo de fertilizantes', 'Control de plagas', 'Subsidios agrícolas'],
    },
    response: {
      en: "🌾 **Hello! I am your AI Agriculture & Smart Crop Assistant.**\n\nI can help you with:\n- 🌱 **Crop Selection & Cultivation Guides** (Paddy, Wheat, Tomato, Cotton, Sugarcane, etc.)\n- 🧪 **Fertilizer Dosage & NPK Balancing** (Urea, DAP, MOP, Organic vermicompost)\n- 🐛 **Pest & Disease Diagnosis** with organic (Neem, Agniastra) and chemical remedies\n- 💧 **Smart Irrigation & Water Saving** (Drip, Sprinkler schedules)\n- 🏛️ **Government Schemes & Subsidies** (PM-KISAN, PMFBY, KCC loans)\n- 📈 **Mandi Market Prices & Selling Strategies**\n\nHow can I help you and your farm today?",
      ta: "🌾 **வணக்கம்! நான் உங்கள் AI விவசாய ஸ்மார்ட் ஆலோசகர்.**\n\nநான் உங்களுக்கு பின்வருவனவற்றில் உதவ முடியும்:\n- 🌱 **பயிர் தேர்வு மற்றும் சாகுபடி வழிகாட்டுதல்** (நெல், பருத்தி, தக்காளி, கரும்பு போன்றவை)\n- 🧪 **உர அளவு மற்றும் NPK மேலாண்மை** (யுரியா, டிஏபி, இயற்கை உரங்கள்)\n- 🐛 **பூச்சி மற்றும் நோய் கட்டுப்பாடு** (இயற்கை மற்றும் ரசாயன முறைகள்)\n- 💧 **நுண்ணீர் பாசன முறைகள்** (சொட்டு நீர், தெளிப்பு நீர் பாசனம்)\n- 🏛️ **அரசு மானியங்கள் & திட்டங்கள்** (PM-KISAN, PMFBY பயிர் காப்பீடு, KCC கடன்)\n- 📈 **சந்தை விலை நிலவரம் மற்றும் விற்பனை உத்திகள்**\n\nஇன்று உங்கள் பண்ணை பற்றி என்ன அறிய விரும்புகிறீர்கள்?",
      hi: "🌾 **नमस्ते! मैं आपका AI कृषि एवं स्मार्ट फसल सहायक हूँ।**\n\nमैं आपकी इन विषयों में मदद कर सकता हूँ:\n- 🌱 **फसल चयन एवं खेती की सलाह** (धान, गेहूं, कपास, टमाटर आदि)\n- 🧪 **उर्वरक की सही मात्रा (NPK)** (यूरिया, डीएपी, जैविक खाद)\n- 🐛 **कीट एवं रोग पहचान और उपचार** (जैविक व रासायनिक उपाय)\n- 💧 **सिंचाई एवं जल प्रबंधन** (ड्रिप व स्प्रिंकलर सिंचाई)\n- 🏛️ **सरकारी योजनाएं एवं सब्सिडी** (पीएम-किसान, फसल बीमा, केसीसी)\n- 📈 **मंडी भाव एवं सही समय पर बिक्री की सलाह**\n\nआज आप किस विषय पर जानकारी चाहते हैं?",
      te: "🌾 **నమస్కారం! నేను మీ AI వ్యవసాయ స్మార్ట్ అసిస్టెంట్‌ని.**\n\nపంటల ఎంపిక, ఎరువుల మోతాదు, చీడపీడల నివారణ, సాగునీటి పద్ధతులు మరియు ప్రభుత్వ పథకాల వివరాలలో సహాయం చేయగలను.",
      es: "🌾 **¡Hola! Soy tu asistente de Inteligencia Artificial para Agricultura.**\n\nPuedo ayudarte con selección de cultivos, cálculo de fertilizantes, control orgánico de plagas, sistemas de riego y precios de mercado.",
    },
  },
  {
    id: 'paddy_cultivation',
    keywords: ['paddy', 'rice', 'stem borer', 'paddy blast', 'rice blast', 'harvest paddy', 'paddy fertilizer', 'paddy yield', 'paddy planting'],
    tamilKeywords: ['நெல்', 'நெல் சாகுபடி', 'குருத்துப்பூச்சி', 'குலை நோய்', 'நெல் உரம்', 'நெல் அறுவடை'],
    hindiKeywords: ['धान', 'चावल', 'धान की खेती', 'तना छेदक', 'धान का ब्लास्ट', 'धान की कटाई'],
    teluguKeywords: ['వరి', 'వరి సాగు', 'కాండం తొలుచు పురుగు', 'అగ్గి తెగులు'],
    followUps: {
      en: ['Paddy fertilizer schedule', 'Stem borer organic control', 'Best harvest moisture for paddy'],
      ta: ['நெல் உர மேலாண்மை அட்டவணை', 'குருத்துப்பூச்சி இயற்கை கட்டுப்பாடு', 'நெல் அறுவடை சரியான நேரம்'],
      hi: ['धान के लिए उर्वरक का समय', 'तना छेदक का जैविक इलाज', 'धान की कटाई का सही समय'],
      te: ['వరి ఎరువుల షెడ్యూల్', 'పురుగు నివారణ సేంద్రీయ పద్ధతి', 'వరి కోత సరైన సమయం'],
      es: ['Fertilización para arroz', 'Control de plagas en arroz', 'Cosecha de arroz'],
    },
    response: {
      en: "🌾 **Complete Paddy (Rice) Cultivation Guide:**\n\n1. **Soil & Climate:** Clayey or loamy soil (pH 5.5 - 7.0), temperature 22°C - 35°C.\n2. **Fertilizer (Per Acre):**\n   - **Basal:** 50 kg DAP + 25 kg MOP + 10 kg Zinc Sulphate.\n   - **Tillering (20-25 days):** 35 kg Urea + 10 kg Neem cake.\n   - **Panicle Initiation (45 days):** 35 kg Urea + 20 kg MOP.\n3. **Pest & Disease Control:**\n   - **Stem Borer:** Pheromone traps (5/acre) or Chlorantraniliprole 18.5 SC (60 ml/acre).\n   - **Blast Disease:** Tricyclazole 75 WP (120 g/acre) or Pseudomonas biocontrol.\n4. **Harvesting:** Harvest when 80-85% grains turn golden yellow (moisture 20-22%).",
      ta: "🌾 **முழுமையான நெல் சாகுபடி வழிகாட்டுதல்:**\n\n1. **மண் மற்றும் தட்பவெப்ப நிலை:** களிமண் அல்லது வண்டல் மண் சிறந்தது (pH 5.5 - 7.0).\n2. **உர பரிந்துரை (ஏக்கருக்கு):**\n   - **அடி உரம்:** 50 கிலோ DAP + 25 கிலோ பொட்டாஷ் (MOP) + 10 கிலோ ஜிங்க் சல்பேட்.\n   - **தூர்கட்டும் பருவம்:** 35 கிலோ யுரியா + வேப்பம் புண்ணாக்கு 10 கிலோ.\n   - **கதிர் பருவம்:** 35 கிலோ யுரியா + 20 கிலோ பொட்டாஷ்.\n3. **பூச்சி மற்றும் நோய் மேலாண்மை:**\n   - **குருத்துப்பூச்சி:** 5 இனக்கவர்ச்சி பொறிகள் வைக்கவும் அல்லது குளோரான்ட்ரனிலிப்ரோல் 60 மி.லி/ஏக்கர் தெளிக்கவும்.\n   - **குலை நோய்:** ட்ரைசைக்ளசோல் 75 WP (120 கிராம்/ஏக்கர்) தெளிக்கவும்.",
      hi: "🌾 **धान (चावल) की उन्नत खेती और देखभाल:**\n\n1. **मिट्टी:** चिकनी दोमट मिट्टी सबसे उपयुक्त (pH 5.5 - 7.0)।\n2. **खाद प्रबंधन (प्रति एकड़):**\n   - बुवाई/रोपाई पर: 50 किलो DAP + 25 किलो MOP + 10 किलो जिंक સல்பેટ।\n   - कल्ले फूटते समय: 35 किलो यूरिया + नीम खली।\n   - गाभा अवस्था पर: 35 किलो यूरिया + 20 किलो पोटाश।\n3. **कीट नियंत्रण:** तना छेदक के लिए फेरोमोन ट्रैप लगाएं और ब्लास्ट के लिए ट्राइसाइक्लाजोल का छिड़काव करें।",
      te: "🌾 **వరి సాగు పద్ధతులు:** 50 కేజీల డీఏపీ + 25 కేజీల పొటాష్ + 10 కేజీల జింక్ సల్ఫేట్. కాండం తొలుచు పురుగుకు లింగాకర్షక బుట్టలు పెట్టండి.",
      es: "🌾 **Cultivo de Arroz:** Suelo arcilloso, fertilización NPK balanceada y cosecha al 20% de humedad.",
    },
  },
  {
    id: 'tomato_cultivation',
    keywords: ['tomato', 'tomatoes', 'tomato disease', 'tomato pest', 'blight tomato', 'leaf curl tomato', 'tomato price', 'tomato yield'],
    tamilKeywords: ['தக்காளி', 'தக்காளி சாகுபடி', 'இலைச்சுருள் நோய்', 'தக்காளி விலை', 'தக்காளி நோய்'],
    hindiKeywords: ['टमाटर', 'टमाटर की खेती', 'पत्ती मरोड़ रोग', 'टमाटर का भाव', 'टमाटर का झुलसा'],
    teluguKeywords: ['టమోటా', 'టమోటా సాగు', 'ఆకు ముడుత తెగులు'],
    followUps: {
      en: ['Tomato leaf curl remedy', 'Tomato drip irrigation guide', 'Organic booster for tomato yield'],
      ta: ['தக்காளி இலைச்சுருள் தீர்வு', 'தக்காளி சொட்டு நீர் பாசனம்', 'தக்காளி விளைச்சல் அதிகரிக்க இயற்கை உரம்'],
      hi: ['टमाटर पत्ती मरोड़ का इलाज', 'टमाटर में ड्रिप सिंचाई', 'टमाटर की पैदावार बढ़ाने के उपाय'],
      te: ['టమోటా ఆకు ముడుత నివారణ', 'టమోటా డ్రిప్ సాగునీరు'],
      es: ['Control de plagas en tomate', 'Riego por goteo para tomate'],
    },
    response: {
      en: "🍅 **Tomato High-Yield Cultivation & Care:**\n\n1. **Best Soil & Spacing:** Well-drained red loamy soil (pH 6.0-7.0). Spacing: 60 cm x 45 cm on raised beds with drip irrigation.\n2. **Nutrient Management (Per Acre):**\n   - **Basal:** 10 tons FYM + 40 kg DAP + 30 kg Potash.\n   - **Fertigation via Drip:** 19:19:19 @ 3 kg/acre weekly during vegetative growth; 0:52:34 & 13:0:45 during fruiting.\n3. **Key Disease Remedies:**\n   - **Leaf Curl Virus:** Install yellow sticky traps (15/acre) + Spray Acetamiprid 20 SP or Neem oil 5ml/L.\n   - **Blight:** Spray Mancozeb 75 WP (2.5 g/L).",
      ta: "🍅 **தக்காளி அதிக விளைச்சல் சாகுபடி வழிகாட்டி:**\n\n1. **மண் மற்றும் நடவு:** நல்ல வடிகால் வசதியுள்ள செம்மண் (pH 6.0-7.0). பாத்திகளில் சொட்டு நீர் அமைத்து 60x45 செ.மீ இடைவெளியில் நடவு செய்யவும்.\n2. **உர மேலாண்மை:** 10 டன் தொழு உரம் + 40 கிலோ DAP + 30 கிலோ பொட்டாஷ். வளர்ச்சி பருவத்தில் 19:19:19 உரம் சொட்டு நீர் மூலம் வழங்கவும்.\n3. **இலைச்சுருள் நோய்:** மஞ்சள் ஒட்டும் பொறிகள் (15/ஏக்கர்) + வேப்பெண்ணெய் (5 மிலி/லிட்டர்) தெளிக்கவும்.",
      hi: "🍅 **टमाटर की बंपर पैदावार की संपूर्ण तकनीक:**\n\n1. **मिट्टी व रोपाई:** जल निकासी वाली दोमट मिट्टी (pH 6.0-7.0)। 60x45 सेमी दूरी पर पौधे लगाएं।\n2. **उर्वरक:** 10 टन गोबर खाद + 40 किलो DAP + 30 किलो पोटाश प्रति एकड़। ड्रिप से 19:19:19 दें।\n3. **पत्ती मरोड़ रोग:** 15 पीले स्टिकी कार्ड प्रति एकड़ लगाएं और नीम तेल (5 मिली/लीटर) छिड़कें।",
      te: "🍅 **టమోటా సాగు సూచనలు:** ఎర్ర నేలలు అనుకూలం. ఆకు ముడుత తెగులుకు పసుపు జిగురు బోర్డులు, వేప నూనె 5మి.లీ/లీటరు పిచికారీ చేయండి.",
      es: "🍅 **Cultivo de Tomate:** Riego por goteo con NPK soluble, trampas amarillas para mosca blanca y mancozeb para tizón.",
    },
  },
  {
    id: 'fertilizer_npk',
    keywords: ['fertilizer', 'urea', 'dap', 'mop', 'npk', 'soil nutrients', 'nitrogen deficiency', 'phosphorus', 'potassium', 'zinc', 'organic fertilizer', 'vermicompost'],
    tamilKeywords: ['உரம்', 'யுரியா', 'டிஏபி', 'பொட்டாஷ்', 'மண்புழு உரம்', 'நைட்ரஜன் குறைபாடு', 'இயற்கை உரம்'],
    hindiKeywords: ['उर्वरक', 'खाद', 'यूरिया', 'डीएपी', 'पोटाश', 'वर्मीकम्पोस्ट', 'जैविक खाद', 'नाइट्रोजन'],
    teluguKeywords: ['ఎరువులు', 'యూరియా', 'డీఏపీ', 'పొటాష్', 'సేంద్రీయ ఎరువులు', 'వర్మీకంపోస్ట్'],
    followUps: {
      en: ['Calculate fertilizer for my land area', 'How to make Jeevamrutham at home', 'Difference between DAP and SSP'],
      ta: ['என் நில பரப்பிற்கு உர கணக்கீடு', 'வீட்டிலேயே ஜீவாமிர்தம் தயாரிப்பது எப்படி', 'DAP மற்றும் SSP வித்தியாசம்'],
      hi: ['मेरी जमीन के लिए खाद की गणना', 'घर पर जीवामृत बनाने की विधि', 'DAP और SSP में अंतर'],
      te: ['నా పొలానికి ఎరువుల లెక్కలు', 'జీవామృతం తయారీ విధానం'],
      es: ['Calcular fertilizante por hectárea', 'Preparación de compost orgánico'],
    },
    response: {
      en: "🧪 **Complete Fertilizer & Plant Nutrition Guide:**\n\n1. **Primary Nutrients (NPK):**\n   - **Nitrogen (Urea 46% N):** Leaf growth & green color. Split into 2-3 applications.\n   - **Phosphorus (DAP 18:46:0 / SSP):** Root strength & early flowering. Apply 100% at sowing.\n   - **Potassium (MOP 60% K):** Pest resistance, fruit weight & grain shine.\n2. **Micronutrients:** Zinc (10 kg Zinc Sulphate/acre for cereals), Boron (1g/L for fruit cracking).\n3. **Organic Alternatives:** Vermicompost (2 tons/acre) and Jeevamrutham (200L/acre with irrigation).",
      ta: "🧪 **முழுமையான உர மற்றும் பயிர் ஊட்டச்சத்து வழிகாட்டி:**\n\n1. **முதன்மை ஊட்டச்சத்துக்கள் (NPK):**\n   - **நைட்ரஜன் (யுரியா):** பயிர் வளர்ச்சி மற்றும் பசுமைக்கு. பிரித்து இடவும்.\n   - **பாஸ்பரஸ் (DAP / SSP):** வேர் வளர்ச்சிக்கு. அடி உரமாக இடவும்.\n   - **பொட்டாசியம் (பொட்டாஷ்):** நோய் எதிர்ப்பு மற்றும் விளைச்சல் எடைக்கு.\n2. **இயற்கை உரங்கள்:** மண்புழு உரம் (2 டன்/ஏக்கர்), ஜீவாமிர்தம் (200 லி/ஏக்கர்).",
      hi: "🧪 **उर्वरक एवं पोषण प्रबंधन की विस्तृत जानकारी:**\n\n1. **मुख्य पोषक तत्व (NPK):**\n   - **नाइट्रोजन (यूरिया):** वानस्पतिक वृद्धि के लिए 2-3 बार में दें।\n   - **फॉस्फोरस (DAP/SSP):** मजबूत जड़ों के लिए बुवाई पर दें।\n   - **पोटाश (MOP):** चमक और वजन बढ़ाने के लिए।\n2. **जैविक खाद:** केंचुआ खाद 2 टन प्रति एकड़ या जीवामृत 200 लीटर प्रति एकड़ दें।",
      te: "🧪 **ఎరువుల సమగ్ర మార్గదర్శి:** నత్రజని ఎదుగుదలకు, భాస్వరం వేర్ల బలానికి, పొటాష్ నాణ్యతకు తోడ్పడుతాయి.",
      es: "🧪 **Guía de Fertilizantes:** Manejo balanceado de NPK y complementación con materia orgánica.",
    },
  },
  {
    id: 'pest_organic',
    keywords: ['pest', 'insects', 'organic pest', 'neem oil', 'jeevamrutham', 'panchagavya', 'natural farming', 'organic remedy', 'fungus', 'leaf spot', 'aphids', 'whitefly'],
    tamilKeywords: ['பூச்சி', 'பூச்சி மருந்து', 'இயற்கை பூச்சி விரட்டி', 'வேப்பெண்ணெய்', 'பஞ்சகாவ்யா', 'ஜீவாமிர்தம்', 'அசுவினி', 'வெள்ளை ஈ'],
    hindiKeywords: ['कीट', 'कीटनाशक', 'जैविक कीटनाशक', 'नीम का तेल', 'पंचगव्य', 'जीवामृत', 'माहू', 'सफेद मक्खी'],
    teluguKeywords: ['పురుగులు', 'సేంద్రీయ పురుగు మందు', 'వేప నూనె', 'తెల్ల దోమ', 'పేనుబంక'],
    followUps: {
      en: ['How to prepare Agniastra', 'Yellow sticky traps guide', 'Natural fungicide recipes'],
      ta: ['அக்னி அஸ்திரம் தயாரிப்பது எப்படி', 'மஞ்சள் நிற ஒட்டும் பொறி பயன்பாடு', 'இயற்கை பூஞ்சாணக்கொல்லி'],
      hi: ['अग्निअस्त्र बनाने की विधि', 'पीले स्टिकी ट्रैप का उपयोग', 'प्राकृतिक फफूंदनाशक'],
      te: ['అగ్నిఅస్త్రం తయారీ', 'పసుపు రంగు జిగురు బోర్డులు'],
      es: ['Preparación de bioinsecticidas', 'Uso de trampas de color'],
    },
    response: {
      en: "🌿 **Natural & Organic Pest Control Formulations:**\n\n1. **Neem Oil Spray:** Mix 5 ml Neem Oil + 2 ml liquid soap in 1 Litre water. Controls Aphids, Whiteflies, Thrips, Caterpillars.\n2. **Agniastra:** Boil 10L Cow Urine + 1kg Neem leaves + 500g Chillies + 500g Garlic. Spray 200 ml per 10L tank.\n3. **Sour Buttermilk:** 5L fermented buttermilk in 100L water cures powdery mildew and leaf spots.\n4. **Traps:** Use 15 Yellow sticky traps per acre for whitefly and aphids.",
      ta: "🌿 **இயற்கை பூச்சி விரட்டி மற்றும் மேலாண்மை:**\n\n1. **வேப்பெண்ணெய் கரைசல்:** 1 லிட்டர் தண்ணீருக்கு 5 மி.லி வேப்பெண்ணெய் + 2 மி.லி சோப் கலந்து தெளிக்கவும்.\n2. **அக்னி அஸ்திரம்:** 10 லிட்டர் மாட்டு கோமியம் + 1 கிலோ வேப்பிலை + 500 கிராம் மிளகாய் + பூண்டு. புழுக்களை கட்டுப்படுத்தும்.\n3. **புளித்த மோர்:** சாம்பல் நோய் மற்றும் இலைப்புள்ளி நோய்களை குணப்படுத்தும்.",
      hi: "🌿 **प्राकृतिक एवं जैविक कीट नियंत्रण:**\n\n1. **नीम तेल:** 5 मिली नीम तेल प्रति लीटर पानी में मिलाकर छिड़कें। माहू व सफेद मक्खी दूर होगी।\n2. **अग्निअस्त्र:** गोमूत्र, नीम, तीखी मिर्च व लहसुन से तैयार काढ़ा सुंडी व इल्लियों का खात्मा करता है।\n3. **खट्टी छाछ:** 5 लीटर पुरानी छाछ 100 लीटर पानी में फफूंद जनित रोगों पर छिड़कें।",
      te: "🌿 **సేంద్రీయ నివారణ:** లీటరు నీటికి 5 మి.లీ వేప నూనె పిచికారీ చేయండి. పులిసిన మజ్జిగ ఫంగస్ తెగుళ్లను అరికడుతుంది.",
      es: "🌿 **Control Orgánico:** Aceite de neem al 5%, biofungicidas a base de suero y trampas cromáticas.",
    },
  },
  {
    id: 'government_schemes',
    keywords: ['scheme', 'subsidy', 'pm kisan', 'pmksy', 'pmfby', 'kcc', 'kisan credit card', 'loan', 'soil health card', 'enam', 'government', 'grant'],
    tamilKeywords: ['அரசு திட்டம்', 'மானியம்', 'பிஎம் கிசான்', 'பயிர் காப்பீடு', 'கிசான் கிரெடிட் கார்டு', 'விவசாய கடன்', 'மண்வள அட்டை'],
    hindiKeywords: ['सरकारी योजना', 'सब्सिडी', 'पीएम किसान', 'फसल बीमा', 'किसान क्रेडिट कार्ड', 'केसीसी', 'कृषि ऋण', 'मृदा स्वास्थ्य कार्ड'],
    teluguKeywords: ['ప్రభుత్వ పథకాలు', 'సబ్సిడీ', 'పీఎం కిసాన్', 'రైతు బంధు', 'పంట బీమా'],
    followUps: {
      en: ['How to apply for PM-KISAN ₹6000', 'Subsidy on Drip Irrigation', 'Crop insurance claim process'],
      ta: ['PM-KISAN ₹6000 விண்ணப்பிப்பது எப்படி', 'சொட்டு நீர் பாசன அரசு மானியம்', 'பயிர் காப்பீடு இழப்பீடு பெறும் முறை'],
      hi: ['पीएम किसान ₹6000 के लिए आवेदन कैसे करें', 'ड्रिप सिंचाई पर 55% सब्सिडी', 'फसल बीमा क्लेम प्रक्रिया'],
      te: ['పీఎం కిసాన్ దరఖాస్తు విధానం', 'డ్రిప్ సబ్సిడీ వివరాలు'],
      es: ['Subsidios para agricultura', 'Seguros agrícolas'],
    },
    response: {
      en: "🏛️ **Top Government Schemes & Subsidies for Farmers:**\n\n1. **PM-KISAN:** Financial support of **₹6,000 per year** in 3 installments to bank accounts.\n2. **PMKSY (Micro-Irrigation):** Up to **55% subsidy** on Drip & Sprinkler systems.\n3. **Kisan Credit Card (KCC):** Crop loans up to ₹3 Lakhs at only **4% interest**.\n4. **PMFBY (Crop Insurance):** Only 2% premium for Kharif and 1.5% for Rabi crops.\n5. **Soil Health Card:** Free testing of 12 chemical parameters of your field soil.",
      ta: "🏛️ **விவசாயிகளுக்கான முக்கிய அரசு திட்டங்கள் & மானியங்கள்:**\n\n1. **PM-KISAN திட்டம்:** ஆண்டுக்கு **₹6,000 நிதி உதவி** (3 தவணைகளில் தலா ₹2,000).\n2. **சொட்டு நீர் பாசன மானியம் (PMKSY):** சிறு, குறு விவசாயிகளுக்கு 100% வரை அரசு மானியம்.\n3. **கிசான் கிரெடிட் கார்டு (KCC):** வெறும் **4% மிகக் குறைந்த வட்டியில் விவசாய கடன்**.\n4. **பயிர் காப்பீட்டுத் திட்டம் (PMFBY):** குறைந்த பிரீமியத்தில் பயிர் இழப்பீட்டு பாதுகாப்பு.",
      hi: "🏛️ **किसानों के लिए प्रमुख सरकारी योजनाएं और सब्सिडी:**\n\n1. **PM-KISAN:** प्रति वर्ष **₹6,000 की आर्थिक मदद** (₹2,000 की 3 किस्तें)।\n2. **PMKSY:** ड्रिप व फव्वारा सिंचाई पर **55% तक सब्सिडी**।\n3. **किसान क्रेडिट कार्ड (KCC):** समय पर चुकाने पर मात्र **4% ब्याज दर** पर ऋण।\n4. **प्रधानमंत्री फसल बीमा (PMFBY):** खरीफ 2% व रबी 1.5% प्रीमियम पर पूर्ण सुरक्षा।",
      te: "🏛️ **ప్రభుత్వ పథకాలు:** పీఎం-కిసాన్ ద్వారా ₹6,000, డ్రిప్ ఇరిగేషన్ సబ్సిడీ మరియు 4% వడ్డీతో కిసాన్ క్రెడిట్ కార్డు రుణాలు.",
      es: "🏛️ **Programas y Subsidios Agrícolas:** Apoyo financiero directo, subsidios para riego y créditos preferenciales.",
    },
  },
  {
    id: 'soil_health',
    keywords: ['soil', 'red soil', 'black soil', 'alluvial soil', 'clay soil', 'sandy soil', 'ph level', 'soil test', 'soil health', 'acidic soil', 'alkaline soil'],
    tamilKeywords: ['மண்', 'செம்மண்', 'கரிசல் மண்', 'வண்டல் மண்', 'மண் பரிசோதனை', 'மண் வளம்', 'களர் நிலம்'],
    hindiKeywords: ['मिट्टी', 'लाल मिट्टी', 'काली मिट्टी', 'दोमट मिट्टी', 'मृदा परीक्षण', 'अम्लीय मिट्टी', 'क्षारीय मिट्टी'],
    teluguKeywords: ['నేల', 'ఎర్ర నేలలు', 'నల్ల నేలలు', 'భూసార పరీక్ష'],
    followUps: {
      en: ['How to correct alkaline soil (pH > 8)', 'Best crops for red soil', 'How to test soil at home'],
      ta: ['களர் நிலத்தை சீர்திருத்துவது எப்படி', 'செம்மண்ணுக்கு ஏற்ற பயிர்கள்', 'மண் மாதிரி எடுக்கும் முறை'],
      hi: ['क्षारीय मिट्टी को कैसे सुधारें', 'लाल मिट्टी में क्या उगाएं', 'मिट्टी का नमूना कैसे लें'],
      te: ['నేల స్వభావాన్ని మెరుగుపరచడం ఎలా', 'ఎర్ర నేలల్లో ఏ పంటలు వేయాలి'],
      es: ['Corrección de pH del suelo', 'Cultivos para suelos arcillosos'],
    },
    response: {
      en: "🌱 **Soil Health & Type Guide:**\n\n1. **Red Soil:** Rich in Iron & Potassium, excellent drainage. Best for: Groundnut, Cotton, Pulses, Tomato, Chilli.\n2. **Black Soil:** Retains moisture exceptionally well. Best for: Cotton, Sugarcane, Soybean, Wheat.\n3. **Alluvial Soil:** Highly fertile river soil. Best for: Paddy, Wheat, Sugarcane, Vegetables.\n4. **pH Balancing:** Use Agricultural Lime for acidic soil (pH < 6) and Gypsum (500kg/acre) for alkaline soil (pH > 8).",
      ta: "🌱 **மண் வகைகள் மற்றும் பயிர் பரிந்துரை:**\n\n1. **செம்மண்:** நிலக்கடலை, பருத்தி, தக்காளி, மிளகாய், கேழ்வரகு ஏற்றவை.\n2. **கரிசல் மண்:** பருத்தி, கரும்பு, சோயாபீன்ஸ், உளுந்து சிறந்தது.\n3. **வண்டல் மண்:** நெல், கரும்பு, வாழை, காய்கறிகள்.\n4. **pH சீர்திருத்தம்:** அமில மண்ணிற்கு சுண்ணாம்பு, களர் மண்ணிற்கு ஜிப்சம் இடவும்.",
      hi: "🌱 **मिट्टी के प्रकार एवं उपयुक्त फसलें:**\n\n1. **लाल मिट्टी:** मूंगफली, कपास, दालें, टमाटर, मिर्च के लिए उत्तम।\n2. **काली मिट्टी:** कपास, गन्ना, सोयाबीन, गेहूं के लिए सबसे अच्छी।\n3. **दोमट मिट्टी:** धान, गेहूं, सब्जियां और नकदी फसलों के लिए उपयुक्त।",
      te: "🌱 **నేల రకాలు:** ఎర్ర నేలలు వేరుశనగ, పత్తికి, నల్ల నేలలు పత్తి, చెరకుకు అనుకూలం.",
      es: "🌱 **Manejo de Suelos:** Suelo rojo, negro y aluvial con corrección de pH según necesidad.",
    },
  },
  {
    id: 'market_price',
    keywords: ['market price', 'mandi rate', 'price of tomato', 'price of onion', 'mandi', 'sell crop', 'best time to sell', 'cold storage', 'enam portal'],
    tamilKeywords: ['சந்தை விலை', 'மண்டி விலை', 'தக்காளி விலை', 'வெங்காயம் விலை', 'பயிர் விற்பனை', 'விலை நிலவரம்'],
    hindiKeywords: ['मंडी भाव', 'बाजार मूल्य', 'टमाटर का भाव', 'प्याज का भाव', 'फसल कब बेचें', 'कोल्ड स्टोरेज'],
    teluguKeywords: ['మార్కెట్ ధరలు', 'మండి రేట్లు', 'టమోటా ధర', 'ఉల్లిపాయ ధర'],
    followUps: {
      en: ['View live Market Prices tab', 'How to register on e-NAM', 'Cold storage tips for perishables'],
      ta: ['நேரலை சந்தை விலைகள் பக்கம் பார்க்க', 'e-NAM தளத்தில் பதிவு செய்வது எப்படி', 'காய்கறி சேமிப்பு முறைகள்'],
      hi: ['लाइव मंडी भाव पेज देखें', 'e-NAM पर पंजीकरण कैसे करें', 'सब्जियों के भंडारण के तरीके'],
      te: ['మార్కెట్ ధరల పేజీ చూడండి', 'ఈ-నామ్ రిజిస్ట్రేషన్ వివరాలు'],
      es: ['Consultar precios de mercado', 'Técnicas de almacenamiento'],
    },
    response: {
      en: "📈 **Smart Market & Price Intelligence Advice:**\n\n1. **Track Live Mandi Prices:** Check our **Market Prices** tab for real-time rates.\n2. **Grading & Sorting:** Separating grade A from grade B quality increases profits by 25-35%.\n3. **Direct Selling & FPOs:** Sell through Farmer Producer Organizations or local Uzhavar Sandhai to eliminate middlemen commission.\n4. **e-NAM:** Trade with online buyers across India for better competitive bids.",
      ta: "📈 **சந்தை விலை மற்றும் விற்பனை வழிகாட்டுதல்:**\n\n1. நமது பயன்பாட்டின் **சந்தை விலைகள் (Market Prices)** பகுதியில் நேரலை விலைகளை பார்க்கலாம்.\n2. தரம்பிரித்து விற்பதால் 30% வரை கூடுதல் லாபம் கிடைக்கும்.\n3. இடைத்தரகர்கள் இன்றி உழவர் சந்தை அல்லது FPO மூலம் நேரடியாக விற்கவும்.",
      hi: "📈 **मंडी भाव एवं स्मार्ट बिक्री रणनीति:**\n\n1. हमारी ऐप के **बाजार मूल्य** पेज पर लाइव मंडी भाव देखें।\n2. ग्रेडिंग और छंटाई करने से 25-35% तक अधिक दाम मिलते हैं।\n3. FPO या किसान मंडी के माध्यम से बिचौलियों के बिना सीधे बेचें।",
      te: "📈 **మార్కెట్ ధరలు:** మన యాప్‌లోని మార్కెట్ ధరల పేజీని చూడండి. గ్రేడింగ్ చేసి అమ్మడం వల్ల మంచి లాభం పొందవచ్చు.",
      es: "📈 **Precios de Mercado:** Clasificación por calidades y venta directa para maximizar ganancias.",
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
    const langKey = (lang in bestMatch.response ? lang : 'en') as keyof typeof bestMatch.response;
    return {
      reply: bestMatch.response[langKey] || bestMatch.response.en,
      followUps: bestMatch.followUps[langKey] || bestMatch.followUps.en,
    };
  }

  const fallbacks: Record<LanguageCode, { reply: string; followUps: string[] }> = {
    en: {
      reply: '🌱 **Agricultural Advisory for:** *\"' + query + '\"*\n\n- **Crop Selection:** Choose high-yield varieties suited to your local soil and climate.\n- **Pest & Disease Control:** Spray 5 ml Neem Oil per liter water for early insect control or inspect our Crop Disease doctor.\n- **Fertilizer:** Ensure balanced NPK with organic vermicompost for maximum soil health.\n\nFeel free to ask about specific crops (Paddy, Tomato, Cotton, Sugarcane) or schemes!',
      followUps: ['Paddy cultivation guide', 'Tomato leaf curl cure', 'Fertilizer calculation', 'Government subsidies'],
    },
    ta: {
      reply: '🌱 **உங்கள் கேள்விக்கான விவசாய ஆலோசனை:** *\"' + query + '\"*\n\n- **பயிர் தேர்வு:** உங்கள் நிலத்தின் மண் மற்றும் பருவத்திற்கு ஏற்ப உயர் விளைச்சல் ரகங்களை தேர்வு செய்யவும்.\n- **பூச்சி கட்டுப்பாடு:** தொடக்க நிலையில் 5 மி.லி வேப்பெண்ணெய் கரைசல் தெளிப்பது நல்லது.\n- **உர மேலாண்மை:** தழை, மணி, சாம்பல் சத்துக்களை (NPK) சரியான விகிதத்தில் இடவும்.\n\nநெல், தக்காளி, பருத்தி அல்லது அரசு திட்டங்கள் பற்றி மேலும் கேட்கலாம்!',
      followUps: ['நெல் சாகுபடி வழிகாட்டி', 'தக்காளி இலைச்சுருள் தீர்வு', 'உர கணக்கீடு', 'அரசு மானியங்கள்'],
    },
    hi: {
      reply: '🌱 **आपके प्रश्न से संबंधित कृषि सलाह:** *\"' + query + '\"*\n\n- **फसल चयन:** अपनी मिट्टी और मौसम (खरीफ/रबी) के अनुसार उन्नत किस्मों का चयन करें।\n- **कीट रोकथाम:** शुरुआती अवस्था में 5 मिली नीम तेल प्रति लीटर पानी में मिलाकर छिड़कें।\n- **उर्वरक प्रबंधन:** संतुलित NPK और गोबर की खाद से मिट्टी की उर्वरता बढ़ाएं।',
      followUps: ['धान की खेती की जानकारी', 'टमाटर की बीमारी का इलाज', 'उर्वरक की सही मात्रा', 'सरकारी योजनाएं'],
    },
    te: {
      reply: '🌱 **మీ ప్రశ్నకు వ్యవసాయ సలహా:** *\"' + query + '\"*\n\nపంట ఎంపిక, సమతుల్య ఎరువుల వాడకం మరియు సేంద్రీయ పురుగుల నివారణ ద్వారా అధిక దిగుబడి సాధించవచ్చు.',
      followUps: ['వరి సాగు వివరాలు', 'టమోటా పురుగుల నివారణ', 'ఎరువుల లెక్కలు'],
    },
    es: {
      reply: '🌱 **Recomendación Agrícola para:** *\"' + query + '\"*. Monitorea el suelo, aplica fertilización balanceada y control integrado de plagas.',
      followUps: ['Cultivo de arroz', 'Control de plagas', 'Fertilizantes NPK'],
    },
  };

  return fallbacks[lang] || fallbacks.en;
}

export async function getAIResponse(
  userQuery: string,
  language: LanguageCode,
  history: ChatMessage[] = []
): Promise<{ reply: string; followUps: string[] }> {
  const geminiApiKey = (import.meta as unknown as { env?: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      const systemInstruction = `You are an expert AI Agricultural and Crop Advisory Assistant.
Provide clear, practical, actionable advice for farmers.
Format responses with clean emojis, bullet points, and step-by-step guidance.
Always respond in the requested language: "${language}" (en: English, ta: Tamil, hi: Hindi, te: Telugu, es: Spanish).
Include specific dosages (kg/acre, ml/litre) and natural remedies.`;

      const contents = [
        ...history.slice(-6).map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
        { role: 'user', parts: [{ text: userQuery }] },
      ];

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const fallback = generateSmartFallback(userQuery, language);
          return { reply: text, followUps: fallback.followUps };
        }
      }
    } catch (e) {
      console.warn('Gemini API call error:', e);
    }
  }

  return generateSmartFallback(userQuery, language);
}
