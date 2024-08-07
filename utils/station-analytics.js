import { weatherStore } from "../models/weather-store.js";

export const stationAnalytics = {
  async getLatestReport(station) {
    let latestReport = null;
    if (station.reports.length > 0) {
      latestReport = station.reports[0];
      for (let i = 1; i < station.reports.length; i++) {
        if (station.reports[i].timestamp > latestReport.timestamp) {
          latestReport = station.reports[i];
        }
      }
    }
    return latestReport;
  },

  async getTimeSinceLastReport(station) {
    // let elapsed = null;
    let updatedSince = 0;
    const latestReport = await stationAnalytics.getLatestReport(station);
    if (latestReport) {
      let latestReportTimestamp = await latestReport.timestamp;
      let timestampNow = Date.now();
      // Math.floor() used to discard decimals
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
      let elapsed = Math.floor((timestampNow - latestReportTimestamp) /1000 /60); // elapsed time in minutes
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
    console.log("last report " + updatedSince);
    return updatedSince;
  },




  async _getWeather(station) {
    let weather = {};
    const latestReport = await stationAnalytics.getLatestReport(station);
    let weatherCode = latestReport.weathercode;
    weather.id = weatherCode;

    if (weatherCode > 800) {
      weather.id = weatherCode;
    } else if (weatherCode === 800) {

    } else {
      weatherCode = Math.floor(weatherCode/100);

      switch (Math.floor(weatherCode/100)) {
        case 0 : case 1 :
          weatherCode = 0;
          break;
        case 2 :
          weatherCode = 200;
          break;
        case 3 :
          weatherCode = 300;
          break;
        case 51 : case 53 : case 55 : case 56 : case 57 :
          weatherCode = "drizzle";
          break;
        case 61 : case 63 : case 65 : case 66 : case 67 :
          weatherCode = "rain";
          break;
        case 71 : case 73 : case 75 : case 77 :
          weatherCode = "snow";
          break;
        case 80 : case 81 : case 82 : case 85 : case 86 :
          weatherCode = "showers";
          break;
        case 95 : case 96 : case 99 :
          weatherCode = "thunderstorm";
          break;
        default:
          weatherCode = "unknown";
      }


    }


    return weather;
  },


  // refactored
  // weatherfield: temperature, windspeed, pressure
  // extreme: min, max, latest
  getExtremeReport(station, weatherfield, extreme) {
    let extremeReport = null;
    if (station.reports.length > 0) {
      extremeReport = station.reports[0];
      for (let i = 1; i < station.reports.length; i++) {
        if (extreme === "min") {
          if (station.reports[i].weatherfield < extremeReport.weatherfield) {
            extremeReport = station.reports[i];
          }
        } else if (extreme === "max") {
          if (station.reports[i].weatherfield > extremeReport.weatherfield) {
            extremeReport = station.reports[i];
          }
        } else {
          if (station.reports.length.weatherfield > extremeReport.weatherfield) {
            extremeReport = station.reports[i];
          }
        }

      }
    }
    return extremeReport;
  },


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

  // TODO summary report
  async getSummary(station) {
    // initialise object javascript
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
    let summary = {};
    summary.numberOfReports = station.reports.length;
    if (station.reports.length > 0) {
      summary.maxTemperature = station.reports[0].temperature;
      summary.minTemperature = station.reports[0].temperature;
      summary.maxWindSpeed = station.reports[0].windspeed;
      summary.minWindSpeed = station.reports[0].windspeed;
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

};
