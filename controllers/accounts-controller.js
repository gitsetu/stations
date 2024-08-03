import { userStore } from "../models/user-store.js";
import { reportStore } from "../models/report-store.js";
import { stationStore } from "../models/station-store.js";
// import { stationStore } from "../models/station-store.js";

export const accountsController = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup",
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
    const stationId = request.params.stationid;
    // await db.read();
    const userEmail = request.cookies.station;
    const user = await userStore.getUserByEmail(userEmail);

    console.log(`Editing Account ${user._id}`);
    const viewData = {
      title: "Edit Account",
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      userid: user._id,
      // email: await userStore.getUserById(userId),
    };
    response.render("account-view", viewData);
  },

  async update(request, response) {
    const stationId = request.params.stationid;
    const userEmail = request.cookies.station;
    const user = await userStore.getUserByEmail(userEmail);
    const updatedAccount = {
      firstname: request.body.firstname,
      lastname: request.body.lastname,
      email: request.body.email,
      password: request.body.password,
    };
    console.log(`Updating Account ${user._id}`);
    await userStore.updateAccount(userEmail, updatedAccount);
    response.redirect("/account/" + user._id);

    // response.render("account-view", viewData);
  },
};


// datetime: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),