import { stationStore } from "../models/station-store.js";
import { accountsController } from "./accounts-controller.js";
import { stationController } from "./station-controller.js";
import { stationAnalytics } from "../utils/station-analytics.js";
import { reportStore } from "../models/report-store.js";
import { reportController } from "./report-controller.js";

export const dashboardController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const firstname = stationAnalytics.capitalizeFirstLetter(loggedInUser.firstname);

    let page = "dashboard";
    let menuHide = stationAnalytics.menuHide(page);
    console.log("hiding menu buttons not used on: " + page);

    const stations = await stationStore.getStationsByUserId(loggedInUser._id);
    const numberOfStations= stations.length;
    const allReports = await reportStore.getAllReports();
    let numberOfReports = allReports.length;

    let reportsLatest = [];

    let latestReportId = "";
    for (let i = 0; i < numberOfStations; i++) {
      let stationid = stations[i]._id; // get station id

      // get reports by station id
      const stationReports = allReports.filter((report) => report.stationid === stationid);
      // get latest report of station
      if (stationReports.length > 0) {
        let latestReport = stationReports[0];
        for (let i = 1; i < stationReports.length; i++) {
          if (stationReports[i].timestamp > latestReport.timestamp) {
            let latestReport = stationReports[i];
            latestReportId = latestReport._id;
          }
        }
      } else {
        // station has no reports
        latestReportId = null;
      }
      stations[i].latestreportid = latestReportId;
      stations[i].stationreports = stationReports;
      // stations[i].cards = stationAnalytics.getConditions(stationid);
      // reportsLatest[i].stationid = stationid;

      console.log("reportsLatest latestReportId: " + latestReportId);
      // reportsLatest[i].reportid = stationAnalytics.getLatestReport(stations[i]);
      // reportsLatest[i].stationid = stations[i]._id;
      // stations[i]._id
      // console.log("reportsLatest reportid: " + reportsLatest[i].reportid + "stationid" + reportsLatest[i].stationid);
    }


    // const allReports = await reportController.index(request, response);

    // let cards = await stationAnalytics.getConditions(_id);
    // const latestReport = stationAnalytics.getLatestReport(request);
    const viewData = {
      // title: "Station Dashboard",
      page: "dashboard",
      menuHide: menuHide,
      title: firstname +"'s Weather Stations:",
      // stations: await stationStore.getStationsByUserId(loggedInUser._id),
      stations: stations,
      numberOfStations: numberOfStations,
      firstname: firstname,
      // latestReport: await stationAnalytics.getLatestReport(station),
      // latestReport: latestReport,
      // summary: summaryReport,
      // summary: summary,
      // cards: cards,
      reports: allReports,
      numberOfReports: numberOfReports,
      latestReportId: latestReportId,
    };
    console.log("dashboard rendering");
    console.log("number of stations: " + stations.length);
    console.log("total number of reports: " + allReports.length);
    response.render("dashboard-view", viewData);
  },



  async addStation(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const newStation = {
      stationname: request.body.stationname,
      latitude: request.body.latitude,
      longitude: request.body.longitude,
      userid: loggedInUser._id,
    };
    console.log(`adding station ${newStation.stationname}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },

  async deleteStation(request, response) {
    const stationId = request.params.id;
    console.log(`Deleting Station ${stationId}`);
    await stationStore.deleteStationById(stationId);
    response.redirect("/dashboard");
  },

  async _summaryReport(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const latestReport = await stationAnalytics.getLatestReport(station);
    const summary = await stationAnalytics.getSummary(station);
    const viewData = {
      title: "Station",
      station: station,
      latestReport: latestReport,
      summary: summary,
      // elapsed: (Date.now() - latestReport.timestamp) / 1000,
    };
    console.log(`showing reports for ${station.stationname} station`);
    response.render("dashboard-view", viewData);
  },

  async summaryReport(request, response) {
    // const loggedInUser = await accountsController.getLoggedInUser(request);
    const station = await stationStore.getStationById(request.params.id);
    const latestReport = await stationAnalytics.getLatestReport(station);
    const summaryReport = await stationAnalytics.getSummary(station);
    const timeSinceLastReport = await stationAnalytics.getTimeSinceLastReport(station);
    // const weather = await stationAnalytics.getWeather(station);
    const viewData = {
      title: "Station",
      station: station,
      latestReport: latestReport,
      summary: summaryReport,
      timeSinceLastReport: timeSinceLastReport,
      weather: weather,
      // loggedInUser: loggedInUser,
      // stations: await stationStore.getStationsByUserId(loggedInUser._id),
    };
    console.log(`summary reports for ${station.stationname} station`);
    response.render("station-view", viewData);
  },

};
