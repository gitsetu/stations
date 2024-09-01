import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { stationAnalytics } from "../utils/station-analytics.js";
import { weatherController } from "./weather-controller.js";
import { accountsController } from "./accounts-controller.js";
import axios from "axios";

export const stationController = {
  async index(request, response) {
    let page = "station";
    let menuHide = stationAnalytics.menuHide(page);

    const loggedInUser = await accountsController.getLoggedInUser(request);
    // console.log("user logged in: " + loggedInUser.firstname);
    let stationId = request.params.id;
    // console.log("(Station Controller) request.params.id: " + stationId);
    const station = await stationStore.getStationById(stationId);
    console.log("(station-controller) station name: " + station.stationname);

    const numberOfReportsInStation = station.reports.length;
    // console.log("(station-controller) number of reports in station: " + numberOfReportsInStation);

    let classReportsTable = "";
    if (numberOfReportsInStation < 1){
      classReportsTable = "is-hidden";
    }

    let cards = await stationAnalytics.makeCards(station);

    let forecast = await stationController.readForecast(request, response);
    // ----------------------------
    const viewData = {
      page: page,
      title: station.stationname + " Station Reports",
      station: station,
      accountName: loggedInUser.firstname,
      menuHide: menuHide,
      cards: cards,
      numberOfReportsInStation: numberOfReportsInStation,
      classReportsTable: classReportsTable,
      reading: forecast,
    };
    // console.log(`(Station Controller) number of reports in station: ${numberOfReportsInStation}`);
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
    console.log(`(station-controller) adding report ${newReport.datetime}`);
    await reportStore.addReport(station._id, newReport);
    response.redirect("/station/" + station._id);
  },

  async deleteReport(request, response) {
    const stationId = request.params.stationid;
    const reportId = request.params.reportid;
    console.log(`(station-controller) deleting report ${reportId} from Station ${stationId}`);
    // Original code in template with bug on delete track.
    // await reportStore.deleteReport(request.params.reportId);
    // Michael O'Driscoll provided a fix on Slack to delete the selected report.
    await reportStore.deleteReport(reportId);
    response.redirect("/station/" + stationId);
  },


  async addReading(request, response) {
    console.log("new reading");
    const station = await stationStore.getStationById(request.params.id);
    let report = {};
    const stationId = request.params.id;
    const lat = station.latitude;
    const lng = station.longitude;
    const apikey = "0594495f7704f58a422c370f1c762c06";
    const requestUrl = "https://api.openweathermap.org/data/2.5/weather";
    const latLongRequestUrl = `${requestUrl}?lat=${lat}&lon=${lng}&units=metric&appid=${apikey}`;
    const result = await axios.get(latLongRequestUrl);
    // console.log(latLongRequestUrl)
    if (result.status == 200) {
      const currentWeather = result.data;
      report.weathercode = currentWeather.weather[0].id;
      report.temperature = currentWeather.main.temp;
      report.windspeed = currentWeather.wind.speed;
      report.pressure = currentWeather.main.pressure;
      report.winddegrees = currentWeather.wind.deg;
      report.datetime = Date().toString().substring(0,24); // human-readable date
      report.timestamp = Date.now(); // epoch date
    }

    await reportStore.addReport(stationId, report);
    response.redirect("/station/" + stationId);
  },

  async readForecast(request, response) {
    console.log("forecast reading");
    const station = await stationStore.getStationById(request.params.id);
    let report = {};
    const stationId = request.params.id;
    const lat = station.latitude;
    const lng = station.longitude;
    const apikey = "0594495f7704f58a422c370f1c762c06";
    const requestUrl = "http://api.openweathermap.org/data/2.5/forecast";
    const latLongRequestUrl = `${requestUrl}?lat=${lat}&lon=${lng}&units=metric&appid=${apikey}`;
    const result = await axios.get(latLongRequestUrl);
    // console.log(latLongRequestUrl)
    if (result.status == 200) {
      // console.log(JSON.stringify(result.data, null, 2));
      report.tempTrend = [];
      report.trendLabels = [];
      const trends = result.data.list;
      for (let i=0; i<10; i++) {
        report.tempTrend.push(trends[i].main.temp);
        report.trendLabels.push(trends[i].dt_txt);
      }
      // console.log(report);

      // https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client
      // const viewData = {
      //   title: "Weather Report",
      //   reading: report,
      // };
      // response.render("station-view", viewData);

      return report;
    }
  },



}