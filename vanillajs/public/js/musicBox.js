import { Auth } from './auth.js';

export class MusicBox {
  constructor(player) {
    this.player = player;
  }

  static addElement(init) {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);
    window.onSpotifyWebPlaybackSDKReady = async () => {
      const token = localStorage.getItem(Auth.ACCESS_TOKEN);
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK Example',
        getOAuthToken: (cb) => {
          cb(token);
        },
      });

      init(player);
    };
  }

  async connect() {
    await this.player.connect();
    console.info('The Web Playback SDK successfully connected to Spotify!');
  }

  addEvents() {
    this.player.addListener('ready', ({ device_id }) => {
      console.info('Ready with Device ID', device_id);
    });

    this.player.addListener('not_ready', ({ device_id }) => {
      console.info('Device ID has gone offline', device_id);
    });

    this.player.addListener('player_state_changed', async (state) => {
      if (!state) {
        return;
      }

      this.setInfo(state.track_window.current_track);
      const playpause = document.getElementById('playpause');
      if (state.paused) {
        playpause.textContent = 'Play';
      } else {
        playpause.textContent = 'Pause';
      }

      const currentState = await this.player.getCurrentState();
      this.toggleNowPlaying(currentState);
    });

    document.getElementById('playpause').addEventListener('click', () => {
      this.player.togglePlay();
    });

    document.getElementById('previous-track').addEventListener('click', () => {
      this.player.previousTrack();
    });

    document.getElementById('next-track').addEventListener('click', () => {
      this.player.nextTrack();
    });
  }

  setInfo(info) {
    const cover = document.getElementById('np-cover');
    cover.setAttribute('src', info.album.images[0].url);
    cover.setAttribute('alt', `cover art for ${info.album.name}`);
    const track = document.getElementById('np-track');
    track.textContent = info.name;
    const artist = document.getElementById('np-artist');
    artist.textContent = info.artists[0].name;
  }

  toggleNowPlaying(currentState) {
    if (currentState) {
      document.getElementById('now-playing').hidden = false;
      document.getElementById('please-transfer').hidden = true;
    } else {
      document.getElementById('now-playing').hidden = true;
      document.getElementById('please-transfer').hidden = false;
    }
  }
}
