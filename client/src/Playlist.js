import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

export default function Playlist(props){
    const [playlists, setPlaylists] = useState([])
    const spotifyApi = new SpotifyWebApi();

    useEffect(() => {
        if(!props.accessToken || !props.user){ return }
        //console.log(props.accessToken)
        spotifyApi.getUserPlaylists(props.user.id).then((playlists) => {
            //console.log(playlists)
            setPlaylists(playlists.items)
            props.setPlaylists(playlists.items)
        })
    },[props])

    return(
        <div>
            <select onChange={e=> props.setUserChoice(e.target.value)}> 
            <option selected="selected" value="">Choose a playlist</option>
            {
              playlists.map(opt=>
              <option>{opt.name}</option>)             
            }
            </select>
        </div>
    )
}