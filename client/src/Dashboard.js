import React from 'react';
import useAuth from './useAuth';
import SpotifyWebApi from 'spotify-web-api-js';
import Player from './Player';
import Playlist from './Playlist';
import Timer from './Timer';
import { useState, useEffect } from'react';

export default function Dashboard({code}) {
    const accessToken = useAuth(code)
    const [user, setUser] = useState(null);
    const [userChoice, setUserChoice] = useState(null);
    const [playlists, setPlaylists] = useState(null);
    const [win, setWin] = useState(false);
    const [lose, setLose] = useState(false);
    const [songs, setSongs] = useState([]);
    const [gameActive, setGameActive] = useState(false);
    const [correctChoice, setCorrectChoice] = useState(-1);
    const [gameChoices, setGameChoices] = useState([]);
    const [choicesReady, setChoicesReady] = useState(false);
    const [songDuration, setSongDuration] = useState(0);
    const [timeDone, setTimeDone] = useState(false);

    let spotifyApi = new SpotifyWebApi();

    //hook to set access token and user if token changes
    useEffect(() => {
        if(!accessToken) return;
        spotifyApi.setAccessToken(accessToken)
        spotifyApi.getMe().then((res) => {
            setUser(res);
        })
    }, [accessToken]);

    //hook to set song array
    useEffect(() => {
        if(songs.length === 0) return;
        setSongs(shuffleSongs(songs))
        spotifyApi.getTrack(`${songs[0].track.id}`).then((res) => {
            //console.log(res.duration_ms)
            setSongDuration(res.duration_ms)
            setGameActive(true)
        })
    }, [songs]);

    //hook to populate game choices and play song
    useEffect(() => {
        if(!gameActive) { return };
        
        let randomChoices = [-1, -1, -1, -1] //this array will hold the random choices for the game
        let correctIndex = Math.floor(Math.random() * 4) //this will choose a number 0-3, assigning that index the correct choice

        //this loop populates the random choices array with random numbers from 0 to song array length
        for(let i = 0; i < 4; i++){
            if(i !== correctIndex){
              let filled = false;
              let randomChoiceIndex = -1;
      
              while(!filled){
                randomChoiceIndex = Math.floor(Math.random() * (songs.length));
                filled = true;
              }
              randomChoices[i] = randomChoiceIndex;
            }
        }
        let newSongDuration = songDuration - 16000;
        let randomMS = Math.floor(Math.random() * newSongDuration);
        spotifyApi.play({uris: [songs[0].track.uri], position_ms:randomMS}) //currently hard coding the first song to be the correct song
        randomChoices[correctIndex] = 0; //setting the correct index (A,B,C,D) to be correct song which is index 0 of songs array
        randomChoices = randomChoices.map(index => songs[index]) //mapping the numbers to the songs array
        setCorrectChoice(correctIndex);
        setGameChoices(randomChoices);
        setTimeDone(false)
        //spotifyApi.play()
        //spotifyApi.seek(25000)
    }, [gameActive]);


    //hook to set choices ready
    useEffect(() => {
        if(gameChoices.length < 4) return;
        setChoicesReady(true);
    }, [gameChoices])

    //function to shuffle and return songs
    //shuffles by doing n swaps
    const shuffleSongs = (songs) => {
        for (let i = songs.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i+1));
          let temp = songs[i];
          songs[i] = songs[j];
          songs[j] = temp;
        }
        return songs;
    }

    //handles play button click
    function handleClick() {
        setWin(false)
        setLose(false)
        spotifyApi.getPlaylistTracks(playlists.find(t => t.name === userChoice).id, {limit:100}).then((res) => {
            setSongs(res.items)
        })
    }

    function handleGameChoice(index) {
        if(index === correctChoice){
            setWin(true);
        } else {
            setLose(true);
        }
        setGameActive(false);
        spotifyApi.pause()
    }

    useEffect(() => {
        if(!gameActive) return;
        spotifyApi.pause()
    }, [timeDone])

    return (
        <div>
            <Player token = {accessToken}></Player>
            <Playlist setUserChoice = {setUserChoice} setPlaylists = {setPlaylists} accessToken = {accessToken} user = {user}></Playlist>
            <h1>Current Playlist:{userChoice}</h1>
            {userChoice && !gameActive ? <button onClick={handleClick}>Play</button> : null}
            {
                choicesReady ? 
                    <div> { [0,1,2,3].map(index => <button key={index} onClick={() => handleGameChoice(index)}> {gameChoices[index].track.name} </button>) }
                    <Timer maxRange = {15 * 1000} win = {win} gameActive = {gameActive} setTimeDone = {setTimeDone}></Timer>
                </div>: null}
                
            {win? <h1>You Win!</h1> : null}
            {lose? <h1>You lose!</h1> : null}
        </div>
        
    );
}
