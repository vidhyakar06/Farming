import fs from 'fs';
import https from 'https';
import path from 'path';

const crops = [
  { id: 'paddy', url: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&q=80' },
  { id: 'wheat', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80' },
  { id: 'tomato', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80' },
  { id: 'cotton', url: 'https://images.unsplash.com/photo-1594488555776-8809ff44f24b?w=600&q=80' },
  { id: 'sugarcane', url: 'https://images.unsplash.com/photo-1629851609139-47021ebcf88a?w=600&q=80' },
  { id: 'maize', url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80' },
  { id: 'onion', url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&q=80' },
  { id: 'chilli', url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&q=80' },
  { id: 'banana', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80' },
  { id: 'mango', url: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=600&q=80' },
  { id: 'coconut', url: 'https://images.unsplash.com/photo-1627308595229-7830a5c18037?w=600&q=80' },
  { id: 'soybean', url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&q=80' },
  { id: 'potato', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80' },
  { id: 'groundnut', url: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=600&q=80' },
  { id: 'brinjal', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80' },
  { id: 'turmeric', url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&q=80' },
  { id: 'ginger', url: 'https://images.unsplash.com/photo-1615485291234-9d694218aeb6?w=600&q=80' },
  { id: 'garlic', url: 'https://images.unsplash.com/photo-1501420101890-43a2bdfca77f?w=600&q=80' },
  { id: 'mustard', url: 'https://images.unsplash.com/photo-1631209121750-a9f656d28f4b?w=600&q=80' },
  { id: 'cucumber', url: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&q=80' },
  { id: 'papaya', url: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=600&q=80' },
  { id: 'watermelon', url: 'https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?w=600&q=80' },
];

const targetDir = path.join(process.cwd(), 'public', 'images', 'crops');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(dest));
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  let count = 0;
  for (const crop of crops) {
    const dest = path.join(targetDir, `${crop.id}.jpg`);
    try {
      await downloadFile(crop.url, dest);
      console.log(`[${++count}/${crops.length}] Downloaded ${crop.id}.jpg`);
      await new Promise(r => setTimeout(r, 100));
    } catch (e) {
      console.error(`Error downloading ${crop.id}:`, e.message);
    }
  }
  console.log('Finished downloading all crops!');
}

run();
