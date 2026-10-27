// In-memory sliding-window rate limiter for serverless instance
// Max 5 submissions per 60-second window per IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);

  // Periodic memory cleanup when map grows
  if (rateLimitMap.size > 1000) {
    for (const [key, times] of rateLimitMap.entries()) {
      const active = times.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, active);
      }
    }
  }

  return false;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate-limiting check based on forwarded client IP
  const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
    .toString()
    .split(',')[0]
    .trim();

  if (isRateLimited(clientIp)) {
    return res.status(429).json({ 
      error: 'Too many feedback requests. Please wait a minute before trying again.' 
    });
  }

  try {
    const { category, message, email, created_at } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Feedback message is required' });
    }

    // Hardened payload boundaries
    const safeMessage = escapeHtml(message.trim().slice(0, 3000));
    const safeEmail = email && typeof email === 'string' ? escapeHtml(email.trim().slice(0, 254)) : '';
    const timestamp = created_at ? escapeHtml(String(created_at).slice(0, 64)) : new Date().toISOString();

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = (process.env.NOTIFICATION_EMAIL || 'pawartejas517@gmail.com').trim();

    // Graceful skip if Resend API key is not configured in environment
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured in environment variables.');
      return res.status(200).json({
        success: true,
        notification: 'skipped',
        reason: 'Missing server configuration'
      });
    }

    const categoryLabels = {
      feedback: 'General Feedback',
      bug: 'Bug Report',
      request: 'Feature Request',
      other: 'Other Inquiry'
    };
    const categoryKey = category && typeof category === 'string' ? category.slice(0, 32) : 'feedback';
    const categoryLabel = categoryLabels[categoryKey] || 'General Feedback';

    const buildPayload = (recipient) => ({
      from: 'Bloom Card <onboarding@resend.dev>',
      to: [recipient],
      reply_to: safeEmail ? safeEmail : undefined,
      subject: `🌸 [Bloom Feedback] ${categoryLabel}: "${safeMessage.slice(0, 45)}${safeMessage.length > 45 ? '...' : ''}"`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0E100F; color: #FFFFFF; }
              .card { max-width: 560px; margin: 32px auto; background: #141615; border-radius: 16px; border: 1px solid rgba(255,255,255,0.12); padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.6); }
              .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; background: rgba(0,136,255,0.15); color: #0088FF; border: 1px solid rgba(0,136,255,0.3); }
              .field-label { font-size: 11px; color: #8E8E93; text-transform: uppercase; letter-spacing: 0.5px; margin: 16px 0 6px 0; }
              .field-value { font-size: 15px; color: #E5E5EA; margin: 0; }
              .message-box { background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px; font-size: 14px; line-height: 1.6; color: #FFFFFF; white-space: pre-wrap; margin-top: 6px; }
              .footer { font-size: 12px; color: #636366; text-align: center; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; }
            </style>
          </head>
          <body>
            <div class="card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <span style="font-size: 18px; font-weight: 600;">🌸 Bloom Card Feedback</span>
                <span class="badge">${categoryLabel}</span>
              </div>

              <div class="field-label">Sender</div>
              <div class="field-value">${safeEmail ? `<a href="mailto:${safeEmail}" style="color: #64D2FF; text-decoration: none;">${safeEmail}</a>` : 'Anonymous Visitor'}</div>

              <div class="field-label">Feedback Message</div>
              <div class="message-box">${safeMessage}</div>

              <div class="footer">
                Received at ${timestamp} • Bloom Studio Internal Dispatch
              </div>
            </div>
          </body>
        </html>
      `
    });

    let targetRecipient = toEmail;
    let response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(buildPayload(targetRecipient))
    });

    let data = await response.json();

    // If Resend onboarding domain restricts delivery, fallback to verified account email
    if (!response.ok && response.status === 403 && targetRecipient !== 'pawartejas517@gmail.com') {
      console.warn(`Resend sandbox restriction on recipient ${targetRecipient}. Falling back to account email.`);
      targetRecipient = 'pawartejas517@gmail.com';
      response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(buildPayload(targetRecipient))
      });
      data = await response.json();
    }

    if (!response.ok) {
      console.error('Resend API dispatch error:', data);
      // Mask internal provider error details from client response
      return res.status(502).json({ error: 'Unable to deliver notification email at this time' });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    console.error('Feedback notification handler exception:', error);
    // Never expose stack traces or server internals
    return res.status(500).json({ error: 'An unexpected server error occurred' });
  }
}
