export const defaultServerPort = 3005;

export const mongoConnectionUrls = {
  instagram: 'mongodb://localhost:27017/cdpInsta',
  twitter: 'mongodb://localhost:27017/cdpTweets'
};

export const collectionNames = {
  instagram: 'posts',
  twitter: 'tweets'
};

export const dataSources = [ 'instagram', 'twitter' ];