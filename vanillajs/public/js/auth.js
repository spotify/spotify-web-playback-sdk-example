import { SPOTIFY_CLIENT_ID } from './env.js';

export class Auth {
  static STATE = 'state';
  static ACCESS_TOKEN = 'access_token';
  static EXPIRES_IN = 'expires_in';
  static EXPIRES_AT = 'expires_at';

  static generateRandomString(length) {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  static async getToken() {
    try {
      const state = this.generateRandomString(16);
      localStorage.setItem(Auth.STATE, state);
      const scope = 'streaming user-read-email user-read-private';
      const url = Object.entries({
        client_id: SPOTIFY_CLIENT_ID,
        scope,
        redirect_uri: 'http://localhost:3000/',
        state,
      }).reduce((result, [key, value]) => {
        return `${result}&${key}=${encodeURIComponent(value)}`;
      }, `https://accounts.spotify.com/authorize?response_type=token`);

      window.location.assign(url);
    } catch (err) {
      console.error('Get Token Failed', err);
    }
  }

  static validate() {
    const storedToken = localStorage.getItem(Auth.ACCESS_TOKEN);
    const expiresAt = localStorage.getItem(Auth.EXPIRES_AT);
    const expired = new Date() >= new Date(expiresAt);
    const storedState = localStorage.getItem(Auth.STATE);
    if (storedToken && !expired && storedState) {
      return true;
    } else {
      return false;
    }
  }

  static store() {
    if (window.location.hash) {
      const hashSearch = window.location.hash.replace('#', '?');
      const params = new URLSearchParams(hashSearch);
      const token = params.get(Auth.ACCESS_TOKEN);
      const expiresIn = parseInt(params.get(Auth.EXPIRES_IN), 10);
      const state = params.get(Auth.STATE);
      if (state !== localStorage.getItem(Auth.STATE)) {
        throw new Error('State mismatch');
      }
      const expiresAt = new Date(
        new Date().getTime() + expiresIn * 1000,
      ).toISOString();

      localStorage.setItem(Auth.ACCESS_TOKEN, token);
      localStorage.setItem(Auth.EXPIRES_AT, expiresAt);
      window.location.replace('/');
      return;
    } else {
      throw new Error('No access Token');
    }
  }
}
