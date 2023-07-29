import React from "react"
import './App.css';


export default function Login() {
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_REDIRECT_URI;
    const scopes = [
        'user-read-private',
        'user-read-playback-state',
        'user-modify-playback-state',
        'streaming',
        'user-read-email',
        'user-top-read',
    ];
    const AUTH_URL = `${authEndpoint}?client_id=${clientId}&redirect_uri=${(redirectUri)}&scope=${scopes.join('%20')}&response_type=code&show_dialog=true`;
    return (
        <a className="login-btn" href={AUTH_URL}>
            Login With Spotify
        </a>
    )
}