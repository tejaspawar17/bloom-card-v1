import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Always allow GET or HEAD for social crawler requests
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cardId = req.query.card || req.query.id || '';
    const hasCardParam = Boolean(cardId || req.query.d || req.query.preview === 'recipient');

    const host = req.headers['x-forwarded-host'] || req.headers.host || 'bloom-card-v1.vercel.app';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${proto}://${host}`;

    // Read static index.html built by Vite
    let htmlPath = path.join(process.cwd(), 'dist', 'index.html');
    if (!fs.existsSync(htmlPath)) {
      htmlPath = path.join(process.cwd(), 'index.html');
    }

    let html = fs.readFileSync(htmlPath, 'utf8');

    if (hasCardParam) {
      const recipientTitle = 'A Sealed Keepsake For You 💌 | Bloom';
      const recipientDesc = 'Someone crafted a personal 3D keepsake card for you. Tap to tear open the pack and reveal your card.';
      const recipientImage = `${baseUrl}/og-receiver.png`;

      // Replace Open Graph title, description, and image
      html = html
        .replace(/<title>.*?<\/title>/gi, `<title>${recipientTitle}</title>`)
        .replace(/<meta property="og:title" content=".*?" \/>/gi, `<meta property="og:title" content="${recipientTitle}" />`)
        .replace(/<meta property="og:description" content=".*?" \/>/gi, `<meta property="og:description" content="${recipientDesc}" />`)
        .replace(/<meta property="og:image" content=".*?" \/>/gi, `<meta property="og:image" content="${recipientImage}" />`)
        .replace(/<meta property="og:image:secure_url" content=".*?" \/>/gi, `<meta property="og:image:secure_url" content="${recipientImage}" />`)
        .replace(/<meta name="twitter:title" content=".*?" \/>/gi, `<meta name="twitter:title" content="${recipientTitle}" />`)
        .replace(/<meta name="twitter:description" content=".*?" \/>/gi, `<meta name="twitter:description" content="${recipientDesc}" />`)
        .replace(/<meta name="twitter:image" content=".*?" \/>/gi, `<meta name="twitter:image" content="${recipientImage}" />`);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    return res.status(200).send(html);
  } catch (error) {
    console.error('SSR preview metadata handler error:', error);
    return res.status(500).send('Internal Server Error');
  }
}
