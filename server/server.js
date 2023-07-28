const express = require('express');
const cors = require('cors');
const spotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get('/message', (req, res) => {
  res.json({message : 'Hello from server'});
});

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new spotifyWebApi({
        redirectUri: process.env.REACT_APP_REDIRECT_URI,
        clientId: process.env.REACT_APP_CLIENT_ID,
        clientSecret : process.env.REACT_APP_CLIENT_SECRET,
        refreshToken
    })
    
    spotifyApi.refreshAccessToken().then(data => {
        res.json({
            accessToken : data.body.accessToken,
            expiresIn : data.body.expiresIn
        })
    }).catch(err => {
        res.sendStatus(400)
    })
})

app.post('/login', (req, res) => {
  const code = req.body.code;
  const spotifyApi = new spotifyWebApi({
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret : process.env.REACT_APP_CLIENT_SECRET
  })

  spotifyApi.authorizationCodeGrant(code).then(data => {
    res.json({
      accessToken : data.body.access_token,
      refreshToken : data.body.refresh_token,
      expiresIn : data.body.expires_in
    })
  }).catch(err => {
    console.log(err);
    console.log('from login')
    res.status(500)
  })
});


app.listen(3001)
/*app.listen(4000, () => {
    console.log(`Server is running on port 3000.`);
});*/

