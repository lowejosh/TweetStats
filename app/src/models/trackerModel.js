export const createTrackerModel = keyword => {
  console.log(`model for ${keyword} created`);
  return {
    tracking: keyword,
    tweetList: [],
    tweetCount: 0,
    languages: {},
    labels: {}
  };
};
