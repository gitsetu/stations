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
    await db.read();
    const list = db.data.stations.find((station) => station._id === id);
    list.reports = await reportStore.getReportsByStationId(list._id);
    return list;
  },

  async _getStationById(id) {
    await db.read();
    const list = db.data.stations.find((station) => station._id === id);
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
    console.log("stations sorted by name"); // sorted! :)

    return sortedStations;
  },

  // function orderByName(){
  // const ordered = objects.sort((a, b) => a.fieldname.localeCompare(b.fieldname));
  // return ordered
  // },

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
    console.log(`deleting station ${id}`)
  },

  async _deleteStationById(id) {
    await db.read();
    const index = db.data.stations.findIndex((station) => station._id === id);
    db.data.stations.splice(index, 1);
    await db.write();
  },

  async deleteAllStations() {
    db.data.stations = [];
    await db.write();
  },


};
