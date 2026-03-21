import { createMollieClient } from '@mollie/api-client';

const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { plan, userId, email } = req.body;

  if (!plan || !userId || !email) {
    return res.status(400).json({ error: 'Paramètres manquants' });
  }

  try {
    const amount = plan === 'monthly'
      ? { currency: 'EUR', value: '9.99' }
      : { currency: 'EUR', value: '79.00' };

    const description = plan === 'monthly'
      ? 'NetOps Companion — Abonnement mensuel'
      : 'NetOps Companion — Abonnement annuel';

    const appUrl = (process.env.VITE_APP_URL || 'https://netopscompanion.javachrist.fr').replace(/\/+$/, '');

    const payment = await mollie.payments.create({
      amount,
      description,
      redirectUrl: `${appUrl}/pricing?success=1`,
      ...(appUrl.includes('localhost') ? {} : { webhookUrl: `${appUrl}/api/webhook` }),
      metadata: { userId, plan, email },
    });

    return res.status(200).json({ checkoutUrl: payment.getCheckoutUrl() });
  } catch (err) {
    console.error('Mollie error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
