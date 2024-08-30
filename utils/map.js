// config map
let config = {
  minZoom: 5,
  maxZoom: 14,
};
// magnification at start
const zoom = 6;
// center the map view at coordinates
const lat = 53.35;
const lon = -6.26;

// create a map in the 'map' div
const map = L.map('map', config).setView([lat, lon], zoom);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);