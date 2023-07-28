import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

export default function Player(props){
    let spotifyApi = new SpotifyWebApi()
    const [player, setPlayer] = useState(undefined);
    spotifyApi.setAccessToken(props.token);
    useEffect(() => {
        if(!props.token){
            return
        }
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.25
            });

            setPlayer(player);
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                spotifyApi.transferMyPlayback([device_id]); 
            });

            player.connect();
        };
    }, [props.token]);

}