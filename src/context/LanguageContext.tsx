import React, { createContext, useContext, useState, useEffect } from 'react';

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

// Dictionary of translations
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
