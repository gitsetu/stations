import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { stationStore } from "./station-store.js";

const db = initStore("reports");

export const reportStore = {
  async getAllReports() {
    await db.read();
    return db.data.reports;
  },

  async addReport(stationId, report) {
    await db.read();
    report._id = v4();
    report.stationid = stationId;
    db.data.reports.push(report);
    await db.write();
    return report;
  },

  async _addReport(stationId, report) {
    await db.read();
    report._id = v4();
    report.stationid = stationId;
    db.data.reports.push(report);
    await db.write();
    return report;
  },

  async getReportsByStationId(id) {
    await db.read();
    const stationReports = db.data.reports.filter((report) => report.stationid === id);
    // sort reports in descending order (most recent first)
    const sortedReports = this.sortByDate(stationReports);
    // console.log("reports sorted by most recent first");
    return sortedReports;
  },

  async _getReportsByStationId(id) {
    await db.read();
    return db.data.reports.filter((report) => report.stationid === id);
  },

  async getReportsByUserId(id) {
    await db.read();
    const stationReports = db.data.reports.filter((report) => report.stationid === id);
    // sort reports in descending order (most recent first)
    // const sortedReports = this.sortByDate(stationReports);
    // console.log("reports sorted by most recent first");
    return this.sortByDate(stationReports);
  },


  async sortByDate(reportsToSort){
    // sort reports in descending order (most recent first)
    const sortedReports = reportsToSort.sort((a, b) => b.timestamp - a.timestamp);
    console.log("reports sorted by most recent first");
    return sortedReports;
  },


  async getReportById(id) {
    await db.read();
    return db.data.reports.find((report) => report._id === id);
  },

  async deleteReport(id) {
    await db.read();
    const index = db.data.reports.findIndex((report) => report._id === id);
    db.data.reports.splice(index, 1);
    await db.write();
  },

  async deleteAllReports() {
    db.data.reports = [];
    await db.write();
  },

  // TODO delete all reports from station
  async deleteAllReportsFromStation(stationId) {
    await db.read();
    const stationReports = db.data.reports.filter((report) => report.stationid === stationId);
    for (let i = 0; i < stationReports.length; i++){
      await this.deleteReport(stationReports[i]._id);
    }
    await db.write();
    console.log(`deleting all reports from station ${stationId}`)
  },

  async _deleteAllReportsFromStation(stationId) {
    let index = await db.data.reports.stationid;
    index = [];
    await db.write();
    console.log(`deleting all reports from station ${stationId}`)
  },

  async updateReport(reportId, updatedReport) {
    const report = await this.getReportById(reportId);
    report.weathercode = updatedReport.weathercode;
    report.temperature = updatedReport.temperature;
    report.windspeed = updatedReport.windspeed;
    report.winddegrees = updatedReport.winddegrees;
    report.pressure = updatedReport.pressure;
    report.datetime = updatedReport.datetime;
    await db.write();

  },

};
