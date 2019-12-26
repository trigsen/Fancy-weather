import Coordinate from './coordinate';

export default class Weather extends Coordinate {
  async initialization(place = null) {
    await super.initialization(place);

    const geolocationInform = JSON.parse(window.localStorage.getItem('coordinateAPI'));

    let cityName = geolocationInform.results[0].components.city;
    if (cityName === undefined) {
      cityName = geolocationInform.results[0].components.state;

      if (cityName.includes('область')) {
        cityName = geolocationInform.results[0].components.county;
      }
    }

    try {
      let response;
      if (!place) {
        response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&lang=en&units=metric&APPID=80b6e15849682d94ed9da21729aa095e`);
      } else {
        response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&lang=en&units=metric&APPID=80b6e15849682d94ed9da21729aa095e`);
      }
      const inform = await response.json();
      window.localStorage.setItem('weatherAPI', JSON.stringify(inform));
    } catch (e) {

    }
  }

  async addWeather(place = null) {
    await this.initialization(place);
    const weatherInform = JSON.parse(window.localStorage.getItem('weatherAPI'));

    function weatherInformFactory(index) {
      const weatherInfList = weatherInform.list[index];
      return {
        temperature: Math.round(weatherInfList.main.temp),
        apparentTemp: weatherInfList.main.feels_like,
        windSpeed: weatherInfList.wind.speed,
        humidity: weatherInfList.main.humidity,
        averageTemp: ((weatherInfList.main.temp_max + weatherInfList.main.temp_min) / 2).toFixed(2),
        imageLink: `http://openweathermap.org/img/wn/${weatherInfList.weather[0].icon}@2x.png`,
        dayName: weatherInfList.dt_txt,
        weatherStatus: weatherInfList.weather[0].description,
      };
    }

    function writeInImage(weatherInfObj, selector) {
      while (document.querySelector(`${selector}Img`).firstChild) {
        document.querySelector(`${selector}Img`).removeChild(document.querySelector(`${selector}Img`).firstChild);
      }

      const image = new Image();
      image.src = weatherInfObj.imageLink;
      image.onload = function loadImage() {
        document.querySelector(`${selector}Img`).appendChild(image);
      };
    }

    function writeInOtherDays(weatherInfObj, selector) {
      document.querySelector(`${selector}Temp`).innerHTML = weatherInfObj.temperature;
      writeInImage(weatherInfObj, selector);

      const date = new Date(weatherInfObj.dayName);
      document.querySelector(`${selector}Header`).innerHTML = date.toLocaleString('en-EN', { weekday: 'long' });
    }

    const firstDayWeather = weatherInformFactory(0);
    const secondDayWeather = weatherInformFactory(10);
    const thirdDayWeather = weatherInformFactory(20);
    const fourthDayWeather = weatherInformFactory(30);

    writeInOtherDays(secondDayWeather, '.secondDay');
    writeInOtherDays(thirdDayWeather, '.thirdDay');
    writeInOtherDays(fourthDayWeather, '.fourthDay');

    writeInImage(firstDayWeather, '.firstDay');
    document.querySelector('.feels-like').innerHTML = `FEELS LIKE: ${firstDayWeather.apparentTemp}`;
    document.querySelector('.wind').innerHTML = `WIND: ${firstDayWeather.windSpeed} m/s`;
    document.querySelector('.humidity').innerHTML = `HUMIDITY: ${firstDayWeather.humidity} %`;
    document.querySelector('.averTemp').innerHTML = `Average temp: ${firstDayWeather.averageTemp}`;
    document.querySelector('.present-day-weather__degree').innerHTML = firstDayWeather.temperature;
    document.querySelector('.weather-status').innerHTML = `Weather: ${firstDayWeather.weatherStatus}`;

    if (document.querySelector('.degree_unactive').classList.contains('cels')) {
      this.changeTemperature('cels');
    }
  }

  static changeTemperature(type) {
    function celsToFar(string) {
      return ((parseInt(string, 10) * 9) / 5) + 32;
    }

    function farToCels(string) {
      return ((parseInt(string, 10) - 32) * 5) / 9;
    }

    if (type === 'cels') {
      document.querySelector('.present-day-weather__degree').innerHTML = celsToFar(document.querySelector('.present-day-weather__degree').innerHTML).toFixed(0);

      document.querySelector('.feels-like').innerHTML = `FEELS LIKE: ${celsToFar(document.querySelector('.feels-like').innerHTML.split(' ')[2]).toFixed(2)}`;

      document.querySelector('.averTemp').innerHTML = `AVERAGE TEMP: ${celsToFar(document.querySelector('.averTemp').innerHTML.split(' ')[2]).toFixed(2)}`;

      Array.from(document.querySelectorAll('.other-days-weather__inform-degree')).forEach((e) => {
        e.innerHTML = celsToFar(e.innerHTML).toFixed(0);
      });
    }

    if (type === 'farenheit') {
      document.querySelector('.present-day-weather__degree').innerHTML = farToCels(document.querySelector('.present-day-weather__degree').innerHTML).toFixed(0);

      document.querySelector('.feels-like').innerHTML = `FEELS LIKE: ${farToCels(document.querySelector('.feels-like').innerHTML.split(' ')[2]).toFixed(2)}`;

      document.querySelector('.averTemp').innerHTML = `AVERAGE TEMP: ${farToCels(document.querySelector('.averTemp').innerHTML.split(' ')[2]).toFixed(2)}`;

      Array.from(document.querySelectorAll('.other-days-weather__inform-degree')).forEach((e) => {
        e.innerHTML = farToCels(e.innerHTML).toFixed(0);
      });
    }
  }
}
