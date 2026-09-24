import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Upload, MapPin, Phone, Mail, Save, Sprout, FlaskConical, Droplets, ArrowRight } from 'lucide-react';
import { supabase, type FarmDetail } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/Loading';

const soilTypes = ['Loamy', 'Sandy', 'Clay', 'Black', 'Red', 'Alluvial', 'Laterite'];
const irrigationMethods = ['Drip', 'Sprinkler', 'Flood', 'Canal', 'Rainfed', 'Tube Well'];

export default function Profile() {
  const { profile, session, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [farmDetails, setFarmDetails] = useState<FarmDetail | null>(null);
  const [form, setForm] = useState({
    full_name: '', mobile_number: '', village: '', district: '', state: '',
    farm_size: '', soil_type: '', irrigation_method: '', profile_photo_url: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        mobile_number: profile.mobile_number || '',
        village: profile.village || '',
        district: profile.district || '',
        state: profile.state || '',
        farm_size: profile.farm_size || '',
        soil_type: profile.soil_type || '',
        irrigation_method: profile.irrigation_method || '',
        profile_photo_url: profile.profile_photo_url || '',
      });
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    const fetchFarm = async () => {
      if (!session?.user?.id) return;
      try {
        const { data } = await supabase
          .from('farm_details')
          .select('*')
          .eq('farmer_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        let record = data as FarmDetail | null;
        if (!record) {
          try {
            const cached = localStorage.getItem(`farm_details_${session.user.id}`);
            if (cached) record = JSON.parse(cached);
          } catch {
            // ignore
          }
        }
        setFarmDetails(record);
      } catch (e) {
        console.error('Profile farm fetch error:', e);
      }
    };
    fetchFarm();
  }, [session?.user?.id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${session.user.id}/profile.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from('profiles')
        .upload(path, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data } = supabase.storage.from('profiles').getPublicUrl(path);
      setForm((f) => ({ ...f, profile_photo_url: data.publicUrl }));
      showToast('Profile photo uploaded', 'success');
    } catch (err) {
      showToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: form.full_name,
          mobile_number: form.mobile_number,
          village: form.village,
          district: form.district,
          state: form.state,
          farm_size: form.farm_size,
          soil_type: form.soil_type,
          irrigation_method: form.irrigation_method,
          profile_photo_url: form.profile_photo_url,
        })
        .eq('id', session?.user?.id);
      if (error) throw error;
      await refreshProfile();
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
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
    <div>
      <PageHeader title="My Profile" subtitle="Manage your personal and farm information" icon={<User className="w-6 h-6" />} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {form.profile_photo_url ? (
                <img src={form.profile_photo_url} alt="" className="w-32 h-32 rounded-2xl object-cover" />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <User className="w-16 h-16 text-primary-400" />
                </div>
              )}
              <label className="absolute bottom-2 right-2 w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors shadow-lg">
                {uploading ? <LoadingSpinner size="sm" /> : <Upload className="w-4 h-4" />}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-4">{form.full_name || 'Farmer'}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{profile?.role === 'admin' ? 'Administrator' : 'Farmer'}</p>
            <div className="w-full mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 text-slate-400" /> {session?.user?.email}
              </div>
              {form.mobile_number && (
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-slate-400" /> {form.mobile_number}
                </div>
              )}
              {form.village && (
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400" /> {form.village}, {form.district}, {form.state}
                </div>
              )}
              {form.farm_size && (
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <Sprout className="w-4 h-4 text-slate-400" /> {form.farm_size} acres
                </div>
              )}
              {form.soil_type && (
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <FlaskConical className="w-4 h-4 text-slate-400" /> {form.soil_type} Soil
                </div>
              )}
              {form.irrigation_method && (
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <Droplets className="w-4 h-4 text-slate-400" /> {form.irrigation_method} Irrigation
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Edit Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Edit Profile Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Enter your full name"
              />
              <Input
                label="Mobile Number"
                value={form.mobile_number}
                onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
                placeholder="Enter mobile number"
              />
              <Input
                label="Village"
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
                placeholder="Your village"
              />
              <Input
                label="District"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                placeholder="Your district"
              />
              <Input
                label="State"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="Your state"
              />
              <Input
                label="Farm Size (acres)"
                value={form.farm_size}
                onChange={(e) => setForm({ ...form, farm_size: e.target.value })}
                placeholder="e.g., 2.5"
              />
              <Select
                label="Soil Type"
                value={form.soil_type}
                onChange={(e) => setForm({ ...form, soil_type: e.target.value })}
                options={[{ value: '', label: 'Select soil type' }, ...soilTypes.map((s) => ({ value: s, label: s }))]}
              />
              <Select
                label="Watering Method"
                value={form.irrigation_method}
                onChange={(e) => setForm({ ...form, irrigation_method: e.target.value })}
                options={[{ value: '', label: 'Select method' }, ...irrigationMethods.map((m) => ({ value: m, label: m }))]}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} disabled={saving} icon={saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>

          {/* Farm Details Card */}
          <Card className="p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white text-base">Farm Soil & Weather Details</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Parameters used by recommendations engine</p>
                </div>
              </div>
              <Link
                to="/farm-details"
                className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
              >
                {farmDetails ? 'Manage Farm Details' : 'Add Farm Details'} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {farmDetails ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Soil Type & pH</span>
                  <p className="font-bold text-slate-800 dark:text-white text-sm mt-0.5">{farmDetails.soil_type || 'N/A'}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    pH {farmDetails.soil_ph != null ? farmDetails.soil_ph : 'N/A'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Nutrients (N-P-K)</span>
                  <p className="font-bold text-slate-800 dark:text-white text-sm mt-0.5">
                    {farmDetails.nitrogen ?? '-'} : {farmDetails.phosphorus ?? '-'} : {farmDetails.potassium ?? '-'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">kg / acre</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Climate</span>
                  <p className="font-bold text-slate-800 dark:text-white text-sm mt-0.5">{farmDetails.temperature ?? '-'}°C • {farmDetails.humidity ?? '-'}%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{farmDetails.rainfall ?? '-'} mm rain</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Season & Water</span>
                  <p className="font-bold text-slate-800 dark:text-white text-sm mt-0.5">{farmDetails.current_season || 'N/A'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{farmDetails.water_availability || 'N/A'} Water</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You haven't added your farm details (soil pH, nutrients, weather) yet.
                </p>
                <Link
                  to="/farm-details"
                  className="px-3.5 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shrink-0 transition-colors"
                >
                  Add Now
                </Link>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
