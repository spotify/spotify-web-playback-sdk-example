import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { PlayerContext } from './Player';
import { Loader } from './Loader';

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

const NowPlayingCover = styled.img`
  border-radius: 8px;
  float: left;
  width: 300px;
  height: 300px;
  background: transparent;
`;

const NowPlayingSide = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: center;
`;

const NowPlayingName = styled.div`
  font-size: 1.5rem;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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

const PlayPause = styled(Button)`
  min-width: 120px;
`;
//#endregion

interface Props {
  player: Spotify.Player;
}

const View = ({ player }: Props) => {
  const [isPaused, setPaused] = useState(false);
  const [isActive, setActive] = useState(false);
  const [currentTrack, setTrack] = useState<Spotify.Track>(undefined);

  player.addListener('player_state_changed', async (state) => {
    if (!state) {
      return;
    }

    setTrack(state.track_window.current_track);
    setPaused(state.paused);

    const currentState = await player.getCurrentState();
    if (currentState) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  if (!isActive) {
    return (
      <Container>
        <b>
          Instance not active. Transfer your playback using your Spotify app.
        </b>
      </Container>
    );
  }
  return (
    <Container>
      <NowPlayingCover
        src={currentTrack.album.images[0].url}
        alt={`cover art for ${currentTrack.album.name}`}
      />
      <NowPlayingSide>
        <NowPlayingName>{currentTrack.name}</NowPlayingName>
        <div>{currentTrack.artists[0].name}</div>
        <ControlsContainer>
          <Button
            onClick={() => {
              player.previousTrack();
            }}
          >
            &lt;&lt;
          </Button>

          <PlayPause
            onClick={() => {
              player.togglePlay();
            }}
          >
            {isPaused ? 'Play' : 'Pause'}
          </PlayPause>

          <Button
            onClick={() => {
              player.nextTrack();
            }}
          >
            &gt;&gt;
          </Button>
        </ControlsContainer>
      </NowPlayingSide>
    </Container>
  );
};

export const Connect = () => {
  const player = useContext(PlayerContext);
  if (player) {
    return <View player={player} />;
  } else {
    return <Loader />;
  }
};
