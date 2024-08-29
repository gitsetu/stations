import { stationStore } from "../models/station-store.js";
import { stationAnalytics } from "../utils/station-analytics.js";
import { weatherStore } from "../models/weather-store.js";
import { extraUtils } from "../utils/extra-utils.js";

export const weatherController = {

  async weather(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const latestReport = await stationAnalytics.getLatestReport(station);
    // const summary = await stationAnalytics.getSummary(station);
    // const timeSinceLastReport = await stationAnalytics.getTimeSinceLastReport(station);
    const weatherConditions = await weatherController.getWeather(station);

    const viewData = {
      title: "Station",
      // station: station,
      // latestReport: latestReport,
      // summary: summary,
      // timeSinceLastReport: timeSinceLastReport,
      weather: weatherConditions,
    };
    console.log(`(weather-controller) weather description for ${station.stationname} station`);
    // response.render("station-view", viewData);
    response.render("station-view", viewData);
  },

  async getWeather(report) {
      let weatherCode = await report.weathercode;
      let weatherConditions = await weatherStore.getWeatherById(weatherCode);

      // console.log("getting weather conditions " + weatherConditions.main);
      console.log("(weather-controller) getting weather info");
      return weatherConditions;
  },


  async randomWeather() {
    // random
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    // await db.read();
    const allWeather = await weatherStore.getAllWeather();
    const weathersLength = allWeather.length;
    const randomInt = Math.floor(Math.random() * weathersLength); // 0.0 - 1.0 * all
    const randomWeather = allWeather[randomInt];
    let mainClass = "";
    if(Math.floor(randomWeather.id / 100) === 2) { // thunderstorm group 2xx
      mainClass = "is-size-6 my-3"; // reduce text size for long words
    }

    let randomCard = [
      {
        title: "",
        subtitle: randomWeather.id,
        image: "https://openweathermap.org/img/wn/"+ randomWeather.icon +"@2x.png",
        imageclass: "",
        heading: "weather",
        main: randomWeather.main,
        mainClass: mainClass,
        min: randomWeather.description,
        max: "",
      },
    ];

    console.log("(weather-controller) getting random weather card: " + randomWeather.main);
    return randomCard;

  },




}