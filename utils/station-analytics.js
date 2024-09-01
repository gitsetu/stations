import { weatherStore } from "../models/weather-store.js";
import { weatherController } from "../controllers/weather-controller.js";
import { reportStore } from "../models/report-store.js";
import axios from "axios";

export const stationAnalytics = {
  async getLatestReport(station) {
    let latestReport = null;
    if (station.reports.length > 0) {
      // let latestReport = station.reports[0];
      latestReport = station.reports[0];
      for (let i = 0; i < station.reports.length; i++) {
        if (station.reports[i].timestamp > latestReport.timestamp) {
          // let latestReport = station.reports[i];
          latestReport = station.reports[i];
        }
      }
    }
    return latestReport;
  },

  async timeSince(timestamp) {
    let updatedSince = 0;
    if (timestamp) {
      // console.log("timestamp: " + timestamp);
      let timestampNow = Date.now();
      // Math.floor() used to discard decimals
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
      let elapsed = Math.floor((timestampNow - timestamp) /1000 /60); // elapsed time in minutes
      if (elapsed < 1) {
        updatedSince = "just now";
      } else if (elapsed < 60){
        updatedSince = elapsed + " minutes ago";
      } else if (elapsed < 120) {
        // updatedSince = Math.floor(elapsed / 60 ) + " hour ago";
        updatedSince = "in the last hour";
      } else if (elapsed < 1440) {
        updatedSince = Math.floor(elapsed / 60 ) + " hours ago";
      } else if (elapsed < 2880) {
        // updatedSince = Math.floor(elapsed / 60 / 24) + " day ago";
        updatedSince = "yesterday";
      }else if (elapsed > 2880) {
        updatedSince = Math.floor(elapsed / 60 / 24) + " days ago";
      } else {
        updatedSince = "unknown";
      }
    }
    // console.log("last report " + updatedSince);
    return updatedSince;
  },

  // TODO summary report
  async getSummary(station) {
    // initialise object javascript
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
    let summary = {};
    summary.numberOfReports = station.reports.length;
    if (station.reports.length > 0) {
      summary.maxTemperature = station.reports[0].temperature;
      summary.minTemperature = station.reports[0].temperature;

      summary.latestReportId = await this.getLatestReport(station);
      summary.temperature = summary.latestReportId.temperature;
      summary.pressure = summary.latestReportId.pressure;
      summary.windspeed = summary.latestReportId.windspeed;
      summary.winddegrees = summary.latestReportId.winddegrees;
      summary.windDirection = this.windDegreesToDirection(summary.winddegrees);

      if (summary.temperature > 29) {
        summary.temperatureAlert = "temperature-is-high";
      } else if (summary.temperature < 5) {
        summary.temperatureAlert = "temperature-is-low";
      } else {
        summary.temperatureAlert = "";
      }

      summary.maxWindSpeed = station.reports[0].windspeed;
      summary.minWindSpeed = station.reports[0].windspeed;

      if (summary.windspeed > 14) {
        summary.windalert = "wind-is-strong";
      } else {
        summary.windalert = "is-hidden";
      }

      summary.maxPressure = station.reports[0].pressure;
      summary.minPressure = station.reports[0].pressure;

      for (let i = 1; i < station.reports.length; i++) {
        if (station.reports[i].temperature > summary.maxTemperature) {
          summary.maxTemperature = station.reports[i].temperature;
        }
        if (station.reports[i].temperature < summary.minTemperature) {
          summary.minTemperature = station.reports[i].temperature;
        }
        if (station.reports[i].windspeed > summary.maxWindSpeed) {
          summary.maxWindSpeed = station.reports[i].windspeed;
        }
        if (station.reports[i].windspeed < summary.minWindSpeed) {
          summary.minWindSpeed = station.reports[i].windspeed;
        }
        if (station.reports[i].pressure > summary.maxPressure) {
          summary.maxPressure = station.reports[i].pressure;
        }
        if (station.reports[i].pressure < summary.minPressure) {
          summary.minPressure = station.reports[i].pressure;
        }
      }
    }
    return summary;
  },

  windDegreesToDirection (degrees) {
    let windDirection = "unknown"

    if (degrees <= 360) { // check input is valid
      const numberOfDirections = 16;
      const step = 360 / numberOfDirections;
      let steps = degrees / step;
      steps = Math.round(steps);

      switch (steps) {
        case 16: case 0:
          windDirection = "N";
          break;
        case 1 :
          windDirection = "N/NE";
          break;
        case 2 :
          windDirection = "NE";
          break;
        case 3 :
          windDirection = "E/NE";
          break;
        case 4 :
          windDirection = "E";
          break;
        case 5 :
          windDirection = "E/SE";
          break;
        case 6 :
          windDirection = "SE";
          break;
        case 7 :
          windDirection = "S/SE";
          break;
        case 8 :
          windDirection = "S";
        break;
        case 9 :
          windDirection = "S/SW";
          break;
        case 10 :
          windDirection = "SW";
          break;
        case 11 :
          windDirection = "W/SW";
          break;
        case 12 :
          windDirection = "W";
          break;
        case 13 :
          windDirection = "W/NW";
          break;
        case 14 :
          windDirection = "NW";
          break;
        case 15 :
          windDirection = "N/NW";
          break;
        default:
          windDirection = "unknown";
      }
    }

    // console.log("wind is coming from: "+ windDirection);
    return windDirection;
  },

  menuHide(page) {
  let menuHide = {};

  switch (page) {
    case "dashboard":
      menuHide =
        {
          buttonClassAddStation: "",
          buttonClassAddReport: "is-hidden",
          buttonClassLogout: "is-hidden",
        };
      break;
    case "station":
      menuHide =
        {
          buttonClassAddStation: "is-hidden",
          buttonClassAddReport: "",
          buttonClassLogout: "is-hidden",
        };
      break;
    case "account":
      menuHide =
        {
          buttonClassAddStation: "is-hidden",
          buttonClassAddReport: "is-hidden",
          buttonClassLogout: "",
        };
      break;
    case "about":
      menuHide =
        {
          buttonClassAddStation: "is-hidden",
          buttonClassAddReport: "is-hidden",
          buttonClassLogout: "is-hidden",
        };
      break;

    default:
      menuHide =
        {
          buttonClassAddStation: "is-hidden",
          buttonClassAddReport: "is-hidden",
          buttonClassLogout: "is-hidden",
        };
  }

  return menuHide;
},

  capitalizeFirstLetter(string) {
    // capitalize: https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
    // const stationName = station.stationname.charAt(0).toUpperCase() + station.stationname.slice(1); // capitalize
    return string && string.charAt(0).toUpperCase() + string.substring(1);
},

  async makeCards(station) {

    let cards = [];

    let numberOfReports = station.reports.length;
    const stationName = this.capitalizeFirstLetter(station.stationname);
    // console.log("makeCards - numberOfReports" + numberOfReports);
    if (numberOfReports > 0){
      let latestReport = await this.getLatestReport(station);
      // console.log("makeCards - latestReport: " + latestReport._id);
      const timeSinceLastReport = await this.timeSince(latestReport.timestamp);
      // console.log("makeCards - timeSinceLastReport: " + timeSinceLastReport);
      let summary = await this.getSummary(station);
      // console.log("makeCards - summary: " + summary.maxPressure);
      let weather = await weatherStore.getWeatherById(latestReport.weathercode);
      // console.log("makeCards - weather: " + weather.id);
      if (weather === undefined) {
        weather = {};
        weather.description = "no weather code match";
        weather.icon = "";
        weather.main = "-";
        weather.imageclass = "is-hidden"
        // console.log("makeCards - weather: " + weather.description);
      } else {
        // console.log("makeCards - weather is defined ");
      }

      const windDirection = this.windDegreesToDirection(latestReport.winddegrees);
      // console.log("makeCards - windDirection: " + windDirection);

      // to fit in card, reduce text size if name is more than 7 characters long
      let mainClassStationName = "";
      if ( station.stationname.length > 7) {
        mainClassStationName = "is-size-4";
        // console.log("makeCards - long station name");
      }

      // reduce text size to fit in card if weather is in the thunderstorm group
      let mainClass = "";
      if ( Math.floor(latestReport.weathercode / 100 ) === 2) {
        mainClass = "is-size-4";
      }

      // console.log("makeCards - station.latitude: " + station.latitude);
      cards = [
        {
          title: "",
          subtitle: summary.numberOfReports + " reports, updated " + timeSinceLastReport,
          image: "",
          imageclass: "is-hidden",
          heading: "station",
          main: stationName,
          mainClass: mainClassStationName,
          min: "lat " + station.latitude,
          max: "lon " + station.longitude,
        },
        {
          title: "",
          subtitle: "",
          image: "https://openweathermap.org/img/wn/"+ weather.icon +"@2x.png",
          imageclass: weather.imageclass,
          heading: "weather",
          main: weather.main,
          mainClass: mainClass,
          min: weather.description,
          max: "",
        },
        {
          title: "",
          subtitle: "Celsius",
          image: "",
          imageclass: "is-hidden",
          heading: "temperature",
          main: summary.temperature + "º",
          mainClass: "",
          min: "min " + summary.minTemperature + "º",
          max: "max " + summary.maxTemperature + "º",
        },
        {
          title: "-",
          subtitle: windDirection,
          image: "",
          imageclass: "is-hidden",
          heading: "wind",
          main: summary.windspeed + "m/s",
          mainClass: "",
          min: "min " + summary.minWindSpeed + "m/s",
          max: "max " + summary.maxWindSpeed + "m/s",
        },
        {
          title: "-",
          subtitle: "hPa",
          image: "",
          imageclass: "is-hidden",
          heading: "pressure",
          main: summary.pressure,
          mainClass: "",
          min: "min " + summary.minPressure,
          max: "max " + summary.maxPressure,
        }
      ];
      // console.log("makeCards - cards[0].main: " + cards[0].main);

    } else {
      cards = [];
    }
    return cards;
  },

  async map() {
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

    return map;
  },

  async addMarkers(station) {
    L.marker([station.latitude, station.longitude]).addTo(map)
      .bindPopup(station.stationname +'<br>'+ station.latitude + ', ' + station.longitude)
      .openPopup();
  },


  async getNameOfLocation(marker) {
    let formLatitude = marker.latitude;
    let formLongitude = marker.longitude;
    const placeNameRequestUrl = `http://api.openweathermap.org/data/2.5/forecast`
    const apikey = "0594495f7704f58a422c370f1c762c06";
    let requestUrl = placeNameRequestUrl + "?lat=" + formLatitude + "&lon=" + formLongitude + "&appid=" + apikey + "&units=metric";
    console.log("requestUrl" +requestUrl);
    let location;
    const result = await axios.get(requestUrl);

    // const result = await axios.get("http://api.openweathermap.org/data/2.5/forecast?lat=52.33&lon=-6.46&appid=0594495f7704f58a422c370f1c762c06&units=metric");
    // console.log("rendering get location name" + locationRequestUrl + formLatitude + formLongitude + apikey);
    if (result.status == 200) {
      const placeName = result.data;
      location.name = placeName.city.name;
      location.country = placeName.city.country;

      // document.getElementById("stationname").value = report.name;
      console.log("rendering get location name " + location.name);
    }
    console.log(location);
    return location;
  },

  // https://stackoverflow.com/questions/39880389/disable-button-until-fields-are-full-pure-js
  //-----
  async checkForm(){
    let formStationName = document.getElementById("stationname").value;
    let formLatitude = document.getElementById("latitude").value;
    let formLongitude = document.getElementById("longitude").value;
    let canSubmitStation = (formStationName.length > 1) && (formLatitude.length > 1) && (formLongitude.length > 1);
    document.getElementById("new-station").disabled = !canSubmitStation;
    // let canSubmitGetPlace = (formStationName.length < 1) && (formLatitude.length > 1) && (formLongitude.length > 1);
    // document.getElementById("get-place-name").disabled = !canSubmitGetPlace;
    let canSubmitGetCoordinates = (formStationName.length > 1) && (formLatitude.length < 1) && (formLongitude.length < 1);
    document.getElementById("get-coordinates").disabled = !canSubmitGetCoordinates;
    let canSubmitReset = (formStationName.length > 0) || (formLatitude.length > 0) || (formLongitude.length > 0);
    document.getElementById("formReset").disabled = !canSubmitReset;
    // ---------------------------------------------------------------------
  },

  async _getReadingWeatherNow(station) {
    const lat = station.latitude;
    let lon = station.longitude;
    const requestUrlWeatherNow = `http://api.openweathermap.org/data/2.5/weather`
    const apikey = "0594495f7704f58a422c370f1c762c06";
    let requestUrl = requestUrlWeatherNow + "?lat=" + lat + "&lon=" + lon + "&appid=" + apikey + "&units=metric";
    console.log("requestUrl: " +requestUrl);
    let report;
    const result = await axios.get(requestUrl);

    // const result = await axios.get("http://api.openweathermap.org/data/2.5/forecast?lat=52.33&lon=-6.46&appid=0594495f7704f58a422c370f1c762c06&units=metric");
    // console.log("rendering get location name" + locationRequestUrl + formLatitude + formLongitude + apikey);
    if (result.status == 200) {
      const weather = result.data;
      // report.weathercode = weather.id;
      report = weatherController.getWeather(weather.id);

      await reportStore.addReport(station.stationid, report);
      // document.getElementById("stationname").value = report.name;
      console.log("rendering get location name " + report.weathercode);
    }
    console.log(report);
    return report;
  },

  async addReading(request, response) {
    console.log("rendering new report");
    let report = {};
    const lat = request.body.lat;
    const lng = request.body.lng;
    const latLongRequestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=YOUR_API_KEY_HERE`;
    const result = await axios.get(latLongRequestUrl);
    console.log(latLongRequestUrl)
    if (result.status == 200) {
      const currentWeather = result.data;
      report.code = currentWeather.weather[0].id;
      report.temperature = currentWeather.main.temp;
      report.windSpeed = currentWeather.wind.speed;
      report.pressure = currentWeather.main.pressure;
      report.windDirection = currentWeather.wind.deg;
    }
    console.log(report);
    const viewData = {
      title: "Weather Report",
      reading: report,
    };
    response.render("dashboard-view", viewData);
  },

};
