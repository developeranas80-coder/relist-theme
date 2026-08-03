import fs from 'fs';
import https from 'https';

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    };

    https.get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Status ${response.statusCode} for ${url}`));
        return;
      }
      const totalBytes = parseInt(response.headers['content-length'], 10) || 0;
      let downloadedBytes = 0;
      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        if (totalBytes > 0) {
          const pct = ((downloadedBytes / totalBytes) * 100).toFixed(1);
          process.stdout.write(`\r  Progress: ${pct}% (${(downloadedBytes / 1048576).toFixed(1)} MB / ${(totalBytes / 1048576).toFixed(1)} MB)`);
        }
      });
      response.pipe(file);
      file.on('finish', () => {
        console.log('');
        file.close(() => resolve(destPath));
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

// Pexels high-fashion aesthetic videos (royalty-free, publicly accessible)
// Slide 1: Model posing in red suit — luxury editorial vibe
const v1 = 'https://videos.pexels.com/video-files/5469847/5469847-uhd_2560_1440_30fps.mp4';
// Slide 2: Studio photoshoot — man and woman, premium fashion feel
const v2 = 'https://videos.pexels.com/video-files/7800545/7800545-uhd_2732_1440_25fps.mp4';

async function main() {
  console.log('Downloading aesthetic fashion video 1 (Model posing — editorial)...');
  await downloadFile(v1, './public/videos/hero.mp4');
  console.log('✓ Fashion video 1 saved to public/videos/hero.mp4');

  console.log('Downloading aesthetic fashion video 2 (Studio photoshoot)...');
  await downloadFile(v2, './public/videos/hero-2.mp4');
  console.log('✓ Fashion video 2 saved to public/videos/hero-2.mp4');

  console.log('\nAll done! Both hero slider videos are ready.');
}

main().catch(err => console.error('Download failed:', err));
