import { stationStore } from "../models/station-store.js";
import { accountsController } from "./accounts-controller.js";
import { stationController } from "./station-controller.js";
import { stationAnalytics } from "../utils/station-analytics.js";
import { reportStore } from "../models/report-store.js";
import { reportController } from "./report-controller.js";
import { weatherController } from "./weather-controller.js";
import { weatherStore } from "../models/weather-store.js";

export const dashboardController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const firstname = stationAnalytics.capitalizeFirstLetter(loggedInUser.firstname);

    let page = "dashboard";
    let menuHide = stationAnalytics.menuHide(page);
    // console.log("hiding menu buttons not used on: " + page);

    const stations = await stationStore.getStationsByUserId(loggedInUser._id);
    const numberOfStations= stations.length;
    const allReports = await reportStore.getAllReports();
    let numberOfReports = allReports.length;

    for (let i = 0; i < numberOfStations; i++) {
      let station = stations[i];
      // let stationid = stations[i]._id; // get station id

      // get reports for station[i]
      station.reports = await allReports.filter((report) => report.stationid === station._id);
      station.numberOfReports = station.reports.length;
      console.log("station: " + station.stationname + ", number of reports: " + station.numberOfReports);
      // if there are reports
      if (station.numberOfReports > 0) {
        // get the latest report added to station
        station.latestReportId = await station.reports[(station.reports.length)-1]._id;
        // console.log("latest report added: " + station.latestReportId);
        station.latestReportDatetime = await station.reports[(station.reports.length)-1].datetime;
        console.log("latest report datetime: " + station.latestReportDatetime);
        station.latestReportTimestamp = await station.reports[(station.reports.length)-1].timestamp;
        // console.log("latest report timestamp: " + station.latestReportTimestamp);
        station.latestReportWeathercode = await station.reports[(station.reports.length)-1].weathercode;
        console.log("latest report weather code: " + station.latestReportWeathercode);
        station.latestWeather = await weatherStore.getWeatherById(station.latestReportWeathercode);
        if (station.latestWeather === undefined){
          station.latestWeather = {
            "id": 0,
            "main": "?",
            "description": "[ weather code not found ]",
            "icon": ""
          };
          station.imageclass = "is-invisible";
        }
        console.log("station.latestWeather: " + station.latestWeather);
        // console.log("latest weather: " + station.latestWeather.description);

        station.classHidden = "";
        // end of - if there are reports
      } else {
        station.classHidden = "is-hidden";

      }

      // station.theLatestReport = await reportStore.getReportById(latestReportId);

      // get time since last report
      station.timeSinceLastReport = await stationAnalytics.timeSince(station.latestReportTimestamp);
      console.log("last report updated: " + station.timeSinceLastReport);

      // get weather summary
      station.summary = await stationAnalytics.getSummary(station);
      station.windDirectionCompass = stationAnalytics.windDegreesToDirection(station.summary.winddegrees);
      station.windarrow = station.summary.winddegrees - 90;
      console.log("wind direction compass: " + station.windDirectionCompass);
      station.latestTemperature = station.summary.temperature+"º"


      // let cards = stationAnalytics.makeCards(station);
      // station.cards = cards;

      // station.latestweather = await weatherStore.getWeatherById(station.latestReportWeathercode);
      // console.log("latest weather: " + station.latestweather);

      // let reportcode = await reportStore.getReportById(station.latestReportId);
      // station.latestweather = await weatherController.getWeather(reportcode);
      // console.log("latest weather: " + station.latestweather.description);

    } // for each station

    // const allReports = await reportController.index(request, response);
    // let cards = await stationAnalytics.getConditions(_id);
    // const latestReport = stationAnalytics.getLatestReport(request);
    const viewData = {
      // title: "Station Dashboard",
      page: "dashboard",
      menuHide: menuHide,
      title: "Weather Stations",
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
