let railsAssetImagePath;
// debugger;
// if (process.env.NODE_ENV === 'development') {
  railsAssetImagePath = filePath => `/assets/${filePath}`;
// }


// if (process.env.NODE_ENV === 'production') {
//   railsAssetImagePath = filePath => railsAssetHelper[filePath];
// }

export { railsAssetImagePath };
