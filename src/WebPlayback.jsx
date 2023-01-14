import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie';
import animationData from './lotties/duck';
import ThemeButton from './ThemeButton';


const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

const defaultOptions = {
    loop: true,
    autoplay: false,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

function WebPlayback(props) {

    const [is_paused, setPaused] = useState(false);  //useToggler(false)  
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);

    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });

            }));

            player.connect();

        };
    }, []);

    if (!is_active) { 
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </>)
    } else {
        return (
            <>
          <div>
   
                <div className="container">
                    <div className="main-wrapper">

                        <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                        <div className="now-playing__side">
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>

                        {/*     <button className="btn-player" onClick={() => { player.previousTrack() }} >
                                &lt;&lt;
                            </button> */}

                          {/*   <button className="btn-player" onClick={() => { player.togglePlay() }} >
                                { is_paused ? "PLAY" : "PAUSE" }
                            </button> */}

                            {/* <button className="btn-player" onClick={() => { player.nextTrack() }} >
                                &gt;&gt;
                            </button> */}
                            <ThemeButton text="<<" handleClick={() => { player.previousTrack() }}></ThemeButton>
                            <ThemeButton text={ is_paused ? "PLAY" : "PAUSE" } handleClick={() => { player.togglePlay() }}></ThemeButton>
                            <ThemeButton text=">>" handleClick={() => { player.nextTrack() }}></ThemeButton>

                        </div>
                    </div>
                </div> 
               {  <Lottie 
	    options={defaultOptions}
        height={400}
        width={400}
       isStopped={is_paused} 
      />   }
            </div>
       
            </>


        );
    }
}

export default WebPlayback
