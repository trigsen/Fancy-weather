import Geoloc from './geolocation';

export default class Coordinate extends Geoloc {
  async initialization(place) {
    let response;
    if (!place) {
      await super.initialization();
      const geolocInform = JSON.parse(window.localStorage.getItem('geolocationAPI'));

      response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${geolocInform.city}&key=914e121a2d0e4667a13ded44b8be1b8f`);
    } else {
      response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${place}&key=914e121a2d0e4667a13ded44b8be1b8f`);
    }

    const inform = await response.json();
    window.localStorage.setItem('coordinateAPI', JSON.stringify(inform));
  }

  addCoordinate() {
    const inform = JSON.parse(window.localStorage.getItem('coordinateAPI'));
    this.latitude = inform.results[0].geometry.lat.toFixed(2).toString();
    this.longitude = inform.results[0].geometry.lng.toFixed(2).toString();

    document.querySelector('.latitude').innerHTML = `Latitude: ${this.latitude.slice(0, 2)}°${this.latitude.slice(3, 5)}'`;
    document.querySelector('.longitude').innerHTML = `Longitude: ${this.longitude.slice(0, 2)}°${this.longitude.slice(3, 5)}'`;
  }
}
