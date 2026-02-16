import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: { method?: string; body?: unknown },
  res: { status: (code: number) => { json: (body: object) => void } }
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as { name?: string; email?: string; subject?: string; message?: string } | undefined;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { name, email, subject, message } = body;
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const fromAddress = process.env.RESEND_FROM ?? 'Portfolio <onboarding@resend.dev>';
  const toAddress = process.env.CONTACT_EMAIL ?? 'talon_meyer@berkeley.edu';

  const html = `
    <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <hr />
    <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [toAddress],
      replyTo: email.trim(),
      subject: `[Portfolio] ${subject.trim()}`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Contact API error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (c) => map[c] ?? c);
}
