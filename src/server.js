'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var app = express();
var SpotifyWebApi = require('spotify-web-api-node');

app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', function (req, res) {
    getArtist(req.body.name, res);
});

var spotifyApi = new SpotifyWebApi({
    clientId: '62ccab0f883742c3a2ec026d76fd1c58',
    clientSecret: '3ab1eb83b8e342afbc1322f24caf40ca'
});

var getArtist = function (artist, response) {
    spotifyApi.searchArtists(artist)
        .then(function (data) {
            response
                .status(200)
                .json(data.body);
        }, function (err) {
            if (err.statusCode === 401) {
                spotifyApi.clientCredentialsGrant().then(
                    function (data) {
                        // Save the access token so that it's used in future calls
                        spotifyApi.setAccessToken(data.body['access_token']);
                        getArtist(artist, response);
                    },
                    function (err) {
                        response
                            .status(err.statusCode)
                            .json(err);
                    }
                );
            } else {
                response
                    .status(err.statusCode)
                    .send(err);
            }
        });
};

app.get('/', (req,res) => {
    res
    .status(200)
    .json({name: 'hello'});
});

const PORT = process.env.PORT || 8080;
app.listen(PORT);