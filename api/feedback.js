export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, message, email, created_at } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Feedback message is required' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = (process.env.NOTIFICATION_EMAIL || 'pawartejas517@gmail.com').trim();

    // Graceful skip if Resend API key is not configured yet
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not set in environment variables.');
      return res.status(200).json({
        success: true,
        notification: 'skipped',
        reason: 'Missing RESEND_API_KEY'
      });
    }

    const categoryLabels = {
      feedback: 'General Feedback',
      bug: 'Bug Report',
      request: 'Feature Request',
      other: 'Other Inquiry'
    };
    const categoryLabel = categoryLabels[category] || category || 'Feedback';

    const safeMessage = message.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const timestamp = created_at || new Date().toISOString();

    const buildPayload = (recipient) => ({
      from: 'Bloom Card <onboarding@resend.dev>',
      to: [recipient],
      reply_to: email && email.trim() ? email.trim() : undefined,
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
              <div class="field-value">${email && email.trim() ? `<a href="mailto:${email.trim()}" style="color: #64D2FF; text-decoration: none;">${email.trim()}</a>` : 'Anonymous Visitor'}</div>

              <div class="field-label">Feedback Message</div>
              <div class="message-box">${safeMessage}</div>

              <div class="footer">
                Received at ${timestamp} • <a href="https://supabase.com/dashboard/project/ssxskxgwmvecfmjhjrfj/editor" style="color: #8E8E93; text-decoration: underline;">View in Supabase</a>
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

    // If Resend blocked because onboarding@resend.dev can only send to account owner, fallback to pawartejas517@gmail.com
    if (!response.ok && response.status === 403 && targetRecipient !== 'pawartejas517@gmail.com') {
      console.warn(`Resend restricted recipient ${targetRecipient}. Retrying with account email pawartejas517@gmail.com`);
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
      console.error('Resend API error:', data);
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ success: true, id: data.id, deliveredTo: targetRecipient });
  } catch (error) {
    console.error('Feedback notification handler failed:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
