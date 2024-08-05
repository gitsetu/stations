export const stationAnalytics = {
  getLatestReport(station) {
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
  getSummaryReport(station) {
    let summaryReport = null;
    if (station.reports.length > 0) {
      summaryReport = station.reports[0];
      for (let i = 1; i < station.reports.length; i++) {
        if (station.reports[i].temperature > summaryReport.temperature) {
          summaryReport[temperature] = station.reports[i];
        }
      }
    }
    return summaryReport;
  },

};
