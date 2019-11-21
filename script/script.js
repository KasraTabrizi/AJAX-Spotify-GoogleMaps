let countryID = ``;
let urlPlaylist = `https://api.spotify.com/v1/playlists/${countryID}`;
const spotifyKey = `BQDxztLljgrSC1ADQyt0Gns_YTdqTDstTBVXg1O2LNcMO6t952HUsQ1Bxy0wBNDyI-PmJ9hhBAbzlSBzsvX_dJnZB44D4WG0n7A2ZoCJwtPGfXRmWv29-Cbxd7Qm6A5QOtofOCZHUU8RIaAwSuSGp_39WqR7WV12LcU`;
const mapboxKey = `pk.eyJ1Ijoia2FzcmF0YWJyaXppIiwiYSI6ImNrMzdmNGxhbTBhdmkzbHFlNm4zNzM1MXIifQ.NTIDE9lmvt_g4IY_U2Rw6w`;

window.onSpotifyWebPlaybackSDKReady = () => {
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
        document.getElementById("buttonPlay").addEventListener("click", () => {
            play({
                playerInstance: player,
                spotify_uri: 'spotify:track:1rgnBhdG2JDFTbYkYRZAku',
            });

        });
        document.getElementById("buttonStop").addEventListener("click", () => {
            pause({
                playerInstance: player,
                spotify_uri: 'spotify:track:1rgnBhdG2JDFTbYkYRZAku',
            });

        });

    });
    //////////////////////////////////////////////////////////////////////////////////////////
    // Connect to the player!
    player.connect();

};

mapboxgl.accessToken = mapboxKey;
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [0, 40], // starting position
    zoom: 2 // starting zoom
});

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
//it will show the country you have clicked on the map
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
            console.log(musicList);

            //Get image of the playlist
            console.log(musicList.images[0].url);
            //show all 50 tracks
            const allTracks = musicList.tracks.items;
            allTracks.forEach(element => {
                // //get track name
                // console.log(element.track.name);
                // //get album name
                // console.log(element.track.album.name);
                // //get artist name
                // console.log(element.track.album.artists[0].name);
                // //get track id
                // console.log(element.track.album.id);
                // //get track duration
                // console.log(element.track.duration_ms);

                //add first row with three colums
                let tr = document.createElement("TR");
                let td1 = document.createElement("TD");
                let td2 = document.createElement("TD");
                let td3 = document.createElement("TD");
                let playIcon = document.createElement("img");
                playIcon.src = "https://img.icons8.com/material-rounded/24/000000/play.png";
                let stopIcon = document.createElement("img");
                stopIcon.src = "https://img.icons8.com/material-rounded/24/000000/stop.png";
                // let trackcontent = document.createTextNode(`play stop images`);
                // td1.appendChild(trackcontent);
                td1.appendChild(playIcon);
                td1.appendChild(stopIcon);
                td1.classList.add("playstop-button");
                trackcontent = document.createTextNode(element.track.name);
                td2.appendChild(trackcontent);
                td2.classList.add("track-title");
                trackcontent = document.createTextNode(element.track.duration_ms);
                td3.appendChild(trackcontent);
                td3.classList.add("track-duration");
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                document.getElementById("playlist-table").appendChild(tr);

                //add second row with three colums
                let tr1 = document.createElement("TR");
                td1 = document.createElement("TD");
                td2 = document.createElement("TD");
                td3 = document.createElement("TD");
                trackcontent = document.createTextNode(` `);
                td1.appendChild(trackcontent);
                trackcontent = document.createTextNode(`${element.track.album.artists[0].name} - ${element.track.album.name}`);
                td2.appendChild(trackcontent);
                td2.classList.add("artist-name");
                trackcontent = document.createTextNode(` `);
                td3.appendChild(trackcontent);
                tr1.appendChild(td1);
                tr1.appendChild(td2);
                tr1.appendChild(td3);
                document.getElementById("playlist-table").appendChild(tr1);
            });
        });
});

//return the country spotify ID by passing the countrylist array and the selected country fetched from the mapbox API
function getCountryId(countryList, selectedCountry) {
    for (let i = 0; i < countryList.length; i++) {
        if (selectedCountry == countryList[i].country) {
            return countryList[i].id;
        }
    }
}

//function that creates a table for the playlist with the track name, artist name, duration, play and pause button.
function createPlaylistTable() {

}

// function wrapTitle(tagName, className, content) {

// }

function refreshTablePlayList() {
    let musicTable = document.getElementById("playlist-table");
    while (musicTable.firstChild) {
        musicTable.firstChild.remove();
    }
}