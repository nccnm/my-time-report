const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
	entry: "./src/js/mytime/main.js",
	mode: "development",
	// devtool: "source-map",
	output: {
		path: path.resolve(__dirname, "dist/js/mytime"),
		filename: "main.js"
	},
	module: {
		rules: [{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }]
	},
	plugins: [
		new CopyWebpackPlugin([
			{ from: "src/js/background.js", to: path.resolve(__dirname, "dist/js") },
			{ from: "src/js/inject.js", to: path.resolve(__dirname, "dist/js") },
			{ from: "src/manifest.json", to: path.resolve(__dirname, "dist") },
			{ from: "src/css", to: path.resolve(__dirname, "dist/css") },
			{ from: "src/icons", to: path.resolve(__dirname, "dist/icons") }
		])
	],
	resolve: {
		alias: {
			vue$: "vue/dist/vue.esm.js" // 'vue/dist/vue.common.js' for webpack 1
		}
	}
};
