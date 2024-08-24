import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { stationAnalytics } from "../utils/station-analytics.js";
import { weatherController } from "./weather-controller.js";
import { accountsController } from "./accounts-controller.js";

export const stationController = {
  async index(request, response) {
    let page = "station";
    let menuHide = stationAnalytics.menuHide(page);

    const loggedInUser = await accountsController.getLoggedInUser(request);
    // console.log("user logged in: " + loggedInUser.firstname);

    const station = await stationStore.getStationById(request.params.id);
    // const station = await stationStore.getStationById(request);
    // const station = request.params.id;
    console.log("(Station Controller) station name: " + station.stationname);
    const numberOfReportsInStation = station.reports.length;
    console.log("(Station Controller) number of reports in station: " + station.reports.length);


    let cards = stationAnalytics.makeCards(station);
    // let cards = await stationAnalytics.getConditions(station);
    // let cards = [];

    const viewData = {
      page: page,
      title: "Station",
      station: station,
      firstname: loggedInUser.firstname,
      menuHide: menuHide,
      // latestReport: latestReport,
      // summary: summary,
      // timeSinceLastReport: timeSinceLastReport,
      // weather: weatherConditions,
      cards: cards,
      numberOfReportsInStation: numberOfReportsInStation,
    };
    console.log(`showing reports for ${station.stationname} station`);
    console.log(`number of reports in station: ${numberOfReportsInStation}`);
    // response.render("dashboard-view", viewData);
    response.render("station-view", viewData);
  },

  async addReport(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const newReport = {
      weathercode: Number(request.body.weathercode),
      temperature: Number(request.body.temperature),
      windspeed: Number(request.body.windspeed),
      winddegrees: Number(request.body.winddegrees),
      pressure: Number(request.body.pressure),
      // datetime: request.body.datetime,
      // datetime: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
      datetime: Date().toString().substring(0,24), // human-readable date
      timestamp: Date.now(), // epoch date
    };
    console.log(`adding report ${newReport._id}`);
    await reportStore.addReport(station._id, newReport);
    response.redirect("/station/" + station._id);
  },

  async deleteReport(request, response) {
    const stationId = request.params.stationid;
    const reportId = request.params.reportid;
    console.log(`Deleting Report ${reportId} from Station ${stationId}`);
    // Original code in template with bug on delete track.
    // await reportStore.deleteReport(request.params.reportId);
    // Michael O'Driscoll provided a fix on Slack to delete the selected report.
    await reportStore.deleteReport(reportId);
    response.redirect("/station/" + stationId);
  },

};
