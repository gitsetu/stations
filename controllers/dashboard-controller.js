import { stationStore } from "../models/station-store.js";
import { accountsController } from "./accounts-controller.js";
import { stationController } from "./station-controller.js";
import { stationAnalytics } from "../utils/station-analytics.js";
import { reportStore } from "../models/report-store.js";
import { reportController } from "./report-controller.js";
import { weatherController } from "./weather-controller.js";
import { weatherStore } from "../models/weather-store.js";
import { userStore } from "../models/user-store.js";
import axios from "axios";

export const dashboardController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);

    let accountName = "Account";
    if (loggedInUser === undefined) {
      response.redirect("/");
    } else {
      accountName = await stationAnalytics.capitalizeFirstLetter(loggedInUser.firstname);
    }

    let page = "dashboard";
    let menuHide = stationAnalytics.menuHide(page);
    // console.log("hiding menu buttons not used on: " + page);

    const stations = await stationStore.getStationsByUserId(loggedInUser._id);
    const numberOfStations = stations.length;
    const allReports = await reportStore.getAllReports();
    let numberOfUserReports = 0;

    for (let i = 0; i < numberOfStations; i++) {
      let station = stations[i];

      // get reports for station[i]
      station.reports = await allReports.filter((report) => report.stationid === station._id);
      station.numberOfReports = station.reports.length;
      numberOfUserReports = numberOfUserReports + station.numberOfReports;
      // if there are reports
      if (station.numberOfReports > 0) {
        // get the latest report added to station
        station.latestReportId = await station.reports[(station.reports.length)-1]._id;
        station.latestReportDatetime = await station.reports[(station.reports.length)-1].datetime;
        station.latestReportTimestamp = await station.reports[(station.reports.length)-1].timestamp;
        station.latestReportWeathercode = await station.reports[(station.reports.length)-1].weathercode;
        station.latestWeather = await weatherStore.getWeatherById(station.latestReportWeathercode);
        if (station.latestWeather === undefined){
          station.latestWeather = {
            "id": 0,
            "main": "?",
            "description": "-- weather code not on the list --",
            "icon": ""
          };
          station.imageclass = "is-invisible";
        }
        // console.log("(Dashboard Controller) station.latestWeather: " + station.latestWeather);

        station.classHidden = "";
        // end of - if there are reports
      } else {
        station.classHidden = "is-hidden";
      }

      // get time since last report
      station.timeSinceLastReport = await stationAnalytics.timeSince(station.latestReportTimestamp);
      // console.log("(Dashboard Controller) station updated: " + station.timeSinceLastReport);

      // get weather summary
      station.summary = await stationAnalytics.getSummary(station);
      station.windDirectionCompass = stationAnalytics.windDegreesToDirection(station.summary.winddegrees);
      station.windarrow = station.summary.winddegrees - 90;
      station.latestTemperature = station.summary.temperature+"º"

    } // end for each station

    const viewData = {
      page: "dashboard",
      menuHide: menuHide,
      title: "Weather Stations",
      stations: stations,
      numberOfStations: numberOfStations,
      accountName: accountName,
      reports: allReports,
      numberOfReports: numberOfUserReports,
    };
    console.log("(dashboard-controller) dashboard rendering");
    // console.log("(dashboard-controller) number of stations: " + stations.length);
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
    console.log(`(dashboard-controller) adding station ${newStation.stationname}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },

  async deleteStation(request, response) {
    const stationId = request.params.id;
    console.log(`(dashboard-controller) deleting station ${stationId}`);
    await stationStore.deleteStationById(stationId);
    response.redirect("/dashboard");
  },

};
