import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createMollieClient } from '@mollie/api-client';

const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { plan, userId, email } = req.body as {
    plan: 'monthly' | 'annual';
    userId: string;
    email: string;
  };

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

    const appUrl = process.env.VITE_APP_URL || 'http://localhost:3000';
    const isLocal = appUrl.includes('localhost');

    const payment = await mollie.payments.create({
      amount,
      description,
      redirectUrl: `${appUrl}/pricing?success=1`,
      // En local, localhost n'est pas accessible depuis Mollie
      ...(isLocal ? {} : { webhookUrl: `${appUrl}/api/webhook` }),
      metadata: { userId, plan, email },
    });

    return res.status(200).json({ checkoutUrl: payment.getCheckoutUrl() });
  } catch (err: unknown) {
    console.error('Mollie error:', err);
    return res.status(500).json({ error: 'Erreur création paiement' });
  }
}
