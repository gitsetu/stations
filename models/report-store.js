import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("reports");

export const reportStore = {
  async getAllTracks() {
    await db.read();
    return db.data.reports;
  },

  async addTrack(stationId, report) {
    await db.read();
    report._id = v4();
    report.stationid = stationId;
    db.data.reports.push(report);
    await db.write();
    return report;
  },

  async getTracksByStationId(id) {
    await db.read();
    return db.data.reports.filter((report) => report.stationid === id);
  },

  async getTrackById(id) {
    await db.read();
    return db.data.reports.find((report) => report._id === id);
  },

  async deleteTrack(id) {
    await db.read();
    const index = db.data.reports.findIndex((report) => report._id === id);
    db.data.reports.splice(index, 1);
    await db.write();
  },

  async deleteAllTracks() {
    db.data.reports = [];
    await db.write();
  },

  async updateTrack(reportId, updatedTrack) {
    const report = await this.getTrackById(reportId);
    report.title = updatedTrack.title;
    report.artist = updatedTrack.artist;
    report.duration = updatedTrack.duration;
    await db.write();
  },
};
