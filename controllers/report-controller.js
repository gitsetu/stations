import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";
import { stationAnalytics } from "../utils/station-analytics.js";

export const reportController = {
  async index(request, response) {
    let page = "updateReport";
    let menuHide = stationAnalytics.menuHide(page);

    let firstname = "Account";
    const loggedInUser = await accountsController.getLoggedInUser(request);
    if (loggedInUser === undefined){
      let firstname = "Account";
    } else {
      let firstname = loggedInUser.firstname;
    }

    const stationId = request.params.stationid;
    const reportId = request.params.reportid;
    console.log(`Editing Report ${reportId} from Station ${stationId}`);
    const viewData = {
      title: "Edit Report",
      station: await stationStore.getStationById(stationId),
      report: await reportStore.getReportById(reportId),
      firstname: firstname,
      menuHide: menuHide,
      page: "updateReport",
    };
    response.render("report-view", viewData);
  },

  async update(request, response) {
    const stationId = request.params.stationid;
    const reportId = request.params.reportid;
    const updatedReport = {
      // datetime: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
      datetime: request.body.datetime,
      weathercode: Number(request.body.weathercode),
      temperature: Number(request.body.temperature),
      windspeed: Number(request.body.windspeed),
      winddegrees: Number(request.body.winddegrees),
      pressure: Number(request.body.pressure),
    };
    console.log(`Updating Report ${reportId} from Station ${stationId}`);
    await reportStore.updateReport(reportId, updatedReport);
    response.redirect("/station/" + stationId);
  },
};
