import React from "react"



export default function Login() {
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const clientId = "c291c7d857a44acb8bc3f2cc2cd7f83f";
    const redirectUri = "http://localhost:3000/";
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
        <a className="btn btn-success btn-lg" href={AUTH_URL}>
            Login With Spotify
        </a>
    )
}