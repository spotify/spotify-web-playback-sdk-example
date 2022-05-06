import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const setCookie = cookie.serialize('spotify-access-token', '', {
    maxAge: 0,
    sameSite: 'strict',
    httpOnly: true,
  });
  res.setHeader('Set-Cookie', setCookie);
  res.json({});
}
