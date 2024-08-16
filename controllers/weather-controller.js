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
    console.log(`weather description for ${station.stationname} station`);
    // response.render("station-view", viewData);
    response.render("station-view", viewData);
  },

  async getWeather(station) {
    // await db.read();
    const latestReport = await stationAnalytics.getLatestReport(station);

    if (station.reports.length > 0) {
      let weatherCode = latestReport.weathercode;
      let weatherConditions = await weatherStore.getWeatherById(weatherCode);

      // console.log("getting weather conditions " + weatherConditions.main);
      console.log("getting weather description");
      return weatherConditions;

    } else {
      console.log("station does not have any report");
    }



  },


  async randomWeather() {
    // random
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    // await db.read();
    const allWeather = await weatherStore.getAllWeather();
    const weathersLength = allWeather.length;
    // console.log("getting weathersLength: " + weathersLength);
    const randomInt = Math.floor(Math.random() * weathersLength);
    // console.log("getting random int: " + randomInt);
    const randomWeather = allWeather[randomInt];
    let mainClass = "";
    if(Math.floor(randomWeather.id / 100) === 2) {
      mainClass = "is-size-4";
    }

    let randomCard = [
      {
        title: "",
        subtitle: randomWeather.description,
        image: "https://openweathermap.org/img/wn/"+ randomWeather.icon +"@2x.png",
        imageclass: "",
        heading: "weather",
        main: randomWeather.main,
        mainClass: mainClass,
        min: "random weather card",
        max: "",
      },
    ];

    console.log("getting random weather card: " + randomWeather.main);
    return randomCard;

  },




}