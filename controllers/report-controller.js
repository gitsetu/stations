import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";
import { stationAnalytics } from "../utils/station-analytics.js";

export const reportController = {
  async index(request, response) {
    let page = "updateReport";
    let menuHide = stationAnalytics.menuHide(page);


    const loggedInUser = await accountsController.getLoggedInUser(request);
    let accountName = loggedInUser.firstname;
    if (loggedInUser === undefined){
      let accountName = "Account";
    } else {
      let accountName = loggedInUser.firstname;
    }

    const stationId = request.params.stationid;
    const reportId = request.params.reportid;
    console.log(`(report-controller) editing report ${reportId} from station ${stationId}`);
    const viewData = {
      title: "Edit Report",
      station: await stationStore.getStationById(stationId),
      report: await reportStore.getReportById(reportId),
      accountName: accountName,
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
    console.log(`(report-controller) updating report ${reportId} from station ${stationId}`);
    await reportStore.updateReport(reportId, updatedReport);
    response.redirect("/station/" + stationId);
  },
};
