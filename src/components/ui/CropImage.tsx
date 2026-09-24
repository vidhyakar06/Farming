import { useState } from 'react';
import { Sprout } from 'lucide-react';

const gradients = [
  'from-green-400 to-emerald-600',
  'from-lime-400 to-green-600',
  'from-amber-400 to-orange-600',
  'from-yellow-400 to-amber-600',
  'from-teal-400 to-cyan-600',
  'from-emerald-400 to-teal-600',
  'from-orange-400 to-red-500',
  'from-green-500 to-lime-600',
];

const DEFAULT_CROP_IMAGES: Record<string, string> = {
  papaya: '/images/crops/papaya.jpg',
  paddy: '/images/crops/paddy.jpg',
  rice: '/images/crops/paddy.jpg',
  'paddy (rice)': '/images/crops/paddy.jpg',
  wheat: '/images/crops/wheat.jpg',
  cotton: '/images/crops/cotton.JPG',
  tomato: '/images/crops/tomato.jpg',
  onion: '/images/crops/onion.jpg',
  sugarcane: '/images/crops/sugarcane.jpg',
  maize: '/images/crops/maize.jpg',
  'maize (corn)': '/images/crops/maize.jpg',
  corn: '/images/crops/maize.jpg',
  chilli: '/images/crops/chilli.jpg',
  potato: '/images/crops/potato.jpg',
  groundnut: '/images/crops/groundnut.jpg',
  'groundnut (peanut)': '/images/crops/groundnut.jpg',
  peanut: '/images/crops/groundnut.jpg',
  soybean: '/images/crops/soybean.jpg',
  turmeric: '/images/crops/turmeric.jpg',
  banana: '/images/crops/banana.jpg',
  ginger: '/images/crops/ginger.jpg',
  mustard: '/images/crops/mustard.jpg',
  garlic: '/images/crops/garlic.jpg',
  brinjal: '/images/crops/brinjal.JPG',
  'brinjal (eggplant)': '/images/crops/brinjal.JPG',
  eggplant: '/images/crops/brinjal.JPG',
  cucumber: '/images/crops/cucumber.jpg',
  watermelon: '/images/crops/watermelon.jpg',
  mango: '/images/crops/mango.jpg',
  coconut: '/images/crops/coconut.jpg',
};

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

type CropImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
};

export default function CropImage({ src, alt, className = '' }: CropImageProps) {
  const [failed, setFailed] = useState(false);

  const defaultImg = DEFAULT_CROP_IMAGES[alt.toLowerCase().trim()];
  const effectiveSrc = src || defaultImg;

  const showFallback = !effectiveSrc || failed;
  const gradient = gradients[hashString(alt) % gradients.length];

  if (showFallback) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${className}`}>
        <div className="flex flex-col items-center gap-1 text-white/90">
          <Sprout className="w-8 h-8" strokeWidth={1.5} />
          <span className="text-xs font-semibold tracking-wide">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={effectiveSrc}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
