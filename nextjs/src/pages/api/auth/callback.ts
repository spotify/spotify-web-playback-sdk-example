import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

const spotify_client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const spotify_redirect_uri = 'http://localhost:3000/api/auth/callback';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const code = req.query.code as string;

  const url = 'https://accounts.spotify.com/api/token';
  const authOptions: RequestInit = {
    method: 'POST',
    body: new URLSearchParams({
      code,
      redirect_uri: spotify_redirect_uri,
      grant_type: 'authorization_code',
    }),
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString(
          'base64',
        ),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  try {
    const response = await fetch(url, authOptions);
    const json: {
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
      scope: string;
    } = await response.json();

    const setCookie = cookie.serialize(
      'spotify-access-token',
      json.access_token,
      {
        maxAge: json.expires_in,
        sameSite: 'strict',
        httpOnly: true,
      },
    );
    res.setHeader('Set-Cookie', setCookie);

    res.redirect('/');
  } catch (err) {
    console.error('callback err', err);
  }
}
