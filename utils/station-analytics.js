export const stationAnalytics = {
  getShortestReport(station) {
    let shortestReport = null;
    if (station.reports.length > 0) {
      shortestReport = station.reports[0];
      for (let i = 1; i < station.reports.length; i++) {
        if (station.reports[i].duration < shortestReport.duration) {
          shortestReport = station.reports[i];
        }
      }
    }
    return shortestReport;
  },
};
