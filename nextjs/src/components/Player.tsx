import React, { createContext, ReactNode, useState, useEffect } from 'react';

export const PlayerContext = createContext<Spotify.Player>(undefined);

interface Props {
  token: string;
  children: ReactNode;
}
export const Player = ({ token, children }: Props) => {
  const [player, setPlayer] = useState<Spotify.Player>(undefined);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const p = new window.Spotify.Player({
        name: 'Web Playback SDK Example',
        getOAuthToken: (cb: (arg0: string) => void) => {
          cb(token);
        },
      });

      p.connect().then((success) => {
        if (success) {
          console.log(
            'The Web Playback SDK successfully connected to Spotify!',
          );
        }
        setPlayer(p);
      });
    };
  }, [token]);

  useEffect(() => {
    if (player) {
      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
      });

      player.addListener(
        'not_ready',
        ({ device_id }: { device_id: string }) => {
          console.log('Device ID has gone offline', device_id);
        },
      );
    }
  }, [player]);

  return (
    <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>
  );
};
