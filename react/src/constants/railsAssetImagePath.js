let railsAssetImagePath;
// if (process.env.NODE_ENV === 'development') {
  railsAssetImagePath = filePath => `/assets/${filePath}`;
// }

// Because we may not be able to access our static assets very well in production,
 // I've been trying to get this working, but it is currently incomplete.

 // Alternatively, we could use carrierwave and store the images in the database (since they will be unique for each user)
 // and then just refer to S3 links. This would be the most ideal method most likely. 

// if (process.env.NODE_ENV === 'production') {
//   railsAssetImagePath = filePath => railsAssetHelper[filePath];
// }

export { railsAssetImagePath };
