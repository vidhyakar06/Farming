import fs from 'fs';
import https from 'https';

const urls = [
  { id: 'cotton', url: 'https://images.unsplash.com/photo-1599818816942-5cb0f9011be4?w=600&q=80' },
  { id: 'sugarcane', url: 'https://images.unsplash.com/photo-1596766795493-27ab2a1b945c?w=600&q=80' },
];

for (const item of urls) {
  https.get(item.url, res => {
    if (res.statusCode === 200) {
      const f = fs.createWriteStream(`public/images/crops/${item.id}.jpg`);
      res.pipe(f);
      f.on('finish', () => console.log(`Saved ${item.id}.jpg successfully!`));
    } else {
      console.log(`Failed ${item.id}: ${res.statusCode}`);
    }
  });
}
