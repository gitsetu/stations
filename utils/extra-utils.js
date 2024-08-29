// import { stationAnalytics } from "./station-analytics";

import { v4 } from "uuid";
import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";

export const extraUtils = {

  ////////////////////
  // code to delete //

  // function orderByName(){
  // const ordered = objects.sort((a, b) => a.fieldname.localeCompare(b.fieldname));
  // return ordered
  // },

  async _deleteStationById(id) {
    await db.read();
    const index = db.data.stations.findIndex((station) => station._id === id);
    db.data.stations.splice(index, 1);
    await db.write();
  },

  async deleteAllStations() {
    db.data.stations = [];
    await db.write();
  },

  async _getStationById(id) {
    await db.read();
    const list = db.data.stations.find((station) => station._id === id);
    list.reports = await reportStore.getReportsByStationId(list._id);
    return list;
  },

  async deleteAllReports() {
    db.data.reports = [];
    await db.write();
  },

  async getReportsByUserId(id) {
    await db.read();
    const userStations = await stationStore.getStationsByUserId(id);
    // console.log("(report-store) - userStations: "+ userStations.length);
    let stationReports = [];
    for (let i=0; i < userStations.length; i++){
      stationReports[i] = await this.getReportsByStationId(userStations[i]._id);
      // console.log("(report-store) - stationReports: "+ stationReports.length);
    }

    // sort reports in descending order (most recent first)
    // const sortedReports = this.sortByDate(stationReports);
    // console.log("reports sorted by most recent first");
    return this.sortByDate(stationReports);
  },

  async _getReportsByUserId(id) {
    await db.read();
    const stationReports = db.data.reports.filter((report) => report.stationid === id);
    // sort reports in descending order (most recent first)
    // const sortedReports = this.sortByDate(stationReports);
    // console.log("reports sorted by most recent first");
    return this.sortByDate(stationReports);
  },

  async _addReport(stationId, report) {
    await db.read();
    report._id = v4();
    report.stationid = stationId;
    db.data.reports.push(report);
    await db.write();
    return report;
  },

  async _getReportsByStationId(id) {
    await db.read();
    return db.data.reports.filter((report) => report.stationid === id);
  },

  async _deleteAllReportsFromStation(stationId) {
    let index = await db.data.reports.stationid;
    index = [];
    await db.write();
    console.log(`(Report Store) deleting all reports from station ${stationId}`)
  },

  // datetime: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),

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

  // calculate Fahrenheit from Celsius; °C -> °F
  celsiusToFahrenheit(celsius) {
    const fahrenheit = (celsius * 1.8) + 32;
    return Math.round(fahrenheit); // reduce decimals
  }
  // ------------
  ////////////////////

}