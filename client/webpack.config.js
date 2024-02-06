const path = require("path")
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const htmlPlugin = new HtmlWebPackPlugin({
 template: "./public/index.html",
 filename: "./index.html",
 publicPath: "./"
});
module.exports = {
output: {
  path: path.resolve(__dirname, "dist"),
  filename: "bundle.js"
},
devServer: {
  historyApiFallback: true
},
stats: {
  errorDetails: true
},
resolve: {
  fallback: {
    "path": require.resolve("path-browserify"),
    "os": require.resolve("os-browserify/browser")
  }
} ,
mode: "development",
  module: {
    rules: [{
   test: /\.js$/,
   exclude: /node_modules/,
   use: {
     loader: "babel-loader"
   }
 },
  {
   test: /\.css$/,
   use: ["style-loader", "css-loader"]
  },
  {
    test: /\.js$/,
    enforce: "pre",
    use: ["source-map-loader"],
  }
]},
 plugins: [htmlPlugin, new CaseSensitivePathsPlugin()]
};