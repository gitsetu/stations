import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { reportStore } from "./report-store.js";
import { stationAnalytics } from "../utils/station-analytics.js";

const db = initStore("stations");

export const stationStore = {
  async getAllStations() {
    await db.read();
    return db.data.stations;
  },

  async addStation(station) {
    await db.read();
    station._id = v4();
    db.data.stations.push(station);
    await db.write();
    return station;
  },

  async getStationById(id) {
    // console.log("(station-store) get station with id: " + id);
    await db.read();
    let list = db.data.stations.find((station) => station._id === id);
    // console.log("(Station Store) list._id: " + list._id);
    list.reports = await reportStore.getReportsByStationId(list._id);
    return list;
  },

  async getStationsByUserId(userid) {
    await db.read();
    const userStations = db.data.stations.filter((station) => station.userid === userid);
    // TODO: sort alphabetically
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    // https://www.freecodecamp.org/news/how-to-sort-array-of-objects-by-property-name-in-javascript/
    const sortedStations = userStations.sort((a, b) => a.stationname.localeCompare(b.stationname));
    console.log("(station-store) stations sorted by name"); // sorted! :)

    return sortedStations;
  },

  async _getStationsByUserId(userid) {
    await db.read();
    return db.data.stations.filter((station) => station.userid === userid);
  },

  async deleteStationById(id) {
    await db.read();
    // delete all reports from station
    await reportStore.deleteAllReportsFromStation(id);
    //delete station
    const index = db.data.stations.findIndex((station) => station._id === id);
    db.data.stations.splice(index, 1);
    await db.write();
    console.log(`(station-store) deleting station ${id}`)
  },

};
