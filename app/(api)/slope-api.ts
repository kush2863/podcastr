import { useUser } from '@clerk/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  intentSecret?: string;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const {user} = useUser();

    try {
      const response = await fetch(`https://api.slope.so/v3/orders/${user?.id}/intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SLOPE_API_KEY}`, // Make sure to have your Slope API Key in the environment variables
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to generate order intent: ${response.statusText}`);
      }

      const data = await response.json();

      res.status(200).json({ intentSecret: data.intentSecret });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate order intent' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
