const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const { ModuleFederationPlugin } = require("webpack").container;
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const deps = require("./package.json").dependencies;

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
    mode: isDev ? "development" : "production",
    entry: "./src/index.tsx",
    devServer: {
        hot: true,
        static: {
            directory: path.join(__dirname, "dist")
        },
        port: 3002
    },
    target: "web",
    output: {
        path: path.resolve(__dirname, "dist"),
        // publicPath: "http://localhost:3002/",
        filename: "bundle.[fullhash].js",
        clean: true
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "container2",
            library: { type: "var", name: "container2" },
            filename: "remoteEntry.js",
            exposes: {
                "./App": "./src/App",
            },
            shared: { react: { requiredVersion: deps.react, singleton: true }, "react-dom": { requiredVersion: deps["react-dom"], singleton: true } },
            // shared: ["react", "react-dom"]
        }),
        new HTMLWebpackPlugin({
            template: "./src/index.html"
        }),
        isDev && new webpack.HotModuleReplacementPlugin(),
        isDev && new ReactRefreshWebpackPlugin()
    ],
    resolve: {
        modules: [__dirname, "src", "node_modules"],
        extensions: ["*", ".js", ".jsx", ".tsx", ".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$|tsx/,
                exclude: /node_modules/,
                loader: require.resolve("babel-loader"),
                options: {
                    plugins: [
                        isDev && require.resolve("react-refresh/babel")
                    ].filter(Boolean)
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.png|svg|jpg|gif$/,
                use: ["file-loader"],
            },
        ]
    }
}