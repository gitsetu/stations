import { userStore } from "../models/user-store.js";
import { reportStore } from "../models/report-store.js";
import { stationStore } from "../models/station-store.js";
import { weatherController } from "./weather-controller.js";
import { stationAnalytics } from "../utils/station-analytics.js";
// import { stationStore } from "../models/station-store.js";

export const accountsController = {
  async index(request, response) {

    const randomWeatherList = await weatherController.randomWeather();
    const randomWeather = randomWeatherList[0];

    let accountName = "Account";
    const loggedInUser = await accountsController.getLoggedInUser(request);
    if (loggedInUser === undefined){
      let accountName = "Account";
      // response.redirect("/");
    } else {
      let accountName = loggedInUser.firstname;
    }

    const viewData = {
      page: "account",
      title: "Login or Signup",
      randomCard: randomWeather,
      accountName: accountName,
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("login-view", viewData);
  },

  logout(request, response) {
    response.cookie("station", "");
    console.log(`(accounts-controller) logged out`);
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("signup-view", viewData);
  },

  async register(request, response) {
    const newUser = request.body;
    const userExist = await userStore.getUserByEmail(request.body.email);
    if (userExist) {
      console.log(`(accounts-controller) user ${userExist.email} already exist`);
      response.redirect("/");
    } else {
      await userStore.addUser(newUser);
      console.log(`(accounts-controller) registering new user ${newUser.email}`);
      response.redirect("/");
    }
  },

  async _register(request, response) {
    const user = request.body;
    await userStore.addUser(user);
    console.log(`(accounts-controller) registering ${user.email}`);
    response.redirect("/");
  },

  async authenticate(request, response) {
    const user = await userStore.getUserByEmail(request.body.email);

    if (user) {
      const enteredPassword = request.body.password;
      const savedPassword = user.password;
      if (savedPassword === enteredPassword) {
        response.cookie("station", user.email);
        console.log(`(accounts-controller) logging in user ${user.email}`);
        response.redirect("/dashboard");
      } else {
        response.redirect("/login");
      }
    } else {
      response.redirect("/login");
    }
  },

  async getLoggedInUser(request) {
    const userEmail = request.cookies.station;
    return await userStore.getUserByEmail(userEmail);
  },

  async account(request, response) {
    // await db.read();
    const userEmail = request.cookies.station;
    // const userName = userStore.getUserByEmail(userEmail);
    const loggedInUser = await accountsController.getLoggedInUser(request);

    let page = "account";
    let menuHide = stationAnalytics.menuHide(page);

    console.log(`(accounts-controller) editing account ${loggedInUser._id}`);
    const viewData = {
      title: "Edit Account",
      user: await userStore.getUserByEmail(userEmail),
      // passes id, email and password to account-view
      accountName: loggedInUser.firstname,
      menuHide: menuHide,
    };

    response.render("account-view", viewData);
  },

  async update(request, response) {
    const userId = request.params.userid;
    // const userId = request.cookies.station;
    const user = await userStore.getUserById(userId);
    const updatedAccount = {
      firstname: request.body.firstname,
      lastname: request.body.lastname,
      email: request.body.email,
      password: request.body.password,
    };
    console.log(`accountsController: updating account ${user._id}`);
    await userStore.updateAccount(userId, updatedAccount);

    if (userId === updatedAccount.email){
      response.redirect("/account/");
    } else {
      // if username changes remove old cookie and create new cookie
      response.cookie("station", "");
      response.cookie("station", updatedAccount.email);
    }

    response.redirect("/account/");
    // response.render("account-view", viewData);
  },
};

