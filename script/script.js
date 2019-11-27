let countryID = ``;
let urlPlaylist = `https://api.spotify.com/v1/playlists/${countryID}`;
let playListId = [];
let spotifyKey = `BQBVJe3z0NUp5PrL_lL92AXlw-dZmjF33cKSriYCC0RQbjmrnUpK9cozwwEzjDU7TfaPsw8S-Dpk3f7XJq3Vip-8FppozLwabZE7OIjdnrqByRPrgcrz3Fn6-i3dInBrVG4-e6xZsIxi8h2HzCJfyTnuvZHWPAhDmYI`;
const mapboxKey = `pk.eyJ1Ijoia2FzcmF0YWJyaXppIiwiYSI6ImNrMzdmNGxhbTBhdmkzbHFlNm4zNzM1MXIifQ.NTIDE9lmvt_g4IY_U2Rw6w`;
const Oauth = "https://accounts.spotify.com/authorize?client_id=edb6db7c1c604795b872fe40255d52fc&redirect_uri=http:%2F%2F127.0.0.1:5500%2Findex.html&scope=user-read-private%20user-read-email%20streaming&response_type=token&state=123";
mapboxgl.accessToken = mapboxKey;

//go to spotify login page when pressed on login button
document.getElementById("loginbutton").addEventListener("click", function() {
    window.open(Oauth);
});
//read the url link that the spotify provides which contains the token and put this in the spotifyKey variable
let params = new URLSearchParams(document.location.hash);
spotifyKey = params.get("#access_token");

//the following two event handlers will make the map appear and disappear
document.getElementById("mapAppearButton").addEventListener("click", function() {
    document.getElementById("map").style.display = "block";
    document.getElementById("map").style.visibility = "visible";
});

document.getElementById("mapdisappearButton").addEventListener("click", function() {
    document.getElementById("map").style.display = "none";
});

//initialize mapbox
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [0, 40], // starting position
    zoom: 2 // starting zoom
});

//load map
map.on('load', function() {
    // Add a GeoJSON source containing the state polygons.
    map.addSource('states', {
        'type': 'geojson',
        'data': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson'
    });

    // Add a layer showing the state polygons.
    map.addLayer({
        'id': 'states-layer',
        'type': 'fill',
        'source': 'states',
        'paint': {
            'fill-color': 'rgba(255, 255, 255, 0.1)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
        }
    });
});

//it will retrieve the country you have clicked on the map,
//it will then search which id the the country has
//it will then fetch the top  playlist of that country
//and display the list in a table 
//at the end the spotify webplayer SDK will be called which responsible for playing each individual track
map.on('click', function(e) {

    //remove every child in the table to refresh the list
    refreshTablePlayList();

    var features = map.queryRenderedFeatures(e.point, {
        layers: ['states-layer']
    });
    if (!features.length) {
        return;
    }
    var feature = features[0];

    console.log(feature.properties.name);
    console.log(getCountryId(countryList, feature.properties.name));

    countryID = getCountryId(countryList, feature.properties.name);
    urlPlaylist = `https://api.spotify.com/v1/playlists/${countryID}`;

    //Fetch the top 50 playlist from the selected country fro; the spotify API
    fetch(urlPlaylist, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${spotifyKey}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: "same-origin"
        })
        .then(res => res.json())
        .then(musicList => {
            //console.log(musicList);
            //Display image of the playlist
            displayPlayListImage("playlist-image", musicList);
            //change title of place
            //console.log(musicList.name);
            document.getElementById("playlist-title").innerHTML = musicList.name;
            //show all 50 tracks
            const allTracks = musicList.tracks.items;
            createPlaylistTable(allTracks);
            //console.log(playListId);
        })
        .then(onSpotifyWebPlaybackSDKReady());
});




//return the country spotify ID by passing the countrylist array and the selected country fetched from the mapbox API
function getCountryId(countryList, selectedCountry) {
    for (let i = 0; i < countryList.length; i++) {
        if (selectedCountry == countryList[i].country) {
            // console.log(countryList[i].country);
            return countryList[i].id;
        }
    }
}

//function that creates a table for the playlist with the track name, artist name, duration, play and pause button.
function createPlaylistTable(allTracks) {
    playListId = [];
    let playListCounter = 1;
    // add header row to table
    let trh = document.createElement("TR");
    let th_number = document.createElement("TH");
    let th_playstop = document.createElement("TH");
    let th_song = document.createElement("TH");
    let th_artist = document.createElement("TH");
    let th_album = document.createElement("TH");
    let th_duration = document.createElement("TH");
    let th_dur_image = document.createElement("img");
    th_number.textContent = "#";
    th_song.textContent = "SONG";
    th_artist.textContent = "ARTIST";
    th_album.textContent = "ALBUM";
    th_dur_image.src = "https://img.icons8.com/android/16/ffffff/clock.png";
    th_duration.appendChild(th_dur_image);
    trh.appendChild(th_number);
    trh.appendChild(th_playstop);
    trh.appendChild(th_song);
    trh.appendChild(th_artist);
    trh.appendChild(th_album);
    trh.appendChild(th_duration);
    //add this to the table
    document.getElementById("playlist-table").appendChild(trh);
    //Add the data to the table on each row
    allTracks.forEach(element => {

        playListId.push(element.track.id);

        let tr = document.createElement("TR");
        tr.classList.add("track-row");
        let tdn = document.createElement("TD");
        let td_playStop = document.createElement("TD");
        let td_song = document.createElement("TD");
        let td_artist = document.createElement("TD");
        let td_album = document.createElement("TD");
        let td_dur = document.createElement("TD");
        let playIcon = document.createElement("img");
        playIcon.classList.add("playIcon");
        playIcon.src = "https://img.icons8.com/material-rounded/24/ffffff/play.png";
        let stopIcon = document.createElement("img");
        stopIcon.classList.add("stopIcon");
        stopIcon.src = "https://img.icons8.com/material-rounded/24/ffffff/stop.png";
        // let trackcontent = document.createTextNode(`play stop images`);
        // td_playStop.appendChild(trackcontent);
        tdn.textContent = playListCounter;
        td_playStop.appendChild(playIcon);
        td_playStop.appendChild(stopIcon);
        td_playStop.classList.add("playstop-button");
        //create data for column song title
        trackcontent = document.createTextNode(element.track.name);
        td_song.appendChild(trackcontent);
        td_song.classList.add("track-title");
        //create data for column artist name
        artistname = document.createTextNode(element.track.album.artists[0].name);
        td_artist.appendChild(artistname);
        td_artist.classList.add("artist-name");
        // //create data for column album name
        albumname = document.createTextNode(element.track.album.name.slice(0, 30));
        td_album.appendChild(albumname);
        td_album.classList.add("album-name");
        //create data for column track duration
        trackcontent = document.createTextNode(trackDuration(element.track.duration_ms));
        td_dur.appendChild(trackcontent);
        td_dur.classList.add("track-duration");
        //append everything to the row
        tr.appendChild(tdn);
        tr.appendChild(td_playStop);
        tr.appendChild(td_song);
        tr.appendChild(td_artist);
        tr.appendChild(td_album);
        tr.appendChild(td_dur);
        //add this to the table
        document.getElementById("playlist-table").appendChild(tr);
        playListCounter++;
    });
}

//Refresh Table of Playlist everytime you press a country on the map
function refreshTablePlayList() {
    let musicTable = document.getElementById("playlist-table");
    while (musicTable.firstChild) {
        musicTable.firstChild.remove();
    }
}
//convert track duraction which is in milliseconnds to minutes:seconds format like this => mm:ss
function trackDuration(milliseconds) {
    let minutes = Math.floor(milliseconds / 60000);
    let seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
}

//fetch image of top 50 playlist and display it
function displayPlayListImage(tagElement, musicList) {
    let playlistImage = document.getElementById(tagElement);
    playlistImage.childNodes[0].src = musicList.images[0].url;
}

const onSpotifyWebPlaybackSDKReady = () => {
    const token = spotifyKey;
    const player = new Spotify.Player({
        name: 'Kasra Tabrizi',
        getOAuthToken: cb => {
            cb(token);
        }
    });

    // Error handling
    player.addListener('initialization_error', ({
        message
    }) => {
        console.error(message);
    });
    player.addListener('authentication_error', ({
        message
    }) => {
        console.error(message);
    });
    player.addListener('account_error', ({
        message
    }) => {
        console.error(message);
    });
    player.addListener('playback_error', ({
        message
    }) => {
        console.error(message);
    });

    // Playback status updates
    player.addListener('player_state_changed', state => {
        console.log(state);
    });

    // Not Ready
    player.addListener('not_ready', ({
        device_id
    }) => {
        console.log('Device ID has gone offline', device_id);
    });
    ////////////////////////////////////////////////////////////////////////////////////////
    // Called when connected to the player created beforehand successfully
    player.addListener('ready', ({
        device_id
    }) => {
        console.log('Ready with Device ID', device_id);

        const play = ({
            spotify_uri,
            playerInstance: {
                _options: {
                    getOAuthToken,
                    id
                }
            }
        }) => {
            getOAuthToken(access_token => {
                fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        uris: [spotify_uri]
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    },
                });
            });
        };
        const pause = ({
            spotify_uri,
            playerInstance: {
                _options: {
                    getOAuthToken,
                    id
                }
            }
        }) => {
            getOAuthToken(access_token => {
                fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        uris: [spotify_uri]
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    },
                });
            });
        };

        //link the play and pause funcionality of spotify to the play and stop buttons
        linkPlayToButtons(player, play);
        linkStopToButtons(player, pause);

    });
    //////////////////////////////////////////////////////////////////////////////////////////
    // Connect to the player!
    player.connect();

};

function linkPlayToButtons(player, play) {
    let playButton = document.querySelectorAll(".playIcon");
    for (let i = 0; i < playButton.length; i++) {
        playButton[i].addEventListener('click', function() {
            document.getElementsByClassName("track-row")[i].style = "background-color: rgba(76, 175, 79, 0.5); font-weight: bold;";
            play({
                playerInstance: player,
                spotify_uri: `spotify:track:${playListId[i]}`,
            });
        });
    }
}

function linkStopToButtons(player, pause) {
    let stopButton = document.querySelectorAll(".stopIcon");
    for (let i = 0; i < stopButton.length; i++) {
        stopButton[i].addEventListener('click', function() {
            document.getElementsByClassName("track-row")[i].style = "background-color: none";
            pause({
                playerInstance: player,
                spotify_uri: `spotify:track:${playListId[i]}`,
            });
        });
    }
}