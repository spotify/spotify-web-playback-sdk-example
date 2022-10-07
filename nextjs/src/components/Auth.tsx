import { useRouter } from 'next/router';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';

const STATE = 'state';
const ACCESS_TOKEN = 'access_token';
const EXPIRES_IN = 'expires_in';
const EXPIRES_AT = 'expires_at';
const SCOPE = 'streaming user-read-email user-read-private';

//#region Styled
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 24px;
  height: 100%;
  width: 100%;
  padding-top: 48px;
`;

const Button = styled.button`
  background-color: #44c767;
  border-radius: 28px;
  border: 1px solid #18ab29;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: Arial;
  font-size: 18px;
  padding: 16px 31px;
  text-decoration: none;
  text-shadow: 0px 1px 0px #2f6627;
`;
//#endregion

export const AuthContext = createContext<string | undefined>(undefined);

interface Props {
  children: ReactNode;
}
export const Auth = (props: Props) => {
  const router = useRouter();
  const [token, setToken] = useState('');

  useEffect(() => {
    const cb = async () => {
      const storedToken = localStorage.getItem(ACCESS_TOKEN);
      const storedState = localStorage.getItem(STATE);
      const expired = new Date() >= new Date(localStorage.getItem(EXPIRES_AT));

      // found an implicit flow token
      if (storedToken && !expired && storedState) {
        setToken(storedToken);
        return;
      }

      try {
        const tokenResponse = await fetch('/api/auth/token');
        const { token: cookieToken }: { token: string } =
          await tokenResponse.json();

        // found an auth code flow token
        if (cookieToken) {
          setToken(cookieToken);
          return;
        }

        if (window.location.hash) {
          const params = new URLSearchParams(
            window.location.hash.replace('#', '?'),
          );
          const token = params.get(ACCESS_TOKEN);
          const expiresIn = parseInt(params.get(EXPIRES_IN), 10); // seconds
          const state = params.get(STATE);
          if (state !== localStorage.getItem(STATE)) {
            throw new Error('State mismatch');
          }
          const expiresAt = new Date(
            new Date().getTime() + expiresIn * 1000,
          ).toISOString();

          localStorage.setItem(ACCESS_TOKEN, token);
          localStorage.setItem(EXPIRES_AT, expiresAt);
          // cleanup url
          router.push('/', undefined, { shallow: true });
        }

        if (window.location.search) {
          const params = new URLSearchParams(window.location.search);
          if (params.has('error')) {
            throw new Error(params.get('error'));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    cb();
  }, [router, router.asPath]);

  const handleClick = async (flow: 'implicit' | 'code') => {
    let response_type = '';
    let redirect_uri = '';

    if (flow === 'implicit') {
      await fetch('/api/auth/deleteCookie');
      response_type = 'token';
      redirect_uri = 'http://localhost:3000/';
    }

    if (flow === 'code') {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(EXPIRES_AT);
      response_type = 'code';
      redirect_uri = 'http://localhost:3000/api/auth/callback';
    }

    // generate random string
    const state = ((length: number) => {
      let text = '';
      const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    })(16);

    localStorage.setItem(STATE, state);

    const params = new URLSearchParams({
      response_type,
      client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      scope: SCOPE,
      redirect_uri,
      state,
    });

    const url = `https://accounts.spotify.com/authorize/?${params.toString()}`;
    router.push(url);
  };

  if (!token) {
    return (
      <Container>
        <Button onClick={() => handleClick('implicit')}>
          Login via Implicit Grant
        </Button>
        <Button onClick={() => handleClick('code')}>
          Login via Authorization Code
        </Button>
      </Container>
    );
  }

  return (
    <AuthContext.Provider value={token}>{props.children}</AuthContext.Provider>
  );
};
