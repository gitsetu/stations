export const aboutController = {
  index(request, response) {
    const viewData = {
      title: "About Station",
    };
    console.log("about rendering");
    const timestamp = Date.toLocaleString();
    const dateint = Intl.DateTimeFormat;
    const customdatetime = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
    console.log(customdatetime);
    response.render("about-view", viewData);
  },
};
