import { weatherStore } from "../models/weather-store.js";
import { weatherController } from "../controllers/weather-controller.js";
import { reportStore } from "../models/report-store.js";

export const stationAnalytics = {
  async getLatestReport(station) {
    let latestReport = null;
    if (station.reports.length > 0) {
      // let latestReport = station.reports[0];
      latestReport = station.reports[0];
      for (let i = 1; i < station.reports.length; i++) {
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
      summary.temperature = station.reports[0].temperature;

      summary.maxWindSpeed = station.reports[0].windspeed;
      summary.minWindSpeed = station.reports[0].windspeed;
      summary.windspeed = station.reports[0].windspeed;
      summary.winddirection = station.reports[0].winddirection;

      summary.maxPressure = station.reports[0].pressure;
      summary.minPressure = station.reports[0].pressure;
      summary.pressure = station.reports[0].pressure;

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

  async getConditions(station) {

    // const loggedInUser = await accountsController.getLoggedInUser(request);
    // const userName = loggedInUser.firstname;
    // const weatherStation = await stationStore.getStationById(request.params.id);
    let report = await this.getLatestReport(station)

    let cards = [];

    // let reportsLength = station.reports.length;

    // console.log("reportsLength: " + reportsLength);

    // if (reportsLength > 0) {
      const timeSinceLastReport = await this.timeSince(report.timestamp);
      let summary = await this.getSummary(station);
      const weather = await weatherController.getWeather(report);
      const windDirection = stationAnalytics.windDegreesToDirection(summary.winddirection);

      // reduce text size to fit in card if weather is in the thunderstorm group
      let mainClass = "";
      if ( Math.floor(weather.id / 100 ) === 2) {
        mainClass = "is-size-4";
      // }

      // to fit in card, reduce text size if name is more than 7 characters long
      let mainClassStationName = "";
      if ( station.stationname.length > 7) {
        mainClassStationName = "is-size-4";
        console.log("long station name");
      }


      // capitalize: https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
      // const stationName = station.stationname.charAt(0).toUpperCase() + station.stationname.slice(1); // capitalize

      const stationName = this.capitalizeFirstLetter(station.stationname);

      cards = [
        {
          title: "",
          subtitle: summary.numberOfReports + " reports",
          image: "/icons/logo.hbs",
          imageclass: "is-hidden",
          heading: "station",
          main: stationName,
          mainClass: mainClassStationName,
          min: "Lat " + station.latitude,
          max: "Lon " + station.longitude,
        },
        {
          title: "",
          subtitle: weather.description,
          image: "https://openweathermap.org/img/wn/"+ weather.icon +"@2x.png",
          imageclass: "",
          heading: "weather",
          main: weather.main,
          mainClass: mainClass,
          min: "updated " + timeSinceLastReport,
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
          image: "image",
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
      ]

    } else {
      cards = [
        {
          title: "location",
          subtitle: "-",
          image: "https://openweathermap.org/img/wn/10d@2x.png",
          imageclass: "is-hidden",
          heading: "-",
          main: "-",
          mainClass: "",
          min: "-",
          max: "-",
        },
        {
          title: "temperature",
          subtitle: "-",
          image: "",
          imageclass: "is-hidden",
          heading: "-",
          main: "-",
          mainClass: "",
          min: "-",
          max: "-",
        },
        {
          title: "wind",
          subtitle: "-",
          image: "-",
          imageclass: "is-hidden",
          heading: "-",
          main: "-",
          mainClass: "",
          min: "-",
          max: "-",
        },
        {
          title: "pressure",
          subtitle: "-",
          image: "",
          imageclass: "is-hidden",
          heading: "-",
          main: "-",
          mainClass: "",
          min: "-",
          max: "-",
        }
      ]

    }
    return cards;
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


  async getCards(station) {

    // const loggedInUser = await accountsController.getLoggedInUser(request);
    // const userName = loggedInUser.firstname;
    // const weatherStation = await stationStore.getStationById(request.params.id);
    let report = await this.getLatestReport(station)

    let cards = [];

    // let reportsLength = station.reports.length;

    // console.log("reportsLength: " + reportsLength);

    // if (reportsLength > 0) {
    const timeSinceLastReport = await this.timeSince(report.timestamp);
    let summary = await this.getSummary(station);
    const weather = await weatherController.getWeather(report);
    const windDirection = stationAnalytics.windDegreesToDirection(summary.winddirection);

    // reduce text size to fit in card if weather is in the thunderstorm group
    let mainClass = "";
    if ( Math.floor(weather.id / 100 ) === 2) {
      mainClass = "is-size-4";
      // }

      // to fit in card, reduce text size if name is more than 7 characters long
      let mainClassStationName = "";
      if ( station.stationname.length > 7) {
        mainClassStationName = "is-size-4";
        console.log("long station name");
      }


      // capitalize: https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
      // const stationName = station.stationname.charAt(0).toUpperCase() + station.stationname.slice(1); // capitalize

      const stationName = this.capitalizeFirstLetter(station.stationname);

      cards = [
        {
          title: "",
          subtitle: summary.numberOfReports + " reports",
          image: "/icons/logo.hbs",
          imageclass: "is-hidden",
          heading: "station",
          main: stationName,
          mainClass: mainClassStationName,
          min: "Lat " + station.latitude,
          max: "Lon " + station.longitude,
        },
        {
          title: "",
          subtitle: weather.description,
          image: "https://openweathermap.org/img/wn/"+ weather.icon +"@2x.png",
          imageclass: "",
          heading: "weather",
          main: weather.main,
          mainClass: mainClass,
          min: "updated " + timeSinceLastReport,
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
          image: "image",
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
      ]

    } else {
      cards = [
        {
          title: "location",
          subtitle: "-",
          image: "https://openweathermap.org/img/wn/10d@2x.png",
          imageclass: "is-hidden",
          heading: "-",
          main: "-",
          mainClass: "",
          min: "-",
          max: "-",
        },
        {
          title: "temperature",
          subtitle: "-",
          image: "",
          imageclass: "is-hidden",
          heading: "-",
          main: "-",
          mainClass: "",
          min: "-",
          max: "-",
        },
        {
          title: "wind",
          subtitle: "-",
          image: "-",
          imageclass: "is-hidden",
          heading: "-",
          main: "-",
          mainClass: "",
          min: "-",
          max: "-",
        },
        {
          title: "pressure",
          subtitle: "-",
          image: "",
          imageclass: "is-hidden",
          heading: "-",
          main: "-",
          mainClass: "",
          min: "-",
          max: "-",
        }
      ]

    }
    return cards;
  },

  async makeCards(station) {

    // const loggedInUser = await accountsController.getLoggedInUser(request);
    // const userName = loggedInUser.firstname;
    // const weatherStation = await stationStore.getStationById(request.params.id);
    let report = await this.getLatestReport(station)

    let cards = [];

    // let reportsLength = station.reports.length;

    // console.log("reportsLength: " + reportsLength);

    // if (reportsLength > 0) {
    const timeSinceLastReport = station.timeSinceLastReport;
    let summary = station.summary;
    const weather = station.latestWeather;
    const windDirection = station.windDirectionCompass;

    // reduce text size to fit in card if weather is in the thunderstorm group
    let mainClass = "";
    if ( Math.floor(station.latestReportWeathercode / 100 ) === 2) {
      mainClass = "is-size-4";
      // }

      // to fit in card, reduce text size if name is more than 7 characters long
      let mainClassStationName = "";
      if ( station.stationname.length > 7) {
        mainClassStationName = "is-size-4";
        console.log("long station name");
      }


      // capitalize: https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
      // const stationName = station.stationname.charAt(0).toUpperCase() + station.stationname.slice(1); // capitalize

      const stationName = this.capitalizeFirstLetter(station.stationname);

      cards = [
        {
          title: "",
          subtitle: summary.numberOfReports + " reports",
          image: "/icons/logo.hbs",
          imageclass: "is-hidden",
          heading: "station",
          main: stationName,
          mainClass: mainClassStationName,
          min: "Lat " + station.latitude,
          max: "Lon " + station.longitude,
        },
        {
          title: "",
          subtitle: weather.description,
          image: "https://openweathermap.org/img/wn/"+ weather.icon +"@2x.png",
          imageclass: "",
          heading: "weather",
          main: weather.main,
          mainClass: mainClass,
          min: "updated " + timeSinceLastReport,
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
          image: "image",
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
      ]

    } else {
      cards = [
        {
          title: "location",
          subtitle: "-",
          image: "https://openweathermap.org/img/wn/10d@2x.png",
          imageclass: "is-hidden",
          heading: "-",
          main: "-",
          mainClass: "",
          min: "-",
          max: "-",
        },
        {
          title: "temperature",
          subtitle: "-",
          image: "",
          imageclass: "is-hidden",
          heading: "-",
          main: "-",
          mainClass: "",
          min: "-",
          max: "-",
        },
        {
          title: "wind",
          subtitle: "-",
          image: "-",
          imageclass: "is-hidden",
          heading: "-",
          main: "-",
          mainClass: "",
          min: "-",
          max: "-",
        },
        {
          title: "pressure",
          subtitle: "-",
          image: "",
          imageclass: "is-hidden",
          heading: "-",
          main: "-",
          mainClass: "",
          min: "-",
          max: "-",
        }
      ]

    }
    return cards;
  },




  ////////////////////
  // code to delete //
  getMaxTemperatureReport(station) {
    let maxTemperatureReport = null;
    if (station.reports.length > 0) {
      maxTemperatureReport = station.reports[0];
      for (let i = 1; i < station.reports.length; i++) {
        if (station.reports[i].temperature > maxTemperatureReport.temperature) {
          maxTemperatureReport = station.reports[i];
        }
      }
    }
    return maxTemperatureReport;
  },

  getMinTemperatureReport(station) {
    let minTemperatureReport = null;
    if (station.reports.length > 0) {
      minTemperatureReport = station.reports[0];
      for (let i = 1; i < station.reports.length; i++) {
        if (station.reports[i].temperature < minTemperatureReport.temperature) {
          minTemperatureReport = station.reports[i];
        }
      }
    }
    return minTemperatureReport;
  },

  getMaxWindSpeedReport(station) {
    let maxWindSpeedReport = null;
    if (station.reports.length > 0) {
      maxWindSpeedReport = station.reports[0];
      for (let i = 1; i < station.reports.length; i++) {
        if (station.reports[i].windspeed > maxWindSpeedReport.windspeed) {
          maxWindSpeedReport = station.reports[i];
        }
      }
    }
    return maxWindSpeedReport;
  },

  getMinWindSpeedReport(station) {
    let minWindSpeedReport = null;
    if (station.reports.length > 0) {
      minWindSpeedReport = station.reports[0];
      for (let i = 1; i < station.reports.length; i++) {
        if (station.reports[i].windspeed < minWindSpeedReport.windspeed) {
          minWindSpeedReport = station.reports[i];
        }
      }
    }
    return minWindSpeedReport;
  },

  getMaxPressureReport(station) {
    let maxPressureReport = null;
    if (station.reports.length > 0) {
      maxPressureReport = station.reports[0];
      for (let i = 1; i < station.reports.length; i++) {
        if (station.reports[i].temperature < maxPressureReport.temperature) {
          maxPressureReport = station.reports[i];
        }
      }
    }
    return maxPressureReport;
  },

  getMinPressureReport(station) {
    let minPressureReport = null;
    if (station.reports.length > 0) {
      minPressureReport = station.reports[0];
      for (let i = 1; i < station.reports.length; i++) {
        if (station.reports[i].temperature > minPressureReport.temperature) {
          minPressureReport = station.reports[i];
        }
      }
    }
    return minPressureReport;
  },

  ////////////////////

};
