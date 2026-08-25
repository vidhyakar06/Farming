import fs from 'fs';
import https from 'https';
import path from 'path';

// 1. Copy user's exact uploaded Paddy image
const userPaddyImg = 'C:\\Users\\S Vidhyakar\\.gemini\\antigravity-ide\\brain\\a064af2a-616e-4ed5-8d07-16d3cea0aa24\\.user_uploaded\\media_1787647930985.png';
const destPaddy = path.join(process.cwd(), 'public', 'images', 'crops', 'paddy.png');
fs.copyFileSync(userPaddyImg, destPaddy);
console.log('Copied user paddy image to public/images/crops/paddy.png');

// 2. Download missing crops with working high-res URLs
const missing = [
  { id: 'sugarcane', url: 'https://images.unsplash.com/photo-1598112972019-91e1162b80f7?w=600&q=80' },
  { id: 'coconut', url: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?w=600&q=80' },
  { id: 'ginger', url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&q=80' },
  { id: 'garlic', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80' },
  { id: 'mustard', url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&q=80' },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed ${url}: ${response.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => file.close(() => resolve(dest)));
    }).on('error', reject);
  });
}

async function fetchMissing() {
  for (const item of missing) {
    const dest = path.join(process.cwd(), 'public', 'images', 'crops', `${item.id}.jpg`);
    try {
      await downloadFile(item.url, dest);
      console.log(`Downloaded ${item.id}.jpg`);
    } catch (e) {
      console.error(`Error ${item.id}:`, e.message);
    }
  }
}

fetchMissing();
