import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.cookies['spotify-access-token'] || '';
  res.json({ token });
}
