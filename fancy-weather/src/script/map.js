import Coordinate from './coordinate';
import { getCountryName } from './countryCodes';
import { transliterate } from './cityNames';
import { startTimer, stopTimer } from './timer';

export default class Map extends Coordinate {
  constructor() {
    super();
    this.timer = null;
  }

  async initialization(place = null) {
    await super.initialization(place);
    super.addCoordinate();

    mapboxgl.accessToken = 'pk.eyJ1IjoidHJpZ3NlbiIsImEiOiJjazQ1bnFoYjQwYWoyM2xwZ3IzbGhvaDB5In0.5sYgETwSdXYHLIdZyt1b_A';

    if (this.map) {
      this.map.remove();
    }

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.longitude, this.latitude],
      zoom: 10,
    });
  }

  async rewriteGeoloc(place = null) {
    await super.initialization(place);

    if (this.timer != null) {
      this.clearTimer();
    }

    const geolocInform = JSON.parse(window.localStorage.getItem('coordinateAPI'));

    let cityName = geolocInform.results[0].components.city;
    if (geolocInform.results[0].components.city === undefined) {
      cityName = geolocInform.results[0].components.state;
    }

    if (cityName.includes('область')) {
      cityName = geolocInform.results[0].components.county;
    }

    const country = document.querySelector('.geolocation__country-name');
    country.innerHTML = `${transliterate(cityName)}, ${getCountryName(geolocInform.results[0].components.country_code.toUpperCase())}`;

    const localTimezone = new Date().getTimezoneOffset() * 60;
    const locationTimezoneOffset = geolocInform.results[0].annotations.timezone.offset_sec;
    const timezoneOffset = locationTimezoneOffset - Math.abs(localTimezone);

    const date = new Date(new Date().getTime() + timezoneOffset * 1000);
    const month = date.toLocaleString('en-EN', { weekday: 'short', day: 'numeric', month: 'long' });
    const time = date.toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    document.querySelector('.date').innerHTML = month;
    document.querySelector('.time').innerHTML = time;
    this.timer = startTimer();
  }

  clearTimer() {
    stopTimer(this.timer);
  }
}
