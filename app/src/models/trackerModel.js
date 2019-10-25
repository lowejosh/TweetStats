export const createTrackerModel = keyword => {
  return {
    tracking: keyword,
    tweetList: [],
    mediaCount: 0,
    tweetCount: 0,
    languages: {},
    labels: {}
  };
};
