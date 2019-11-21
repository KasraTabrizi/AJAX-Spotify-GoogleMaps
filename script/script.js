let countryID = ``;
let urlPlaylist = `https://api.spotify.com/v1/playlists/${countryID}`;
//const url = `https://api.spotify.com/v1/browse/featured-playlists?country=US&limit=2`;      
//const urlAuth = `https://accounts.spotify.com/authorize?client_id=edb6db7c1c604795b872fe40255d52fc&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1:5500`;
const spotifyKey = `BQC9MGgxpyeiIbKC1hTk8VxlsxVcxfDJV57hOD6tL7QNYAmn3ZFDrfqykTsfU4AhhBT_QeAQgRGSzGkepdKi-xnlGwEXv9wjvr-daIxS75Ihd2CeTQitd-66KtyKhvOrno1dSq-CRr20EfP2tB-h6qFbG78qoAnmGHXzy_Fwz2asgbALN1pWnxKiuoM0B-OUmN4_rVzRPKedPu9awHxP7P2RJUKRbZg7sBwxajisAA0GUoxbqwBn_NUpo3WUd6Nz-lt_k64uFtriug`;
const mapboxKey = `pk.eyJ1Ijoia2FzcmF0YWJyaXppIiwiYSI6ImNrMzdmNGxhbTBhdmkzbHFlNm4zNzM1MXIifQ.NTIDE9lmvt_g4IY_U2Rw6w`;

document.getElementById("button").addEventListener("click", () => {
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
        });

});

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
        });



});


function getCountryId(countryList, selectedCountry) {
    for (let i = 0; i < countryList.length; i++) {
        if (selectedCountry == countryList[i].country) {
            return countryList[i].id;
        }
    }
}