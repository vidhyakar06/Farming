-- Seed Master Data for Agriculture Advisory System
-- Populates market_prices, crops, fertilizers, and diseases if empty

-- 1. SEED MARKET PRICES
INSERT INTO market_prices (crop_name, market_name, current_price, previous_price, price_trend) VALUES
('Paddy (Basmati)', 'Khanna Mandi (Punjab)', 3850, 3650, 'up'),
('Paddy (Common)', 'Thanjavur Mandi (TN)', 2350, 2200, 'up'),
('Wheat (Sharbati)', 'Indore Mandi (MP)', 2850, 2750, 'up'),
('Wheat (Kalyan)', 'Karnal Mandi (Haryana)', 2420, 2450, 'down'),
('Tomato', 'Dindigul Mandi (TN)', 2800, 2100, 'up'),
('Tomato (Hybrid)', 'Kolar Mandi (Karnataka)', 2600, 2900, 'down'),
('Onion (Red)', 'Lasalgaon Mandi (Nashik)', 1850, 1600, 'up'),
('Onion (White)', 'Mahuvam Mandi (Gujarat)', 1750, 1800, 'down'),
('Potato (Jyoti)', 'Agra Mandi (UP)', 1450, 1380, 'up'),
('Potato (Chipsona)', 'Hooghly Mandi (WB)', 1600, 1650, 'down'),
('Cotton (Medium Staple)', 'Rajkot Mandi (Gujarat)', 7250, 7100, 'up'),
('Cotton (Long Staple)', 'Warangal Mandi (Telangana)', 7800, 7950, 'down'),
('Sugarcane', 'Coimbatore Mandi (TN)', 340, 320, 'up'),
('Chilli (Teja Red)', 'Guntur Mandi (AP)', 18500, 17200, 'up'),
('Maize (Yellow)', 'Davangere Mandi (Karnataka)', 2250, 2180, 'up'),
('Soybean (Yellow)', 'Ujjain Mandi (MP)', 4650, 4800, 'down'),
('Groundnut (Pod)', 'Bikaner Mandi (Rajasthan)', 6300, 6150, 'up'),
('Banana (Robusta)', 'Theni Mandi (TN)', 1950, 1750, 'up'),
('Turmeric (Finger)', 'Erode Mandi (TN)', 14200, 13500, 'up'),
('Mustard', 'Jaipur Mandi (Rajasthan)', 5450, 5300, 'up'),
('Garlic', 'Mandsaur Mandi (MP)', 12500, 13200, 'down'),
('Ginger (Fresh)', 'Wayanad Mandi (Kerala)', 6800, 6400, 'up')
ON CONFLICT DO NOTHING;

-- 2. SEED CROPS MASTER DATA
INSERT INTO crops (crop_name, scientific_name, soil_type, suitable_season, water_requirement, temperature_range, rainfall_range, fertilizer, growth_duration, expected_yield, market_value, image_url) VALUES
('Paddy', 'Oryza sativa', 'Clayey / Loamy', 'Kharif', 'High (1200-1500 mm)', '22-32°C', '1000-1500 mm', 'Urea: 50kg, DAP: 50kg, MOP: 25kg', '120-140 days', '4-5 tons/acre', 'High', 'https://images.unsplash.com/photo-1536617621572-1d5f1e6269a0?w=600&auto=format&fit=crop&q=80'),
('Wheat', 'Triticum aestivum', 'Loamy / Clay Loam', 'Rabi', 'Medium (450-650 mm)', '15-25°C', '500-750 mm', 'Urea: 60kg, DAP: 55kg, MOP: 20kg', '110-130 days', '3-4 tons/acre', 'High', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80'),
('Cotton', 'Gossypium hirsutum', 'Black / Regur Soil', 'Kharif', 'Medium (600-800 mm)', '21-30°C', '600-1000 mm', 'NPK: 60:30:30 kg/acre', '150-180 days', '1.5-2.5 tons/acre', 'Very High', 'https://images.unsplash.com/photo-1594488555776-8809ff44f24b?w=600&auto=format&fit=crop&q=80'),
('Tomato', 'Solanum lycopersicum', 'Red Loam / Sandy Loam', 'All Season', 'Medium (400-600 mm)', '18-28°C', '500-700 mm', 'FYM: 10t, DAP: 40kg, Potash: 30kg', '90-110 days', '15-20 tons/acre', 'High', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'),
('Onion', 'Allium cepa', 'Sandy Loam', 'Rabi / Kharif', 'Medium (350-550 mm)', '15-28°C', '400-600 mm', 'NPK: 40:20:30 kg/acre', '100-120 days', '10-15 tons/acre', 'High', 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80'),
('Sugarcane', 'Saccharum officinarum', 'Deep Rich Loamy', 'All Season', 'High (1500-2500 mm)', '20-35°C', '1100-1500 mm', 'Urea: 100kg, SSP: 125kg, MOP: 50kg', '300-365 days', '40-50 tons/acre', 'Very High', 'https://images.unsplash.com/photo-1598112972019-91e1162b80f7?w=600&auto=format&fit=crop&q=80'),
('Maize', 'Zea mays', 'Well-drained Loam', 'Kharif / Rabi', 'Medium (500-750 mm)', '18-30°C', '600-900 mm', 'Urea: 50kg, DAP: 45kg, MOP: 25kg', '90-110 days', '3-4 tons/acre', 'Medium', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80'),
('Chilli', 'Capsicum annuum', 'Black / Red Loam', 'Kharif', 'Low-Medium (400-600 mm)', '20-30°C', '500-800 mm', 'NPK: 50:25:25 kg/acre', '120-150 days', '2-3 tons dry/acre', 'Very High', 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80')
ON CONFLICT DO NOTHING;

-- 3. SEED FERTILIZERS MASTER DATA
INSERT INTO fertilizers (fertilizer_name, soil_condition, quantity, application_method, precautions) VALUES
('Urea (46% N)', 'Nitrogen deficient soils, all soil types', '50-100 kg/acre in 2-3 split doses', 'Broadcast or side dressing near root zone', 'Do not apply in direct water logging; mix with neem cake for slow release'),
('DAP (Di-Ammonium Phosphate 18:46:0)', 'Phosphorus deficient, neutral to alkaline soils', '40-50 kg/acre as basal dose', 'Soil placement at sowing or transplanting', 'Always apply before sowing directly into furrow near seeds'),
('MOP (Muriate of Potash 60% K2O)', 'Sandy and light textured soils', '25-40 kg/acre in split doses', 'Basal and top dressing at flowering', 'Avoid excess in saline soils; use SOP for chlorine-sensitive crops'),
('Single Super Phosphate (SSP 16% P, 11% S)', 'Sulphur & Phosphorus deficient soils', '100-150 kg/acre basal', 'Soil incorporation during field preparation', 'Best suited for oilseeds (Groundnut, Mustard) and pulses'),
('Vermicompost (Organic)', 'Low organic carbon soils (< 0.5% OC)', '2-3 tons/acre', 'Broadcast and mix during primary ploughing', 'Keep moist and protect from direct harsh sunlight'),
('Zinc Sulphate (21% Zn)', 'Zinc deficient, intensive cereal cropped soils', '10 kg/acre once in 2 seasons', 'Basal soil application', 'Never mix directly with phosphate fertilizers like DAP/SSP')
ON CONFLICT DO NOTHING;

-- 4. SEED DISEASES MASTER DATA
INSERT INTO diseases (crop_name, disease_name, symptoms, causes, prevention, treatment, organic_solution, image_url, season) VALUES
('Paddy', 'Blast Disease', 'Spindle-shaped diamond spots with grey center on leaves; dark neck rot', 'Fungus Magnaporthe oryzae, high humidity (>90%)', 'Avoid excess nitrogen fertilizer, use resistant varieties', 'Spray Tricyclazole 75 WP @ 120g/acre or Isoprothiolane 40 EC', 'Spray Pseudomonas fluorescens @ 1 kg/acre or 5% neem seed kernel extract', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', 'Kharif'),
('Paddy', 'Stem Borer', 'Dead heart in vegetative stage; White earhead with chaffy grains in reproductive stage', 'Scirpophaga incertulas larvae boring into central shoot', 'Clip seedling tips before transplanting, install 5 pheromone traps/acre', 'Apply Chlorantraniliprole 18.5 SC @ 60 ml/acre or Cartap hydrochloride 4G @ 10 kg/acre', 'Release Trichogramma egg parasitoids @ 60,000/acre; spray 5% Neem oil', 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80', 'Kharif'),
('Tomato', 'Leaf Curl Virus', 'Severe curling, puckering of leaves, stunting of plants with bushy appearance', 'Tomato leaf curl virus transmitted by Whitefly (Bemisia tabaci)', 'Install 15 yellow sticky traps/acre, use barrier crops like maize/sorghum', 'Spray Acetamiprid 20 SP @ 50g/acre or Imidacloprid 17.8 SL @ 60ml/acre', 'Spray Neem oil (10,000 ppm) @ 5ml/L + garlic extract every 10 days', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80', 'All Season'),
('Cotton', 'Pink Bollworm', 'Rosetted flowers, bore holes in bolls with pink larvae feeding on seeds and lint', 'Pectinophora gossypiella larvae', 'Crop rotation, destroy crop residue, install 8-10 pheromone traps/acre', 'Spray Emamectin benzoate 5 SG @ 100g/acre or Spinosad 45 SC @ 75ml/acre', 'Spray Agniastra or Neem seed kernel extract 5%; release Trichogramma wasps', 'https://images.unsplash.com/photo-1594488555776-8809ff44f24b?w=600&auto=format&fit=crop&q=80', 'Kharif'),
('Wheat', 'Yellow Rust (Stripe Rust)', 'Yellow pustules arranged in linear stripes on leaf surface, powder rubs off on fingers', 'Fungus Puccinia striiformis, cool temperatures (10-15°C) and dew', 'Early sowing, use rust-resistant cultivars (HD 2967, PBW 550)', 'Spray Propiconazole 25 EC @ 200ml/acre in 200L water', 'Spray sour buttermilk (5L in 100L water) or Trichoderma viride', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80', 'Rabi')
ON CONFLICT DO NOTHING;
