import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Trash2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Wheat,
  Sprout,
  FlaskConical,
  Bug,
  Landmark,
  TrendingUp,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { ChatMessage, getAIResponse } from '../lib/aiAssistant';

interface TopicPill {
  label: string;
  query: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function AIAssistant() {
  const { showToast } = useToast();
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Suggested starter prompts based on language
  const suggestedQuestions = [
    t('ai.prompt1'),
    t('ai.prompt2'),
    t('ai.prompt3'),
  ];

  // Quick topics pills
  const topicPills: TopicPill[] = [
    { label: language === 'ta' ? '🌾 நெல் சாகுபடி' : language === 'hi' ? '🌾 धान की खेती' : '🌾 Paddy Guide', query: language === 'ta' ? 'நெல் சாகுபடி மற்றும் உர மேலாண்மை' : language === 'hi' ? 'धान की खेती और खाद' : 'Paddy cultivation and fertilizer guide', icon: Wheat },
    { label: language === 'ta' ? '🍅 தக்காளி நோய்' : language === 'hi' ? '🍅 टमाटर रोग' : '🍅 Tomato Care', query: language === 'ta' ? 'தக்காளி இலைச்சுருள் மற்றும் கருகல் நோய் கட்டுப்பாடு' : language === 'hi' ? 'टमाटर की पत्ती मरोड़ बीमारी' : 'Tomato leaf curl and blight disease remedies', icon: Sprout },
    { label: language === 'ta' ? '🧪 உர அளவு (NPK)' : language === 'hi' ? '🧪 उर्वरक (NPK)' : '🧪 NPK Fertilizer', query: language === 'ta' ? 'யுரியா, டிஏபி மற்றும் பொட்டாஷ் உரம் எப்படி பயன்படுத்த வேண்டும்' : language === 'hi' ? 'यूरिया और डीएपी खाद की सही मात्रा' : 'How to balance Urea, DAP, and MOP fertilizers', icon: FlaskConical },
    { label: language === 'ta' ? '🌿 இயற்கை பூச்சி மருந்து' : language === 'hi' ? '🌿 जैविक कीटनाशक' : '🌿 Organic Pest', query: language === 'ta' ? 'வேப்பெண்ணெய் மற்றும் அக்னி அஸ்திரம் தயாரிக்கும் முறை' : language === 'hi' ? 'नीम तेल और अग्निअस्त्र बनाने की विधि' : 'Natural pest control and neem oil spray method', icon: Bug },
    { label: language === 'ta' ? '🏛️ அரசு மானியங்கள்' : language === 'hi' ? '🏛️ सरकारी योजना' : '🏛️ Govt Schemes', query: language === 'ta' ? 'PM KISAN மற்றும் சொட்டு நீர் பாசன அரசு மானியங்கள்' : language === 'hi' ? 'पीएम किसान और ड्रिप सब्सिडी' : 'PM KISAN and drip irrigation government subsidies', icon: Landmark },
    { label: language === 'ta' ? '📈 சந்தை விலை உத்திகள்' : language === 'hi' ? '📈 मंडी भाव' : '📈 Mandi Advice', query: language === 'ta' ? 'விவசாய விளைபொருட்களை அதிக விலைக்கு விற்பது எப்படி' : language === 'hi' ? 'मंडी में फसल का अच्छा भाव कैसे पाएं' : 'How to get best mandi prices and e-NAM trading', icon: TrendingUp },
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const langMap: Record<string, string> = {
        en: 'en-IN',
        ta: 'ta-IN',
        hi: 'hi-IN',
        te: 'te-IN',
        es: 'es-ES',
      };
      recognition.lang = langMap[language] || 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, typing]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      showToast('Voice input is not supported in this browser', 'error');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        showToast('Listening... Speak your farming question', 'info');
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleSpeak = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('Text-to-speech not supported', 'error');
      return;
    }

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const langVoiceMap: Record<string, string> = {
      en: 'en-IN',
      ta: 'ta-IN',
      hi: 'hi-IN',
      te: 'te-IN',
      es: 'es-ES',
    };
    utterance.lang = langVoiceMap[language] || 'en-IN';

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    showToast('Copied to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (customQuery?: string) => {
    const query = (customQuery || input).trim();
    if (!query || typing) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const response = await getAIResponse(query, language, messages);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: response.followUps,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      showToast('Error getting AI response', 'error');
    } finally {
      setTyping(false);
    }
  };

  const handleClear = () => {
    if (speakingId) {
      window.speechSynthesis?.cancel();
      setSpeakingId(null);
    }
    setMessages([]);
    showToast('Chat history cleared', 'info');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <PageHeader
        title={t('ai.title')}
        subtitle={t('ai.subtitle')}
        icon={<Bot className="w-6 h-6 text-primary-500" />}
        action={
          messages.length > 0 ? (
            <Button
              variant="ghost"
              onClick={handleClear}
              icon={<Trash2 className="w-4 h-4 text-red-500" />}
              className="hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600"
            >
              Clear Chat
            </Button>
          ) : undefined
        }
      />

      {/* Quick Topic Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
        {topicPills.map((pill, idx) => {
          const Icon = pill.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(pill.query)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 text-slate-700 dark:text-slate-300 transition-all shrink-0 shadow-sm hover:scale-[1.02]"
            >
              <Icon className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>

      <Card className="flex flex-col h-[650px] shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Messages Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary-600 via-primary-500 to-emerald-400 flex items-center justify-center text-white mb-4 shadow-xl shadow-primary-500/20"
              >
                <Sparkles className="w-10 h-10" />
              </motion.div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {t('ai.title')}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-lg">
                {t('ai.subtitle')}
              </p>

              {/* Starter suggested questions */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8 max-w-3xl w-full text-left">
                {suggestedQuestions.map((q, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSend(q)}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-primary-50/80 dark:hover:bg-primary-950/40 hover:border-primary-400 dark:hover:border-primary-600 transition-all text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium flex items-start gap-2.5 shadow-sm"
                  >
                    <span className="text-base">💡</span>
                    <span className="flex-1">{q}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary-600 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-primary-600/20 mt-1">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] md:max-w-[78%] rounded-3xl px-4 md:px-5 py-3.5 shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span
                      className={`text-[10px] font-medium tracking-wide uppercase ${
                        msg.role === 'user' ? 'text-primary-100' : 'text-primary-600 dark:text-primary-400'
                      }`}
                    >
                      {msg.role === 'user' ? 'You' : 'Agri AI Assistant'}
                    </span>
                    <span
                      className={`text-[10px] ${
                        msg.role === 'user' ? 'text-primary-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-normal">
                    {msg.content}
                  </p>

                  {/* Actions for Assistant replies */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 mt-3 pt-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSpeak(msg.content, msg.id)}
                          title="Read Aloud"
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                        >
                          {speakingId === msg.id ? (
                            <VolumeX className="w-4 h-4 text-primary-500 animate-pulse" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          title="Copy Answer"
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Follow-up suggestions */}
                      {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {msg.suggestedFollowUps.slice(0, 2).map((followUp, fIdx) => (
                            <button
                              key={fIdx}
                              onClick={() => handleSend(followUp)}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800/60 hover:bg-primary-100 transition-colors font-medium"
                            >
                              💬 {followUp}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-9 h-9 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 items-center"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary-600 to-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl px-4 py-3 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-400 ml-1">Analyzing farming data...</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 md:p-4 bg-slate-50/70 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-700">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop listening' : 'Voice search'}
              className={`p-2.5 rounded-2xl transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                  : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-primary-600'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening now... Speak your farming question'
                  : t('ai.inputPlaceholder')
              }
              className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
            />

            <Button
              type="submit"
              disabled={!input.trim() || typing}
              icon={<Send className="w-4 h-4" />}
              className="rounded-2xl px-5"
            >
              {t('ai.send')}
            </Button>
          </form>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-2">
            {t('ai.disclaimer')}
          </p>
        </div>
      </Card>
    </div>
  );
}
