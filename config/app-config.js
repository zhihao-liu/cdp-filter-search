module.exports = {
  serverPort: 3005,
  dataSources: ['instagram', 'twitter'],
  mongoConnectionUrls: {
    instagram: 'mongodb://localhost:27017/cdpInsta',
    twitter: 'mongodb://localhost:27017/cdpTweets'
  },
  collectionNames: {
    instagram: 'posts',
    twitter: 'tweets'
  },
  numConditions: 5,
  defaultResultLimit: 1000
};