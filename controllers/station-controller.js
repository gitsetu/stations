import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { stationAnalytics } from "../utils/station-analytics.js";

export const stationController = {
  async index(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const shortestTrack = stationAnalytics.getShortestTrack(station);
    const viewData = {
      title: "Station",
      station: station,
      shortestTrack: shortestTrack,
    };
    response.render("station-view", viewData);
  },

  async addTrack(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const newTrack = {
      title: request.body.title,
      artist: request.body.artist,
      duration: Number(request.body.duration),
    };
    console.log(`adding report ${newTrack.title}`);
    await reportStore.addTrack(station._id, newTrack);
    response.redirect("/station/" + station._id);
  },

  async deleteTrack(request, response) {
    const stationId = request.params.stationid;
    const reportId = request.params.reportid;
    console.log(`Deleting Track ${reportId} from Station ${stationId}`);
    await reportStore.deleteTrack(request.params.reportId);
    response.redirect("/station/" + stationId);
  },
};
