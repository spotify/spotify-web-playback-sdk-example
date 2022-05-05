import React, { useEffect, useState } from 'react';
import { Player } from '../components/Player';
import { Connect } from '../components/Connect';
import { useRouter } from 'next/router';
import { Loader } from '../components/Loader';

enum Keys {
  STATE = 'state',
  ACCESS_TOKEN = 'access_token',
  EXPIRES_IN = 'expires_in',
  EXPIRES_AT = 'expires_at',
}

const generateRandomString = (length: number) => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

function HomePage() {
  const router = useRouter();
  const [token, setToken] = useState('');

  useEffect(() => {
    async function getToken() {
      try {
        const state = generateRandomString(16);
        localStorage.setItem(Keys.STATE, state);

        const scope = 'streaming user-read-email user-read-private';
        const url = Object.entries({
          client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
          scope,
          redirect_uri: 'http://localhost:3000/',
          state,
        }).reduce((result, [key, value]) => {
          return `${result}&${key}=${encodeURIComponent(value)}`;
        }, `https://accounts.spotify.com/authorize?response_type=token`);

        window.location.assign(url);
      } catch (err) {
        console.error('useEffect', err);
      }
    }

    const storedToken = localStorage.getItem(Keys.ACCESS_TOKEN);
    const expiresAt = localStorage.getItem(Keys.EXPIRES_AT);
    const expired = new Date() >= new Date(expiresAt);
    const storedState = localStorage.getItem(Keys.STATE);

    if (storedToken && !expired && storedState) {
      setToken(storedToken);
      return;
    }
    if (window.location.hash) {
      const params = new URLSearchParams(
        window.location.hash.replace('#', '?'),
      );
      const token = params.get(Keys.ACCESS_TOKEN);
      const expiresIn = parseInt(params.get(Keys.EXPIRES_IN), 10);
      const state = params.get(Keys.STATE);
      // TODO: check the validity of this
      // if (state !== localStorage.getItem(Keys.STATE)) {
      //   throw new Error('State mismatch');
      // }
      const expiresAt = new Date(
        new Date().getTime() + expiresIn * 1000,
      ).toISOString();

      localStorage.setItem(Keys.ACCESS_TOKEN, token);
      localStorage.setItem(Keys.EXPIRES_AT, expiresAt);
      router.push('/', undefined, { shallow: true });
    } else if (router.asPath.startsWith('/?')) {
      console.error('Error');
    } else {
      getToken();
    }
  }, [router, router.asPath, token]);

  return (
    <>
      {token === '' ? (
        <Loader />
      ) : (
        <Player token={token}>
          <Connect />
        </Player>
      )}
    </>
  );
}

export default HomePage;
