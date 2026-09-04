import { useState, useEffect } from 'react';
import { MapPin, Loader2, Navigation, RefreshCw } from 'lucide-react';

interface LocationInfo {
  latitude: number;
  longitude: number;
  village?: string;
  district?: string;
  state?: string;
  country?: string;
  fullAddress?: string;
}

interface UserLocationCardProps {
  apiKey: string;
}

export default function UserLocationCard({ apiKey }: UserLocationCardProps) {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapUrl, setMapUrl] = useState<string | null>(null);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await res.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const components = data.results[0].address_components;
        const get = (type: string) =>
          components.find((c: any) => c.types.includes(type))?.long_name;

        return {
          latitude: lat,
          longitude: lng,
          village: get('sublocality_level_1') || get('locality') || get('administrative_area_level_3'),
          district: get('administrative_area_level_2'),
          state: get('administrative_area_level_1'),
          country: get('country'),
          fullAddress: data.results[0].formatted_address,
        };
      }
    } catch {
      // fallback with just coordinates
    }
    return { latitude: lat, longitude: lng, fullAddress: `${lat.toFixed(5)}, ${lng.toFixed(5)}` };
  };

  const detectLocation = () => {
    setLoading(true);
    setError(null);
    setLocation(null);
    setMapUrl(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const info = await reverseGeocode(latitude, longitude);
        setLocation(info);
        setMapUrl(
          `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=15`
        );
        setLoading(false);
      },
      (err) => {
        if (err.code === 1) setError('Location permission denied. Please allow location access in your browser.');
        else if (err.code === 2) setError('Could not determine your location. Try again.');
        else setError('Location request timed out. Please try again.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">Your Location</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Detected from your device GPS</p>
          </div>
        </div>
        <button
          onClick={detectLocation}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-primary-600 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Map */}
      {loading && (
        <div className="h-64 flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-900">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-500">Detecting your location...</p>
        </div>
      )}

      {error && (
        <div className="h-64 flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-900 px-6">
          <MapPin className="w-10 h-10 text-slate-300" />
          <p className="text-sm text-red-500 text-center">{error}</p>
          <button
            onClick={detectLocation}
            className="text-xs px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
          >
            Try Again
          </button>
        </div>
      )}

      {mapUrl && !loading && (
        <iframe
          src={mapUrl}
          width="100%"
          height="260"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Your Location"
        />
      )}

      {/* Location Details */}
      {location && !loading && (
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Village / Area', value: location.village },
              { label: 'District', value: location.district },
              { label: 'State', value: location.state },
              { label: 'Country', value: location.country },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl px-3 py-2.5">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">{item.label}</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{item.value || '—'}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-900/20">
            <Navigation className="w-3.5 h-3.5 text-green-600 shrink-0" />
            <p className="text-xs text-green-700 dark:text-green-400 truncate">
              {location.fullAddress || `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`}
            </p>
          </div>

          <div className="mt-2 flex gap-2 text-[11px] text-slate-400">
            <span>Lat: {location.latitude.toFixed(6)}</span>
            <span>•</span>
            <span>Lng: {location.longitude.toFixed(6)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
