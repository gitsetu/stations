import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("weathers");

export const weatherStore = {
  async getAllWeather() {
    await db.read();
    return db.data.weathers;
  },

  async getWeatherById(id) {
    await db.read();
    return db.data.weathers.find((weather) => weather.id === id);
  },

};