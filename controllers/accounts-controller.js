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

    let firstname = "Account";
    const loggedInUser = await accountsController.getLoggedInUser(request);
    if (loggedInUser === undefined){
      let firstname = "Account";
    } else {
      let firstname = loggedInUser.firstname;
    }

    const viewData = {
      page: "account",
      title: "Login or Signup",
      randomCard: randomWeather,
      firstname: firstname,
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
    console.log(`logged out`);
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("signup-view", viewData);
  },

  async register(request, response) {
    const newuser = request.body;
    const userexist = await userStore.getUserByEmail(request.body.email);
    if (userexist) {
      console.log(`user ${userexist.email} already exist`);
      response.redirect("/");
    } else {
      await userStore.addUser(newuser);
      console.log(`registering new user ${newuser.email}`);
      response.redirect("/");
    }
  },

  async _register(request, response) {
    const user = request.body;
    await userStore.addUser(user);
    console.log(`registering ${user.email}`);
    response.redirect("/");
  },

  async authenticate(request, response) {
    // const stationId = request.params.stationid;
    const user = await userStore.getUserByEmail(request.body.email);

    if (user) {
      const enteredPassword = request.body.password;
      const savedPassword = user.password;
      if (savedPassword === enteredPassword) {
        response.cookie("station", user.email);
        console.log(`logging in user ${user.email}`);
        response.redirect("/dashboard");
      } else {
        response.redirect("/login");
      }
    } else {
      response.redirect("/login");
    }
  },

  async _authenticate(request, response) {
    const user = await userStore.getUserByEmail(request.body.email);
    if (user) {
      response.cookie("station", user.email);
      console.log(`logging in user ${user.email}`);
      response.redirect("/dashboard");
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

    console.log(`editing account ${loggedInUser._id}`);
    const viewData = {
      title: "Edit Account",
      user: await userStore.getUserByEmail(userEmail),
      // passes id, email and password to account-view
      firstname: loggedInUser.firstname,
      // lastname: user.lastname,
      // email: user.email,
      // userid: user._id,
      // email: await userStore.getUserById(userId),
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
    // response.redirect("/account/" + user._id);
    response.redirect("/account/");

    // response.render("account-view", viewData);
  },
};


// datetime: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),