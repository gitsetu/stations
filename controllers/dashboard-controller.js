import { stationStore } from "../models/station-store.js";
import { accountsController } from "./accounts-controller.js";
import { stationController } from "./station-controller.js";
import { stationAnalytics } from "../utils/station-analytics.js";

export const dashboardController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);

    let page = "dashboard";
    let menuHide = stationAnalytics.menuHide(page);
    // console.log("menuHide: " + menuHide.buttonClassLogout);
    const summaryReport = null;
    let station = [];
    let cards = [];
    if (station && cards === undefined) {
      const summaryReport = await dashboardController.summaryReport(station);
      let cards = await stationAnalytics.getConditions(station);
    }

    // let cards = await stationAnalytics.getConditions(station);
    // const latestReport = stationAnalytics.getLatestReport(request);
    const viewData = {
      // title: "Station Dashboard",
      page: "dashboard",
      menuHide: menuHide,
      title: loggedInUser.firstname +"'s Weather Stations:",
      stations: await stationStore.getStationsByUserId(loggedInUser._id),
      firstname: loggedInUser.firstname,
      // latestReport: await stationAnalytics.getLatestReport(station),
      // latestReport: latestReport,
      // summary: summaryReport,
      // summary: summary,
      cards: cards,
    };
    console.log("dashboard rendering");
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
    // console.log(`Deleting Station ${stationId}`);
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
