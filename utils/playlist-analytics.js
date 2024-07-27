export const playlistAnalytics = {
  getShortestTrack(playlist) {
    let shortestTrack = null;
    if (playlist.tracks.length > 0) {
      shortestTrack = playlist.tracks[0];
      for (let i = 1; i < playlist.tracks.length; i++) {
        if (playlist.tracks[i].duration < shortestTrack.duration) {
          shortestTrack = playlist.tracks[i];
        }
      }
    }
    return shortestTrack;
  },
};
