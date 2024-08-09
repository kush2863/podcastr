// pages/api/checkout_sessions.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '@/lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
  

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: '9999',
            quantity: 1,
          },
        ],
        mode: "subscription", // or 'subscription' for recurring payments
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      res.status(500).json({ error});
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
