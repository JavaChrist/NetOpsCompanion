import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createMollieClient } from '@mollie/api-client';
import { createClient } from '@supabase/supabase-js';

const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { id: paymentId } = req.body as { id: string };
  if (!paymentId) return res.status(400).end();

  try {
    const payment = await mollie.payments.get(paymentId);
    const { userId, plan } = payment.metadata as { userId: string; plan: string };

    if (payment.status === 'paid') {
      const periodEnd = new Date();
      if (plan === 'monthly') {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }

      await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          status: 'active',
          plan,
          current_period_end: periodEnd.toISOString(),
          mollie_payment_id: paymentId,
        }, { onConflict: 'user_id' });
    }

    if (payment.status === 'expired' || payment.status === 'canceled' || payment.status === 'failed') {
      await supabase
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('user_id', userId);
    }

    return res.status(200).end();
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).end();
  }
}
