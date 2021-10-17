const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const { ModuleFederationPlugin } = require("webpack").container;
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const deps = require("./package.json").dependencies;

module.exports = {
    mode: "development",
    entry: "./src/index.tsx",
    devServer: {
        hot: true
    },
    target: "web",
    output: {
        path: path.resolve(__dirname, "dist"),
        // publicPath: "http://localhost:8080/",
        filename: "bundle.[fullhash].js",
        clean: true
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "container_1",
            filename: "remoteEntry.js",
            remotes: {
                "container2": `container2@${getRemoteEntryUrl(3002)}`,
            },
            shared: { react: { requiredVersion: deps.react, singleton: true }, "react-dom": { requiredVersion: deps["react-dom"], singleton: true } },
            // shared: ["react", "react-dom"]
        }),
        new HTMLWebpackPlugin({
            template: "./src/index.html"
        }),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin()
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
                        require.resolve("react-refresh/babel")
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

function getRemoteEntryUrl(port) {
    const { CODESANDBOX_SSE, HOSTNAME = "" } = process.env;

    // Check if the example is running on codesandbox
    // https://codesandbox.io/docs/environment
    if (!CODESANDBOX_SSE) {
      return `http://localhost:${port}/remoteEntry.js`;
    }

    const parts = HOSTNAME.split("-");
    const codesandboxId = parts[parts.length - 1];

    return `//${codesandboxId}-${port}.sse.codesandbox.io/remoteEntry.js`;
  }