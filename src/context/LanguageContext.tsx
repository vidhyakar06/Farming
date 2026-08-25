import React, { createContext, useContext, useState } from 'react';

export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'es';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

// Dictionary of comprehensive translations
const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.farmDetails': 'Farm Details',
    'nav.cropSuggestion': 'Crop Suggestion',
    'nav.fertilizer': 'Fertilizer',
    'nav.weather': 'Weather',
    'nav.diseases': 'Diseases',
    'nav.gallery': 'Image Gallery',
    'nav.marketPrices': 'Market Prices',
    'nav.aiAssistant': 'Smart Assistant',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.adminTools': 'Admin Tools',
    'nav.contactUs': 'Contact Us',
    'nav.needHelp': 'Need Help?',
    'nav.helpSubtitle': 'Contact our support team for assistance',
    
    // Navbar & Header
    'header.notifications': 'Notifications',
    'header.markRead': 'Mark all as read',
    'header.signOut': 'Sign Out',
    'header.myProfile': 'My Profile',
    'header.settings': 'Settings',
    'header.new': 'new',

    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your account and preferences',
    'settings.display': 'Display',
    'settings.mode': 'Light/Dark Mode',
    'settings.modeDesc': 'Switch between light and dark mode',
    'settings.language': 'Language',
    'settings.selectLanguage': 'Select your preferred language',
    'settings.notifications': 'Notifications',
    'settings.pushNotif': 'Push Notifications',
    'settings.pushDesc': 'Receive alerts on weather & market prices',
    'settings.emailNotif': 'Email Alerts',
    'settings.emailDesc': 'Receive weekly advisory reports via email',
    'settings.security': 'Security',
    'settings.changePassword': 'Change Password',

    // Common
    'common.save': 'Save Changes',
    'common.cancel': 'Cancel',
    'common.search': 'Search...',
    'common.select': 'Select Language',
    'common.loading': 'Loading...',
    'common.submit': 'Submit',
    'common.viewAll': 'View All',
    'common.details': 'Details',
    'common.status': 'Status',
    'common.date': 'Date',

    // Dashboard
    'dash.welcome': 'Welcome',
    'dash.subtitle': "Here's what's happening with your farm today",
    'dash.statCrops': 'Total Crops',
    'dash.statRecs': 'My Crop Suggestions',
    'dash.statMarket': 'Market Prices',
    'dash.statFarmers': 'Farmers Using App',
    'dash.weatherTitle': 'Weather Forecast',
    'dash.humidity': 'Humidity',
    'dash.wind': 'Wind',
    'dash.chartWeather': 'Weather for Next 7 Days',
    'dash.chartSeasons': 'Crops by Season',
    'dash.chartYield': 'Expected Monthly Harvest',
    'dash.recentRecs': 'Recent Crop Suggestions',
    'dash.noRecs': 'No crop suggestions yet. Try getting your first suggestion!',
    'dash.getRecBtn': 'Get Crop Suggestions',
    'dash.match': 'match',

    // Crop Recommendation
    'crop.title': 'Crop Recommendation',
    'crop.subtitle': 'Get smart crop suggestions tailored to your soil & climate',
    'crop.nitrogen': 'Nitrogen (N)',
    'crop.phosphorus': 'Phosphorus (P)',
    'crop.potassium': 'Potassium (K)',
    'crop.ph': 'pH Level',
    'crop.rainfall': 'Rainfall (mm)',
    'crop.temperature': 'Temperature (°C)',
    'crop.humidity': 'Humidity (%)',
    'crop.soilType': 'Soil Type',
    'crop.season': 'Season',
    'crop.getRecommendation': 'Get Recommendation',
    'crop.results': 'Recommended Crops',
    'crop.confidence': 'Suitability Score',
    'crop.duration': 'Growth Duration',
    'crop.waterReq': 'Water Requirement',
    'crop.yield': 'Expected Yield',

    // Fertilizer
    'fertilizer.title': 'Fertilizer Advisory',
    'fertilizer.subtitle': 'Calculate precise fertilizer dosage for optimal yield',
    'fertilizer.crop': 'Select Crop',
    'fertilizer.area': 'Land Area (Acres)',
    'fertilizer.currentN': 'Current Nitrogen',
    'fertilizer.currentP': 'Current Phosphorus',
    'fertilizer.currentK': 'Current Potassium',
    'fertilizer.calculate': 'Calculate Dosage',
    'fertilizer.result': 'Recommended Fertilizers',
    'fertilizer.urea': 'Urea',
    'fertilizer.dap': 'DAP (Di-ammonium Phosphate)',
    'fertilizer.mop': 'MOP (Muriate of Potash)',
    'fertilizer.organic': 'Organic Alternatives',

    // Weather
    'weather.title': 'Weather Advisory',
    'weather.subtitle': 'Hyper-local weather forecasts and farming alerts',
    'weather.searchLoc': 'Search location...',
    'weather.useMyLocation': 'Use Current Location',
    'weather.tempMax': 'Highest Temp',
    'weather.tempMin': 'Lowest Temp',
    'weather.rainProb': 'Precipitation',
    'weather.farmingTip': 'Farming Advisory',
    'weather.rainAlert': 'Rainfall expected! Postpone spraying pesticides.',

    // Diseases
    'diseases.title': 'Pest & Disease Identification',
    'diseases.subtitle': 'Identify crop diseases and get organic & chemical treatments',
    'diseases.uploadImg': 'Upload Crop Photo',
    'diseases.symptoms': 'Symptoms',
    'diseases.treatment': 'Treatment & Control',
    'diseases.organic': 'Organic Remedy',
    'diseases.chemical': 'Chemical Remedy',
    'diseases.prevention': 'Prevention Tips',

    // Market Prices
    'market.title': 'Market Prices & Trends',
    'market.subtitle': 'Live mandi prices and market rate analysis',
    'market.commodity': 'Commodity',
    'market.marketName': 'Market / Mandi',
    'market.minPrice': 'Min Price (₹/qtl)',
    'market.maxPrice': 'Max Price (₹/qtl)',
    'market.modalPrice': 'Modal Price (₹/qtl)',
    'market.district': 'District',
    'market.filterCrop': 'Filter by Crop',

    // AI Assistant
    'ai.title': 'Smart AI Agriculture Assistant',
    'ai.subtitle': 'Ask anything about crops, soil, pest management, and weather',
    'ai.inputPlaceholder': 'Ask your farming question in English, Tamil, or Hindi...',
    'ai.send': 'Send',
    'ai.prompt1': 'Which crop is best for red soil in Tamil Nadu?',
    'ai.prompt2': 'How to control paddy stem borer naturally?',
    'ai.prompt3': 'What is the current market trend for tomato?',
    'ai.disclaimer': 'AI suggestions are generated based on agricultural datasets. Consult local experts for critical decisions.',

    // Reports
    'reports.title': 'Agricultural Advisory Reports',
    'reports.subtitle': 'Download and view seasonal farm advisory reports',
    'reports.downloadPdf': 'Download PDF Report',
    'reports.summary': 'Season Summary',
    'reports.soilHealth': 'Soil Health Index',

    // Profile
    'profile.title': 'Farmer Profile',
    'profile.subtitle': 'Manage your personal details, location, and farm info',
    'profile.name': 'Full Name',
    'profile.phone': 'Phone Number',
    'profile.state': 'State',
    'profile.district': 'District',
    'profile.village': 'Village / Town',
    'profile.landSize': 'Total Land Size (Acres)',
    'profile.updateProfile': 'Update Profile',
  },
  ta: {
    // Navigation
    'nav.dashboard': 'முகப்பு பலகை',
    'nav.profile': 'சுயவிவரம்',
    'nav.farmDetails': 'பண்ணை விவரங்கள்',
    'nav.cropSuggestion': 'பயிர் பரிந்துரை',
    'nav.fertilizer': 'உர பரிந்துரை',
    'nav.weather': 'வானிலை',
    'nav.diseases': 'பயிர் நோய்கள்',
    'nav.gallery': 'படத் தொகுப்பு',
    'nav.marketPrices': 'சந்தை விலைகள்',
    'nav.aiAssistant': 'ஸ்மார்ட் உதவி',
    'nav.reports': 'அறிக்கைகள்',
    'nav.settings': 'அமைப்புகள்',
    'nav.adminTools': 'நிர்வாகக் கருவிகள்',
    'nav.contactUs': 'எங்களைத் தொடர்பு கொள்ள',
    'nav.needHelp': 'உதவி தேவையா?',
    'nav.helpSubtitle': 'உதவிக்கு எங்கள் ஆதரவு குழுவைத் தொடர்பு கொள்ளவும்',

    // Navbar & Header
    'header.notifications': 'அறிவிப்புகள்',
    'header.markRead': 'அனைத்தும் படித்ததாகக் குறிக்கவும்',
    'header.signOut': 'வெளியேறு',
    'header.myProfile': 'என் சுயவிவரம்',
    'header.settings': 'அமைப்புகள்',
    'header.new': 'புதியது',

    // Settings
    'settings.title': 'அமைப்புகள்',
    'settings.subtitle': 'உங்கள் கணக்கு மற்றும் விருப்பங்களை நிர்வகிக்கவும்',
    'settings.display': 'திரை தோற்றம்',
    'settings.mode': 'வெளிச்சம் / இருள் பயன்முறை',
    'settings.modeDesc': 'வெளிச்சம் மற்றும் இருள் பயன்முறைக்கு மாறவும்',
    'settings.language': 'மொழி (Language)',
    'settings.selectLanguage': 'உங்களுக்கு விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்',
    'settings.notifications': 'அறிவிப்புகள்',
    'settings.pushNotif': 'புஷ் அறிவிப்புகள்',
    'settings.pushDesc': 'வானிலை & சந்தை விலை விழிப்பூட்டல்களைப் பெறவும்',
    'settings.emailNotif': 'மின்னஞ்சல் விழிப்பூட்டல்கள்',
    'settings.emailDesc': 'வாராந்திர ஆலோசனை அறிக்கைகளை மின்னஞ்சலில் பெறவும்',
    'settings.security': 'பாதுகாப்பு',
    'settings.changePassword': 'கடவுச்சொல்லை மாற்றவும்',

    // Common
    'common.save': 'மாற்றங்களைச் சேமி',
    'common.cancel': 'ரத்து செய்',
    'common.search': 'தேடு...',
    'common.select': 'மொழியைத் தேர்ந்தெடுக்கவும்',
    'common.loading': 'ஏற்றுகிறது...',
    'common.submit': 'சமர்ப்பி',
    'common.viewAll': 'அனைத்தையும் பார்',
    'common.details': 'விவரங்கள்',
    'common.status': 'நிலை',
    'common.date': 'தேதி',

    // Dashboard
    'dash.welcome': 'வரவேற்கிறோம்',
    'dash.subtitle': 'இன்றைய உங்கள் பண்ணை விவரங்கள்',
    'dash.statCrops': 'மொத்த பயிர்கள்',
    'dash.statRecs': 'எனது பயிர் பரிந்துரைகள்',
    'dash.statMarket': 'சந்தை விலைகள்',
    'dash.statFarmers': 'பயன்படுத்தும் விவசாயிகள்',
    'dash.weatherTitle': 'வானிலை முன்னறிவிப்பு',
    'dash.humidity': 'ஈரப்பதம்',
    'dash.wind': 'காற்றின் வேகம்',
    'dash.chartWeather': 'அடுத்த 7 நாட்களின் வானிலை',
    'dash.chartSeasons': 'பருவகால பயிர்கள்',
    'dash.chartYield': 'எதிர்பார்க்கப்படும் மாத விளைச்சல்',
    'dash.recentRecs': 'சமீபத்திய பயிர் பரிந்துரைகள்',
    'dash.noRecs': 'இன்னும் பரிந்துரைகள் இல்லை. முதல் பரிந்துரையைப் பெறவும்!',
    'dash.getRecBtn': 'பயிர் பரிந்துரை பெறுக',
    'dash.match': 'பொருத்தம்',

    // Crop Recommendation
    'crop.title': 'பயிர் பரிந்துரை',
    'crop.subtitle': 'உங்கள் மண் மற்றும் தட்பவெப்ப நிலைக்கு ஏற்ற பயிர் பரிந்துரைகள்',
    'crop.nitrogen': 'நைட்ரஜன் (N)',
    'crop.phosphorus': 'பாஸ்பரஸ் (P)',
    'crop.potassium': 'பொட்டாசியம் (K)',
    'crop.ph': 'கார அமிலத்தன்மை (pH)',
    'crop.rainfall': 'மழைப்பொழிவு (மி.மீ)',
    'crop.temperature': 'வெப்பநிலை (°C)',
    'crop.humidity': 'ஈரப்பதம் (%)',
    'crop.soilType': 'மண் வகை',
    'crop.season': 'பருவம்',
    'crop.getRecommendation': 'பரிந்துரை பெறுக',
    'crop.results': 'பரிந்துரைக்கப்பட்ட பயிர்கள்',
    'crop.confidence': 'பொருத்தமான மதிப்பெண்',
    'crop.duration': 'வளர்ச்சி காலம்',
    'crop.waterReq': 'தேவையான நீர் அளவு',
    'crop.yield': 'எதிர்பார்க்கப்படும் மகசூல்',

    // Fertilizer
    'fertilizer.title': 'உரப் பரிந்துரை',
    'fertilizer.subtitle': 'அதிக மகசூலுக்குத் தேவையான உர அளவைக் கணக்கிடுங்கள்',
    'fertilizer.crop': 'பயிரைத் தேர்ந்தெடுக்கவும்',
    'fertilizer.area': 'நில பரப்பளவு (ஏக்கர்)',
    'fertilizer.currentN': 'தற்போதைய நைட்ரஜன்',
    'fertilizer.currentP': 'தற்போதைய பாஸ்பரஸ்',
    'fertilizer.currentK': 'தற்போதைய பொட்டாசியம்',
    'fertilizer.calculate': 'உர அளவைக் கணக்கிடு',
    'fertilizer.result': 'பரிந்துரைக்கப்படும் உரங்கள்',
    'fertilizer.urea': 'யுரியா (Urea)',
    'fertilizer.dap': 'டிஏபி (DAP)',
    'fertilizer.mop': 'பொட்டாஷ் (MOP)',
    'fertilizer.organic': 'இயற்கை உர மாற்றுக்கள்',

    // Weather
    'weather.title': 'வானிலை ஆலோசனை',
    'weather.subtitle': 'உள்ளூர் வானிலை முன்னறிவிப்பு மற்றும் விவசாய விழிப்பூட்டல்கள்',
    'weather.searchLoc': 'இடத்தைத் தேடுக...',
    'weather.useMyLocation': 'தற்போதைய இடத்தைப் பயன்படுத்து',
    'weather.tempMax': 'அதிகபட்ச வெப்பநிலை',
    'weather.tempMin': 'குறைந்தபட்ச வெப்பநிலை',
    'weather.rainProb': 'மழைப்பொழிவு வாய்ப்பு',
    'weather.farmingTip': 'விவசாய ஆலோசனை',
    'weather.rainAlert': 'மழை வாய்ப்பு உள்ளது! பூச்சிக்கொல்லி தெளிப்பதை ஒத்திவைக்கவும்.',

    // Diseases
    'diseases.title': 'பயிர் நோய் மற்றும் பூச்சி கண்டறிதல்',
    'diseases.subtitle': 'பயிர் நோய்களைக் கண்டறிந்து இயற்கை மற்றும் ரசாயன தீர்வுகளைப் பெறுங்கள்',
    'diseases.uploadImg': 'பயிர் படத்தைப் பதிவேற்றவும்',
    'diseases.symptoms': 'அறிகுறிகள்',
    'diseases.treatment': 'சிகிச்சை மற்றும் கட்டுப்பாடு',
    'diseases.organic': 'இயற்கை முறை தீர்வு',
    'diseases.chemical': 'ரசாயன முறை தீர்வு',
    'diseases.prevention': 'தடுப்பு முறைகள்',

    // Market Prices
    'market.title': 'சந்தை விலைகள் & போக்குகள்',
    'market.subtitle': 'நேரலை மண்டிகளின் விவசாய விலை விவரங்கள்',
    'market.commodity': 'பொருள்',
    'market.marketName': 'சந்தை / மண்டி',
    'market.minPrice': 'குறைந்தபட்ச விலை (₹/குவிண்டால்)',
    'market.maxPrice': 'அதிகபட்ச விலை (₹/குவிண்டால்)',
    'market.modalPrice': 'சராசரி விலை (₹/குவிண்டால்)',
    'market.district': 'மாவட்டம்',
    'market.filterCrop': 'பயிரின்படி வடிகட்டவும்',

    // AI Assistant
    'ai.title': 'ஸ்மார்ட் AI விவசாய உதவி',
    'ai.subtitle': 'பயிர்கள், மண், பூச்சி மேலாண்மை மற்றும் வானிலை பற்றி கேளுங்கள்',
    'ai.inputPlaceholder': 'தமிழ், இந்தி அல்லது ஆங்கிலத்தில் கேள்வி கேளுங்கள்...',
    'ai.send': 'அனுப்பு',
    'ai.prompt1': 'தமிழ்நாட்டில் செம்மண்ணிற்கு ஏற்ற பயிர் எது?',
    'ai.prompt2': 'நெல் குருத்துப்பூச்சியை இயற்கை முறையில் கட்டுப்படுத்துவது எப்படி?',
    'ai.prompt3': 'தக்காளிக்கான தற்போதைய சந்தை விலை நிலவரம் என்ன?',
    'ai.disclaimer': 'AI பரிந்துரைகள் விவசாயத் தரவுகளின் அடிப்படையில் வழங்கப்படுகின்றன. முக்கியமான முடிவுகளுக்கு உள்ளூர் நிபுணர்களைக் கலந்தாலோசிக்கவும்.',

    // Reports
    'reports.title': 'விவசாய ஆலோசனை அறிக்கைகள்',
    'reports.subtitle': 'பருவகால விவசாய அறிக்கைகளைப் பதிவிறக்கம் செய்து பார்க்கவும்',
    'reports.downloadPdf': 'PDF அறிக்கையைப் பதிவிறக்கு',
    'reports.summary': 'பருவகால சுருக்கம்',
    'reports.soilHealth': 'மண் வள குறியீடு',

    // Profile
    'profile.title': 'விவசாயி சுயவிவரம்',
    'profile.subtitle': 'உங்கள் விவரங்கள் மற்றும் நில தகவல்களை நிர்வகிக்கவும்',
    'profile.name': 'முழு பெயர்',
    'profile.phone': 'தொலைபேசி எண்',
    'profile.state': 'மாநிலம்',
    'profile.district': 'மாவட்டம்',
    'profile.village': 'கிராமம் / ஊர்',
    'profile.landSize': 'மொத்த நில பரப்பளவு (ஏக்கர்)',
    'profile.updateProfile': 'சுயவிவரத்தைப் புதுப்பி',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.farmDetails': 'खेत का विवरण',
    'nav.cropSuggestion': 'फसल सुझाव',
    'nav.fertilizer': 'उर्वरक सलाह',
    'nav.weather': 'मौसम',
    'nav.diseases': 'फसल बीमारियां',
    'nav.gallery': 'इमेज गैलरी',
    'nav.marketPrices': 'बाजार मूल्य',
    'nav.aiAssistant': 'स्मार्ट सहायक',
    'nav.reports': 'रिपोर्ट',
    'nav.settings': 'सेटिंग्स',
    'nav.adminTools': 'एडमिन टूल्स',
    'nav.contactUs': 'संपर्क करें',
    'nav.needHelp': 'क्या सहायता चाहिए?',
    'nav.helpSubtitle': 'सहायता के लिए हमारी टीम से संपर्क करें',

    // Navbar & Header
    'header.notifications': 'सूचनाएं',
    'header.markRead': 'सभी को पढ़ा हुआ चिन्हित करें',
    'header.signOut': 'साइन आउट',
    'header.myProfile': 'मेरी प्रोफ़ाइल',
    'header.settings': 'सेटिंग्स',
    'header.new': 'नया',

    // Settings
    'settings.title': 'सेटिंग्स',
    'settings.subtitle': 'अपने खाते और प्राथमिकताओं का प्रबंधन करें',
    'settings.display': 'डिस्पले',
    'settings.mode': 'लाइट/डार्क मोड',
    'settings.modeDesc': 'लाइट और डार्क मोड के बीच स्विच करें',
    'settings.language': 'भाषा (Language)',
    'settings.selectLanguage': 'अपनी पसंदीदा भाषा चुनें',
    'settings.notifications': 'सूचनाएं',
    'settings.pushNotif': 'पुश सूचनाएं',
    'settings.pushDesc': 'मौसम और बाजार मूल्य अलर्ट प्राप्त करें',
    'settings.emailNotif': 'ईमेल अलर्ट',
    'settings.emailDesc': 'ईमेल के माध्यम से साप्ताहिक रिपोर्ट प्राप्त करें',
    'settings.security': 'सुरक्षा',
    'settings.changePassword': 'पासवर्ड बदलें',

    // Common
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.search': 'खोजें...',
    'common.select': 'भाषा चुनें',
    'common.loading': 'लोड हो रहा है...',
    'common.submit': 'सबमिट करें',
    'common.viewAll': 'सभी देखें',
    'common.details': 'विवरण',
    'common.status': 'स्थिति',
    'common.date': 'तारीख',

    // Dashboard
    'dash.welcome': 'स्वागत है',
    'dash.subtitle': 'आज आपके खेत की जानकारी',
    'dash.statCrops': 'कुल फसलें',
    'dash.statRecs': 'मेरी फसल सलाह',
    'dash.statMarket': 'बाजार मूल्य',
    'dash.statFarmers': 'उपयोगकर्ता किसान',
    'dash.weatherTitle': 'मौसम का पूर्वानुमान',
    'dash.humidity': 'नमी (आर्द्रता)',
    'dash.wind': 'हवा की गति',
    'dash.chartWeather': 'अगले 7 दिनों का मौसम',
    'dash.chartSeasons': 'सीजन के अनुसार फसलें',
    'dash.chartYield': 'अनुमानित मासिक उपज',
    'dash.recentRecs': 'हाल की फसल सलाह',
    'dash.noRecs': 'अभी तक कोई फसल सलाह नहीं है। पहली सलाह प्राप्त करें!',
    'dash.getRecBtn': 'फसल सुझाव प्राप्त करें',
    'dash.match': 'मैच',

    // Crop Recommendation
    'crop.title': 'फसल सुझाव',
    'crop.subtitle': 'अपनी मिट्टी और जलवायु के अनुसार स्मार्ट फसल सलाह प्राप्त करें',
    'crop.nitrogen': 'नाइट्रोजन (N)',
    'crop.phosphorus': 'फास्फोरस (P)',
    'crop.potassium': 'पोटेशियम (K)',
    'crop.ph': 'pH स्तर',
    'crop.rainfall': 'वर्षा (मिमी)',
    'crop.temperature': 'तापमान (°C)',
    'crop.humidity': 'नमी (%)',
    'crop.soilType': 'मिट्टी का प्रकार',
    'crop.season': 'मौसम / सीजन',
    'crop.getRecommendation': 'सलाह प्राप्त करें',
    'crop.results': 'अनुशंसित फसलें',
    'crop.confidence': 'उपयुक्तता स्कोर',
    'crop.duration': 'फसल की अवधि',
    'crop.waterReq': 'जल की आवश्यकता',
    'crop.yield': 'अनुमानित उपज',

    // Fertilizer
    'fertilizer.title': 'उर्वरक सलाह',
    'fertilizer.subtitle': 'इष्टतम उपज के लिए सटीक उर्वरक खुराक की गणना करें',
    'fertilizer.crop': 'फसल चुनें',
    'fertilizer.area': 'भूमि का क्षेत्रफल (एकड़)',
    'fertilizer.currentN': 'वर्तमान नाइट्रोजन',
    'fertilizer.currentP': 'वर्तमान फास्फोरस',
    'fertilizer.currentK': 'वर्तमान पोटेशियम',
    'fertilizer.calculate': 'खुराक की गणना करें',
    'fertilizer.result': 'अनुशंसित उर्वरक',
    'fertilizer.urea': 'यूरिया (Urea)',
    'fertilizer.dap': 'डीएपी (DAP)',
    'fertilizer.mop': 'एमओपी (MOP / पोटैश)',
    'fertilizer.organic': 'जैविक विकल्प',

    // Weather
    'weather.title': 'मौसम सलाह',
    'weather.subtitle': 'स्थानीय मौसम पूर्वानुमान और कृषि चेतावनियां',
    'weather.searchLoc': 'स्थान खोजें...',
    'weather.useMyLocation': 'वर्तमान स्थान का उपयोग करें',
    'weather.tempMax': 'अधिकतम तापमान',
    'weather.tempMin': 'न्यूनतम तापमान',
    'weather.rainProb': 'बारिश की संभावना',
    'weather.farmingTip': 'कृषि सलाह',
    'weather.rainAlert': 'बारिश की संभावना है! कीटनाशक छिड़काव स्थगित करें।',

    // Diseases
    'diseases.title': 'फसल रोग एवं कीट पहचान',
    'diseases.subtitle': 'फसल रोगों की पहचान करें और जैविक व रासायनिक समाधान पाएं',
    'diseases.uploadImg': 'फसल की फोटो अपलोड करें',
    'diseases.symptoms': 'लक्षण',
    'diseases.treatment': 'उपचार और नियंत्रण',
    'diseases.organic': 'जैविक उपाय',
    'diseases.chemical': 'रासायनिक उपाय',
    'diseases.prevention': 'बचाव के तरीके',

    // Market Prices
    'market.title': 'बाजार मूल्य और रुझान',
    'market.subtitle': 'लाइव मंडी भाव और बाजार दर विश्लेषण',
    'market.commodity': 'फसल / जिंस',
    'market.marketName': 'बाजार / मंडी',
    'market.minPrice': 'न्यूनतम मूल्य (₹/क्विंटल)',
    'market.maxPrice': 'अधिकतम मूल्य (₹/क्विंटल)',
    'market.modalPrice': 'मॉडल मूल्य (₹/क्विंटल)',
    'market.district': 'जिला',
    'market.filterCrop': 'फसल के अनुसार फ़िल्टर करें',

    // AI Assistant
    'ai.title': 'स्मार्ट AI कृषि सहायक',
    'ai.subtitle': 'फसलों, मिट्टी, कीट प्रबंधन और मौसम के बारे में कुछ भी पूछें',
    'ai.inputPlaceholder': 'हिंदी, तमिल या अंग्रेजी में अपना सवाल पूछें...',
    'ai.send': 'भेजें',
    'ai.prompt1': 'लाल मिट्टी के लिए सबसे अच्छी फसल कौन सी है?',
    'ai.prompt2': 'धान के तना छेदक कीट को प्राकृतिक रूप से कैसे नियंत्रित करें?',
    'ai.prompt3': 'टमाटर के लिए वर्तमान बाजार मूल्य का रुझान क्या है?',
    'ai.disclaimer': 'AI सुझाव कृषि डेटा के आधार पर तैयार किए जाते हैं। महत्वपूर्ण निर्णयों के लिए स्थानीय विशेषज्ञों से सलाह लें।',

    // Reports
    'reports.title': 'कृषि सलाहकार रिपोर्ट',
    'reports.subtitle': 'मौसमी कृषि रिपोर्ट डाउनलोड करें और देखें',
    'reports.downloadPdf': 'PDF रिपोर्ट डाउनलोड करें',
    'reports.summary': 'सीजन का सारांश',
    'reports.soilHealth': 'मिट्टी स्वास्थ्य सूचकांक',

    // Profile
    'profile.title': 'किसान प्रोफ़ाइल',
    'profile.subtitle': 'अपनी व्यक्तिगत जानकारी और खेत का विवरण प्रबंधित करें',
    'profile.name': 'पूरा नाम',
    'profile.phone': 'फ़ोन नंबर',
    'profile.state': 'राज्य',
    'profile.district': 'जिला',
    'profile.village': 'गांव / कस्बा',
    'profile.landSize': 'कुल भूमि (एकड़)',
    'profile.updateProfile': 'प्रोफ़ाइल अपडेट करें',
  },
  te: {
    // Navigation
    'nav.dashboard': 'డాష్‌బోర్డ్',
    'nav.profile': 'ప్రొఫైల్',
    'nav.farmDetails': 'పొలం వివరాలు',
    'nav.cropSuggestion': 'పంట సూచనలు',
    'nav.fertilizer': 'ఎరువుల వివరాలు',
    'nav.weather': 'వాతావరణం',
    'nav.diseases': 'పంట తెగుళ్లు',
    'nav.gallery': 'గ్యాలరీ',
    'nav.marketPrices': 'మార్కెట్ ధరలు',
    'nav.aiAssistant': 'స్మార్ట్ అసిస్టెంట్',
    'nav.reports': 'నివేదికలు',
    'nav.settings': 'సెట్టింగ్‌లు',
    'nav.adminTools': 'అడ్మిన్ టూల్స్',
    'nav.contactUs': 'మమ్మల్ని సంప్రదించండి',
    'nav.needHelp': 'సహాయం కావాలా?',
    'nav.helpSubtitle': 'సహాయం కోసం మా ప్రతినిధులను సంప్రదించండి',

    // Navbar & Header
    'header.notifications': 'నోటిఫికేషన్లు',
    'header.markRead': 'అన్నీ చదివినట్లు గుర్తించండి',
    'header.signOut': 'సైన్ అవుట్',
    'header.myProfile': 'నా ప్రొఫైల్',
    'header.settings': 'సెట్టింగ్‌లు',
    'header.new': 'క్రొత్తది',

    // Settings
    'settings.title': 'సెట్టింగ్‌లు',
    'settings.subtitle': 'మీ ఖాతా మరియు ప్రాధాన్యతలను నిర్వహించండి',
    'settings.display': 'డిస్‌ప్లే',
    'settings.mode': 'లైట్/డార్క్ మోడ్',
    'settings.modeDesc': 'లైట్ మరియు డార్క్ మోడ్ మధ్య మారండి',
    'settings.language': 'భాష (Language)',
    'settings.selectLanguage': 'మీకు కావలసిన భాషను ఎంచుకోండి',
    'settings.notifications': 'నోటిఫికేషన్లు',
    'settings.pushNotif': 'పుష్ నోటిఫికేషన్లు',
    'settings.pushDesc': 'వాతావరణం & మార్కెట్ ధరల అలర్ట్‌లు పొందండి',
    'settings.emailNotif': 'ఇమెయిల్ అలర్ట్‌లు',
    'settings.emailDesc': 'వారాంతపు నివేదికలను ఇమెయిల్ ద్వారా పొందండి',
    'settings.security': 'భద్రత',
    'settings.changePassword': 'పాస్‌వర్డ్ మార్చండి',

    // Common
    'common.save': 'సేవ్ చేయండి',
    'common.cancel': 'రద్దు చేయండి',
    'common.search': 'వెతకండి...',
    'common.select': 'భాషను ఎంచుకోండి',
    'common.loading': 'లోడ్ అవుతోంది...',
    'common.submit': 'సమర్పించు',
    'common.viewAll': 'అన్నీ చూడండి',
    'common.details': 'వివరాలు',
    'common.status': 'స్థితి',
    'common.date': 'తేదీ',

    // Dashboard
    'dash.welcome': 'స్వాగతం',
    'dash.subtitle': 'ఈరోజు మీ పొలం సమాచారం',
    'dash.statCrops': 'మొత్తం పంటలు',
    'dash.statRecs': 'నా పంట సూచనలు',
    'dash.statMarket': 'మార్కెట్ ధరలు',
    'dash.statFarmers': 'రైతులు',
    'dash.weatherTitle': 'వాతావరణ ముందస్తు సమాచారం',
    'dash.humidity': 'తేమ',
    'dash.wind': 'గాలి వేగం',
    'dash.chartWeather': 'రాబోయే 7 రోజుల వాతావరణం',
    'dash.chartSeasons': 'సీజన్ ప్రకారం పంటలు',
    'dash.chartYield': 'అంచనా నెలావారీ దిగుబడి',
    'dash.recentRecs': 'ఇటీవలి పంట సూచనలు',
    'dash.noRecs': 'ఇంకా ఎటువంటి పంట సూచనలు లేవు.',
    'dash.getRecBtn': 'పంట సూచనలు పొందండి',
    'dash.match': 'సరిపోలిక',

    // Crop Recommendation
    'crop.title': 'పంట సూచనలు',
    'crop.subtitle': 'నేల మరియు వాతావరణానికి అనుగుణంగా స్మార్ట్ సూచనలు',
    'crop.nitrogen': 'నైట్రోజన్ (N)',
    'crop.phosphorus': 'పాస్పరస్ (P)',
    'crop.potassium': 'పొటాషియం (K)',
    'crop.ph': 'pH స్థాయి',
    'crop.rainfall': 'వర్షపాతం (mm)',
    'crop.temperature': 'ఉష్ణోగ్రత (°C)',
    'crop.humidity': 'తేమ (%)',
    'crop.soilType': 'నేల రకం',
    'crop.season': 'సీజన్',
    'crop.getRecommendation': 'సూచనలు పొందండి',
    'crop.results': 'సిఫార్సు చేసిన పంటలు',
    'crop.confidence': 'అనుకూలత స్కోరు',
    'crop.duration': 'పంట కాలపరిమితి',
    'crop.waterReq': 'నీటి అవసరం',
    'crop.yield': 'అంచనా దిగుబడి',

    // Fertilizer
    'fertilizer.title': 'ఎరువుల వివరాలు',
    'fertilizer.subtitle': 'ఎరువు మోతాదును సులభంగా లెక్కించండి',
    'fertilizer.crop': 'పంటను ఎంచుకోండి',
    'fertilizer.area': 'భూమి వైశాల్యం (ఎకరాలు)',
    'fertilizer.currentN': 'ప్రస్తుత నైట్రోజన్',
    'fertilizer.currentP': 'ప్రస్తుత పాస్పరస్',
    'fertilizer.currentK': 'ప్రస్తుత పొటాషియం',
    'fertilizer.calculate': 'లెక్కించండి',
    'fertilizer.result': 'సిఫార్సు చేసిన ఎరువులు',
    'fertilizer.urea': 'యూరియా (Urea)',
    'fertilizer.dap': 'డిఏపి (DAP)',
    'fertilizer.mop': 'ఎమ్‌ఓపి (MOP)',
    'fertilizer.organic': 'సేంద్రీయ ఎరువులు',

    // Weather
    'weather.title': 'వాతావరణ సమాచారం',
    'weather.subtitle': 'ప్రాంతీయ వాతావరణ వివరాలు మరియు హెచ్చరికలు',
    'weather.searchLoc': 'ప్రాంతాన్ని వెతకండి...',
    'weather.useMyLocation': 'ప్రస్తుత ప్రాంతాన్ని ఉపయోగించండి',
    'weather.tempMax': 'గరిష్ట ఉష్ణోగ్రత',
    'weather.tempMin': 'కనిష్ట ఉష్ణోగ్రత',
    'weather.rainProb': 'వర్షపు అవకాశం',
    'weather.farmingTip': 'వ్యవసాయ సూచన',
    'weather.rainAlert': 'వర్షం కురిసే అవకాశం ఉంది! మందుల పిచికారీ నిలిపివేయండి.',

    // Diseases
    'diseases.title': 'పంట తెగుళ్లు గురింపు',
    'diseases.subtitle': 'పంట తెగుళ్లను గుర్తించి నివారణ చర్యలు పొందండి',
    'diseases.uploadImg': 'ఫొటోను అప్‌లోడ్ చేయండి',
    'diseases.symptoms': 'లక్షణాలు',
    'diseases.treatment': 'నివారణ చర్యలు',
    'diseases.organic': 'సేంద్రీయ పద్ధతి',
    'diseases.chemical': 'రసాయన పద్ధతి',
    'diseases.prevention': 'ముందస్తు జాగ్రత్తలు',

    // Market Prices
    'market.title': 'మార్కెట్ ధరలు',
    'market.subtitle': 'లైవ్ మార్కెట్ ధరల వివరాలు',
    'market.commodity': 'పంట రకం',
    'market.marketName': 'మార్కెట్ / మండి',
    'market.minPrice': 'కనిష్ట ధర (₹/క్వింటాల్)',
    'market.maxPrice': 'గరిష్ట ధర (₹/క్వింటాల్)',
    'market.modalPrice': 'సగటు ధర (₹/క్వింటాల్)',
    'market.district': 'జిల్లా',
    'market.filterCrop': 'పంట ద్వారా వెతకండి',

    // AI Assistant
    'ai.title': 'స్మార్ట్ AI వ్యవసాయ సహాయకుడు',
    'ai.subtitle': 'పంటలు, నేల మరియు వాతావరణం గురించి ఏమైనా అడగండి',
    'ai.inputPlaceholder': 'మీ ప్రశ్నను టైప్ చేయండి...',
    'ai.send': 'పంపండి',
    'ai.prompt1': 'ఎర్ర నేలలో వేయడానికి అనుకూలమైన పంట ఏది?',
    'ai.prompt2': 'వరి కాండం తొలుచు పురుగు నివారణ ఎలా?',
    'ai.prompt3': 'టమాటో ప్రస్తుత మార్కెట్ ధర ఎంత?',
    'ai.disclaimer': 'AI సూచనలు వ్యవసాయ సమాచారం ఆధారంగా ఇవ్వబడ్డాయి.',

    // Reports
    'reports.title': 'వ్యవసాయ నివేదికలు',
    'reports.subtitle': 'నివేదికలను డౌన్‌లోడ్ చేసుకోండి',
    'reports.downloadPdf': 'PDF నివేదిక పొందండి',
    'reports.summary': 'సారాంశం',
    'reports.soilHealth': 'నేల ఆరోగ్య సూచిక',

    // Profile
    'profile.title': 'రైతు ప్రొఫైల్',
    'profile.subtitle': 'మీ వివరాలు మరియు పొలం వివరాలు నిర్వహించండి',
    'profile.name': 'పూర్తి పేరు',
    'profile.phone': 'ఫోన్ నంబర్',
    'profile.state': 'రాష్ట్రం',
    'profile.district': 'జిల్లా',
    'profile.village': 'గ్రామం / ఊరు',
    'profile.landSize': 'మొత్తం వైశాల్యం (ఎకరాలు)',
    'profile.updateProfile': 'ప్రొఫైల్ నవీకరించండి',
  },
  es: {
    // Navigation
    'nav.dashboard': 'Panel de Control',
    'nav.profile': 'Perfil',
    'nav.farmDetails': 'Detalles de Granja',
    'nav.cropSuggestion': 'Sugerencia de Cultivo',
    'nav.fertilizer': 'Fertilizante',
    'nav.weather': 'Clima',
    'nav.diseases': 'Enfermedades',
    'nav.gallery': 'Galería de Imágenes',
    'nav.marketPrices': 'Precios del Mercado',
    'nav.aiAssistant': 'Asistente Inteligente',
    'nav.reports': 'Reportes',
    'nav.settings': 'Configuración',
    'nav.adminTools': 'Herramientas de Admin',
    'nav.contactUs': 'Contáctenos',
    'nav.needHelp': '¿Necesita Ayuda?',
    'nav.helpSubtitle': 'Contacte a nuestro equipo de soporte',

    // Navbar & Header
    'header.notifications': 'Notificaciones',
    'header.markRead': 'Marcar todo como leído',
    'header.signOut': 'Cerrar Sesión',
    'header.myProfile': 'Mi Perfil',
    'header.settings': 'Configuración',
    'header.new': 'nuevo',

    // Settings
    'settings.title': 'Configuración',
    'settings.subtitle': 'Gestione su cuenta y preferencias',
    'settings.display': 'Apariencia',
    'settings.mode': 'Modo Claro/Oscuro',
    'settings.modeDesc': 'Cambiar entre modo claro y oscuro',
    'settings.language': 'Idioma',
    'settings.selectLanguage': 'Seleccione su idioma preferido',
    'settings.notifications': 'Notificaciones',
    'settings.pushNotif': 'Notificaciones Push',
    'settings.pushDesc': 'Recibir alertas de clima y precios',
    'settings.emailNotif': 'Alertas por Correo',
    'settings.emailDesc': 'Recibir informes semanales por correo',
    'settings.security': 'Seguridad',
    'settings.changePassword': 'Cambiar Contraseña',

    // Common
    'common.save': 'Guardar Cambios',
    'common.cancel': 'Cancelar',
    'common.search': 'Buscar...',
    'common.select': 'Seleccionar Idioma',
    'common.loading': 'Cargando...',
    'common.submit': 'Enviar',
    'common.viewAll': 'Ver Todo',
    'common.details': 'Detalles',
    'common.status': 'Estado',
    'common.date': 'Fecha',

    // Dashboard
    'dash.welcome': 'Bienvenido',
    'dash.subtitle': 'Esto es lo que sucede hoy en su granja',
    'dash.statCrops': 'Total de Cultivos',
    'dash.statRecs': 'Mis Sugerencias',
    'dash.statMarket': 'Precios de Mercado',
    'dash.statFarmers': 'Agricultores',
    'dash.weatherTitle': 'Pronóstico del Tiempo',
    'dash.humidity': 'Humedad',
    'dash.wind': 'Viento',
    'dash.chartWeather': 'Clima para los Próximos 7 Días',
    'dash.chartSeasons': 'Cultivos por Temporada',
    'dash.chartYield': 'Cosecha Mensual Esperada',
    'dash.recentRecs': 'Sugerencias Recientes',
    'dash.noRecs': 'Aún no hay sugerencias.',
    'dash.getRecBtn': 'Obtener Sugerencias',
    'dash.match': 'coincidencia',

    // Crop Recommendation
    'crop.title': 'Sugerencia de Cultivo',
    'crop.subtitle': 'Obtenga sugerencias adaptadas a su suelo y clima',
    'crop.nitrogen': 'Nitrógeno (N)',
    'crop.phosphorus': 'Fósforo (P)',
    'crop.potassium': 'Potasio (K)',
    'crop.ph': 'Nivel de pH',
    'crop.rainfall': 'Precipitación (mm)',
    'crop.temperature': 'Temperatura (°C)',
    'crop.humidity': 'Humedad (%)',
    'crop.soilType': 'Tipo de Suelo',
    'crop.season': 'Temporada',
    'crop.getRecommendation': 'Obtener Recomendación',
    'crop.results': 'Cultivos Recomendados',
    'crop.confidence': 'Puntaje de Idoneidad',
    'crop.duration': 'Duración del Crecimiento',
    'crop.waterReq': 'Requerimiento de Agua',
    'crop.yield': 'Rendimiento Esperado',

    // Fertilizer
    'fertilizer.title': 'Asesoría de Fertilizantes',
    'fertilizer.subtitle': 'Calcule la dosis exacta para un rendimiento óptimo',
    'fertilizer.crop': 'Seleccionar Cultivo',
    'fertilizer.area': 'Área de Tierra (Acres)',
    'fertilizer.currentN': 'Nitrógeno Actual',
    'fertilizer.currentP': 'Fósforo Actual',
    'fertilizer.currentK': 'Potasio Actual',
    'fertilizer.calculate': 'Calcular Dosis',
    'fertilizer.result': 'Fertilizantes Recomendados',
    'fertilizer.urea': 'Urea',
    'fertilizer.dap': 'DAP',
    'fertilizer.mop': 'MOP',
    'fertilizer.organic': 'Alternativas Orgánicas',

    // Weather
    'weather.title': 'Asesoría Meteorológica',
    'weather.subtitle': 'Pronósticos locales y alertas agrícolas',
    'weather.searchLoc': 'Buscar ubicación...',
    'weather.useMyLocation': 'Usar Ubicación Actual',
    'weather.tempMax': 'Temp Máxima',
    'weather.tempMin': 'Temp Mínima',
    'weather.rainProb': 'Precipitación',
    'weather.farmingTip': 'Consejo Agrícola',
    'weather.rainAlert': '¡Lluvia esperada! Posponga la aplicación de pesticidas.',

    // Diseases
    'diseases.title': 'Identificación de Plagas y Enfermedades',
    'diseases.subtitle': 'Identifique enfermedades y obtenga tratamientos',
    'diseases.uploadImg': 'Subir Foto del Cultivo',
    'diseases.symptoms': 'Síntomas',
    'diseases.treatment': 'Tratamiento y Control',
    'diseases.organic': 'Remedio Orgánico',
    'diseases.chemical': 'Remedio Químico',
    'diseases.prevention': 'Consejos de Prevención',

    // Market Prices
    'market.title': 'Precios de Mercado y Tendencias',
    'market.subtitle': 'Precios en vivo y análisis de mercado',
    'market.commodity': 'Producto',
    'market.marketName': 'Mercado',
    'market.minPrice': 'Precio Mín (₹/qtl)',
    'market.maxPrice': 'Precio Máx (₹/qtl)',
    'market.modalPrice': 'Precio Promedio (₹/qtl)',
    'market.district': 'Distrito',
    'market.filterCrop': 'Filtrar por Cultivo',

    // AI Assistant
    'ai.title': 'Asistente Agrícola Inteligente AI',
    'ai.subtitle': 'Pregunte sobre cultivos, suelo, plagas y clima',
    'ai.inputPlaceholder': 'Haga su pregunta en español, inglés, tamil o hindi...',
    'ai.send': 'Enviar',
    'ai.prompt1': '¿Qué cultivo es mejor para suelo rojo?',
    'ai.prompt2': '¿Cómo controlar las plagas del arroz de forma natural?',
    'ai.prompt3': '¿Cuál es la tendencia actual del mercado de tomate?',
    'ai.disclaimer': 'Las sugerencias de IA se basan en datos agrícolas.',

    // Reports
    'reports.title': 'Informes de Asesoría Agrícola',
    'reports.subtitle': 'Descargue y vea informes de granja',
    'reports.downloadPdf': 'Descargar Informe PDF',
    'reports.summary': 'Resumen de Temporada',
    'reports.soilHealth': 'Índice de Salud del Suelo',

    // Profile
    'profile.title': 'Perfil del Agricultor',
    'profile.subtitle': 'Gestione sus datos personales y de granja',
    'profile.name': 'Nombre Completo',
    'profile.phone': 'Número de Teléfono',
    'profile.state': 'Estado',
    'profile.district': 'Distrito',
    'profile.village': 'Pueblo / Ciudad',
    'profile.landSize': 'Área Total de Tierra (Acres)',
    'profile.updateProfile': 'Actualizar Perfil',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  currentLanguageOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('app_language');
    if (saved && (saved === 'en' || saved === 'ta' || saved === 'hi' || saved === 'te' || saved === 'es')) {
      return saved as LanguageCode;
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const currentLanguageOption = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLanguageOption }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

