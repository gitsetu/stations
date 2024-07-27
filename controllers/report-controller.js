import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";

export const reportController = {
  async index(request, response) {
    const stationId = request.params.stationid;
    const reportId = request.params.reportid;
    console.log(`Editing Track ${reportId} from Station ${stationId}`);
    const viewData = {
      title: "Edit Song",
      station: await stationStore.getStationById(stationId),
      report: await reportStore.getTrackById(reportId),
    };
    response.render("report-view", viewData);
  },

  async update(request, response) {
    const stationId = request.params.stationid;
    const reportId = request.params.reportid;
    const updatedTrack = {
      title: request.body.title,
      artist: request.body.artist,
      duration: Number(request.body.duration),
    };
    console.log(`Updating Track ${reportId} from Station ${stationId}`);
    await reportStore.updateTrack(reportId, updatedTrack);
    response.redirect("/station/" + stationId);
  },
};
