import { getCountryName } from '../utils/countryCodes';
import { startTimer, stopTimer } from '../timer/timer';

export default class Geoloc {
  async initialization() {
    const response = await fetch('https://ipinfo.io/json?token=00e19059e33ce1');
    const inform = await response.json();
    window.localStorage.setItem('geolocationAPI', JSON.stringify(inform));
  }

  async addGeolocation() {
    await this.initialization();
    const geolocInform = JSON.parse(window.localStorage.getItem('geolocationAPI'));

    const country = document.querySelector('.geolocation__country-name');
    country.innerHTML = `${geolocInform.city}, ${getCountryName(geolocInform.country)}`;

    const date = new Date(Date.now());
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
