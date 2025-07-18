let map_Token = mapToken;

  mapboxgl.accessToken = map_Token;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: "mapbox://styles/mapbox/satellite-streets-v12",
center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
zoom: 11 // starting zoom
 });

 const marker1 = new mapboxgl.Marker({color: "red"})
.setLngLat(listing.geometry.coordinates)
.setPopup( new mapboxgl.Popup({offset: 25})
    .setHTML(`<h3>${listing.title}</h3>
      <p>Exact location will be provided after booking </p>`))
.addTo(map);

