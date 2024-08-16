import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { stationAnalytics } from "../utils/station-analytics.js";
import { weatherController } from "./weather-controller.js";
import { accountsController } from "./accounts-controller.js";

export const stationController = {
  async index(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const latestReport = await stationAnalytics.getLatestReport(station);
    const summary = await stationAnalytics.getSummary(station);
    const timeSinceLastReport = await stationAnalytics.getTimeSinceLastReport(station);
    const weatherConditions = await weatherController.getWeather(station);

    let page = "station";
    let menuHide = stationAnalytics.menuHide(page);

    // let reports = reportStore.getReportsByStationId(station);
    let reportsLength = await summary.numberOfReports;
    console.log("number of reports: " + reportsLength);
    let cards = [];
    if (station.reports.length > 0) {
      weatherConditions.winddirection = await stationAnalytics.windDegreesToDirection(latestReport.winddirection);
      let cards = await stationAnalytics.getConditions(station);
    }
    // let cards = await stationAnalytics.getConditions(station);

    const viewData = {
      page: page,
      title: "Station",
      station: station,
      firstname: loggedInUser.firstname,
      latestReport: latestReport,
      summary: summary,
      timeSinceLastReport: timeSinceLastReport,
      weather: weatherConditions,
      cards: cards,
      menuHide: menuHide,
    };
    console.log(`showing reports for ${station.stationname} station`);
    // response.render("dashboard-view", viewData);
    response.render("station-view", viewData);
  },

  async addReport(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const newReport = {
      weathercode: Number(request.body.weathercode),
      temperature: Number(request.body.temperature),
      windspeed: Number(request.body.windspeed),
      winddirection: Number(request.body.winddirection),
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
