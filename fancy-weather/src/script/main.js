import Geoloc from './geolocation/geolocation';
import Weather from './weather/weather';
import Map from './map/map';
import Picture from './picture/picture';


(function initDoc() {
  const geo = new Geoloc();
  geo.addGeolocation();

  const map = new Map();
  map.initialization();

  const weather = new Weather();
  weather.addWeather();
  
  const picture = new Picture();
  picture.initialization();

  async function callEvent(value) {
    try {
      await weather.addWeather(value);
      await map.rewriteGeoloc(value);
      await map.initialization(value);
      geo.clearTimer();
    } catch (e) {

    }
  }

  document.querySelector('.search-menu__search-input').addEventListener('search', (e) => {
    callEvent(e.target.value);
  });

  document.querySelector('.search-menu__search-button').addEventListener('click', () => {
    const { value } = document.querySelector('.search-menu__search-input');
    callEvent(value);
  });

  document.querySelector('.control-buttons__degree-switcher').addEventListener('click', (e) => {
    if (!e.target.classList.contains('degree_unactive')
            || !e.target.classList.contains('degree')) {
      return;
    }

    if (e.target.classList.contains('farenheit')) {
      Weather.changeTemperature('cels');
      e.target.classList.remove('degree_unactive');
      document.querySelector('.cels').classList.add('degree_unactive');
    } else {
      Weather.changeTemperature('farenheit');
      e.target.classList.remove('degree_unactive');
      document.querySelector('.farenheit').classList.add('degree_unactive');
    }
  });

  document.querySelector('.control-buttons__refresh').addEventListener('click', () => {
    picture.initialization();
  });
}());
