import { useState, useEffect } from 'react';
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
  paddy: '/images/crops/paddy.png',
  rice: '/images/crops/paddy.png',
  wheat: '/images/crops/wheat.jpg',
  tomato: '/images/crops/tomato.jpg',
  cotton: '/images/crops/cotton.jpg',
  sugarcane: '/images/crops/sugarcane.jpg',
  maize: '/images/crops/maize.jpg',
  corn: '/images/crops/maize.jpg',
  onion: '/images/crops/onion.jpg',
  chilli: '/images/crops/chilli.jpg',
  banana: '/images/crops/banana.jpg',
  mango: '/images/crops/mango.jpg',
  coconut: '/images/crops/coconut.jpg',
  soybean: '/images/crops/soybean.jpg',
  potato: '/images/crops/potato.jpg',
  groundnut: '/images/crops/groundnut.jpg',
  peanut: '/images/crops/groundnut.jpg',
  brinjal: '/images/crops/brinjal.JPG',
  eggplant: '/images/crops/brinjal.JPG',
  turmeric: '/images/crops/turmeric.jpg',
  ginger: '/images/crops/ginger.jpg',
  garlic: '/images/crops/garlic.jpg',
  mustard: '/images/crops/mustard.jpg',
  cucumber: '/images/crops/cucumber.jpg',
  papaya: '/images/crops/papaya.jpg',
  watermelon: '/images/crops/watermelon.jpg',
  // Diseases
  blast: '/images/diseases/paddy_blast.jpg',
  'stem borer': '/images/diseases/stem_borer.jpg',
  'leaf curl': '/images/diseases/tomato_leaf_curl.jpg',
  'early blight': '/images/diseases/ftcdn_451908727.jpg',
  'late blight': '/images/diseases/potato_late_blight_spudsmart.jpg',
  'pink bollworm': 'https://www.multiplexgroup.com/uploads/products/1709286012_364775.jpg',
  'yellow rust': '/images/diseases/yellow_rust.jpg',
  'red rot': '/images/diseases/sugarcane_red_rot.jpg',
  'armyworm': '/images/diseases/fall_armyworm.jpg',
  'purple blotch': '/images/diseases/onion_purple_blotch.jpg',
  'anthracnose': '/images/diseases/chilli_anthracnose.jpg',
  'tikka': '/images/diseases/groundnut_tikka.jpg',
  'panama wilt': '/images/diseases/banana_panama_wilt.jpg',
  'sigatoka': '/images/diseases/banana_sigatoka.jpg',
  'powdery mildew': '/images/diseases/mango_powdery_mildew.jpg',
  'hopper': '/images/diseases/mango_hopper_2.webp',
  'root wilt': '/images/diseases/coconut_root_wilt.jpg',
  'shoot and fruit borer': '/images/diseases/brinjal_borer_trap.jpg',
  'borer': '/images/diseases/brinjal_borer_trap.jpg',
  'yellow mosaic': '/images/diseases/bugwood_5598938.jpg',
  'downy mildew': '/images/diseases/cucumber_downy_mildew_5628815.jpg',
  'planthopper': '/images/diseases/paddy_bph.jpg',
  'alternaria': '/images/diseases/cotton_alternaria.jpg',
  'cabbage': '/images/diseases/cabbage_fusarium_yellows.jpg',
  'fusarium': '/images/diseases/cabbage_fusarium_yellows.jpg',
  'chickpea': '/images/diseases/chickpea_dry_root_rot.webp',
  'dry root rot': '/images/diseases/chickpea_dry_root_rot.webp',
};

function getCropFallback(altText: string): string | undefined {
  const clean = altText.toLowerCase().replace(/[^a-z0-9]/g, ' ');
  for (const [key, path] of Object.entries(DEFAULT_CROP_IMAGES)) {
    if (clean.includes(key)) return path;
  }
  return undefined;
}

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
  const fallbackImg = getCropFallback(alt);
  const [imgSrc, setImgSrc] = useState<string | null>(src || fallbackImg || null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallbackImg || null);
    setFailed(false);
  }, [src, alt]);

  const handleError = () => {
    if (imgSrc && fallbackImg && imgSrc !== fallbackImg) {
      // Fallback from failed remote URL to local static asset
      setImgSrc(fallbackImg);
    } else {
      setFailed(true);
    }
  };

  const gradient = gradients[hashString(alt) % gradients.length];

  if (!imgSrc || failed) {
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
      src={imgSrc}
      alt={alt}
      loading="lazy"
      onError={handleError}
      className={className}
    />
  );
}
