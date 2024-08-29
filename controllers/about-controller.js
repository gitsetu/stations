import { userStore } from "../models/user-store.js";
import { accountsController } from "./accounts-controller.js";
import { stationAnalytics } from "../utils/station-analytics.js";
import { weatherController } from "./weather-controller.js";
import { weatherStore } from "../models/weather-store.js";

export const aboutController = {
  async index(request, response) {

    let page = "about";
    let menuHide = stationAnalytics.menuHide(page);
    const weathers = await weatherStore.getAllWeather();
    const loggedInUser = await accountsController.getLoggedInUser(request);

    const viewData = {
      page: "about",
      title: "About WeatherTop",
      accountName: loggedInUser.firstname,
      menuHide: menuHide,
      weathers: weathers,
    };
    console.log("(about-controller) about rendering");
    response.render("about-view", viewData);
  },
};
