import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Sprout } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      showToast(t('contact.sentSuccess'), 'success');
      setForm({ name: '', email: '', message: '' });
      setSending(false);
    }, 1000);
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'support@cropadvisory.in', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
    { icon: Phone, label: 'Phone', value: '+91 98765 43210', color: 'bg-green-100 dark:bg-green-900/30 text-green-600' },
    { icon: MapPin, label: 'Address', value: 'Agricultural University, Coimbatore, Tamil Nadu', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' },
  ];

  return (
    <div>
      <PageHeader title={t('contact.title')} subtitle={t('contact.subtitle')} icon={<MessageSquare className="w-6 h-6" />} />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {contactInfo.map((info, i) => (
            <motion.div key={info.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${info.color}`}>
                    <info.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{info.label}</p>
                    <p className="font-semibold text-slate-800 dark:text-white">{info.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          <Card className="p-6 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Sprout className="w-8 h-8" />
              <h3 className="text-lg font-bold">{t('nav.needHelp')}</h3>
            </div>
            <p className="text-sm text-primary-100">
              {t('nav.helpSubtitle')}
            </p>
          </Card>
        </motion.div>

        {/* Contact Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">{t('contact.title')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={t('contact.name')}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t('contact.name')}
                required
              />
              <Input
                label={t('contact.email')}
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t('contact.email')}
                required
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('contact.message')}</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  required
                  className="input-field resize-none"
                  placeholder={t('contact.message')}
                />
              </div>
              <Button type="submit" disabled={sending} icon={sending ? undefined : <Send className="w-4 h-4" />} className="w-full">
                {sending ? t('common.loading') : t('contact.sendMsg')}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
