import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { stationAnalytics } from "../utils/station-analytics.js";

export const stationController = {
  async index(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const latestReport = stationAnalytics.getLatestReport(station);
    const maxTemperatureReport = stationAnalytics.getMaxTemperatureReport(station);
    const minTemperatureReport = stationAnalytics.getMinTemperatureReport(station);
    const maxWindSpeedReport = stationAnalytics.getMaxWindSpeedReport(station);
    const minWindSpeedReport = stationAnalytics.getMinWindSpeedReport(station);
    const maxPressureReport = stationAnalytics.getMaxPressureReport(station);
    const minPressureReport = stationAnalytics.getMinPressureReport(station);
    // const extremeReport = stationAnalytics.getExtremeReport(station, weatherfield, extreme);
    const temperature = await station.temperature;
    const viewData = {
      title: "Station",
      station: station,
      latestReport: latestReport,
      maxTemperatureReport: maxTemperatureReport,
      minTemperatureReport: minTemperatureReport,
      maxWindSpeedReport: maxWindSpeedReport,
      minWindSpeedReport: minWindSpeedReport,
      maxPressureReport: maxPressureReport,
      minPressureReport: minPressureReport,
      temperature: temperature,

      // extremeReport: extremeReport,
      // weatherfield: weatherfield,
      // extreme: extreme,
    };
    response.render("station-view", viewData);
  },

  async addReport(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    // const dayRightNow = dayjs();
    // const dateNow = dayjs().format('dddd, h:mma');
    const newReport = {
      weathercode: Number(request.body.weathercode),
      temperature: Number(request.body.temperature),
      windspeed: Number(request.body.windspeed),
      winddirection: Number(request.body.winddirection),
      pressure: Number(request.body.pressure),
      datetime: request.body.datetime,
    };
    console.log(`adding report ${newReport._id}`);
    await reportStore.addReport(station._id, newReport);
    response.redirect("/station/" + station._id);
  },

  async deleteReport(request, response) {
    const stationId = request.params.stationid;
    const reportId = request.params.reportid;
    console.log(`Deleting Report ${reportId} from Station ${stationId}`);
    // await reportStore.deleteReport(request.params.reportId); // Original code in template with bub on delete track.
    // Michael O'Driscoll provided a fix on Slack to delete the selected report.
    await reportStore.deleteReport(reportId);
    response.redirect("/station/" + stationId);
  },
};
