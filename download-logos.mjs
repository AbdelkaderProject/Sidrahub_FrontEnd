import https from 'https';
import fs from 'fs';
import path from 'path';

const logos = [
  {
    name: 'mawani.png',
    url: 'https://upload.wikimedia.org/wikipedia/ar/thumb/2/28/%D8%B4%D8%B9%D8%A7%D8%B1_%D9%85%D9%88%D8%A7%D9%86%D9%8A.png/320px-%D8%B4%D8%B9%D8%A7%D8%B1_%D9%85%D9%88%D8%A7%D9%86%D9%8A.png'
  },
  {
    name: 'monshaat.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Monshaat_logo.svg/320px-Monshaat_logo.svg.png'
  },
  {
    name: 'sdaia.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/SDAIA_Logo.svg/320px-SDAIA_Logo.svg.png'
  },
  {
    name: 'ministry-media.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Ministry_of_Media_%28Saudi_Arabia%29_logo.svg/320px-Ministry_of_Media_%28Saudi_Arabia%29_logo.svg.png'
  },
  {
    name: 'ncc.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/NCC_Logo.svg/320px-NCC_Logo.svg.png'
  }
];

const dir = './src/assets/images/partners';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const requestOptions = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0 Safari/537.36'
  }
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function downloadFile(url, filePath, redirectCount = 0, retryCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) {
      reject(new Error(`Too many redirects for ${url}`));
      return;
    }

    https
      .get(url, requestOptions, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          downloadFile(res.headers.location, filePath, redirectCount + 1).then(resolve).catch(reject);
          return;
        }

        if (res.statusCode === 429 && retryCount < 3) {
          res.resume();
          wait(1500 * (retryCount + 1))
            .then(() => downloadFile(url, filePath, redirectCount, retryCount + 1))
            .then(resolve)
            .catch(reject);
          return;
        }

        if (res.statusCode && res.statusCode >= 400) {
          res.resume();
          reject(new Error(`Failed to download ${path.basename(filePath)}: ${res.statusCode}`));
          return;
        }

        const file = fs.createWriteStream(filePath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filePath);
        });
        file.on('error', (error) => {
          file.close();
          fs.unlink(filePath, () => reject(error));
        });
      })
      .on('error', reject);
  });
}

for (const { name, url } of logos) {
  const filePath = path.join(dir, name);
  await downloadFile(url, filePath);
  console.log('Downloading:', name);
}
