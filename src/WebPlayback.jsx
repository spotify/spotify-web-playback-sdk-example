import React, { useState, useEffect } from 'react';

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

function WebPlayback(props) {

    const [is_paused, setPaused] = useState(false);
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
                volume: 0.2
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
                    <div id="video-wrapper">
                        <video controls loop autoPlay id="video-file" className="w_full" preload="auto">
                            <source src="/videos/fireplace.mp4" type="video/mp4"/>
                        </video>
                    </div>
                </div>
            </>)
    } else {
        return (
            <>
                <div className="container">
                    <div id="video-wrapper">
                        <video controls loop autoPlay id="video-file" className="w_full" preload="auto">
                            <source src="/videos/fireplace.mp4" type="video/mp4"/>
                        </video>
                    </div>

                    <div className="player-wrapper">
                        <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" onClick={() => player.togglePlay()}/>
                        <div className="now-playing__side">
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default WebPlayback
