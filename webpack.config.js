var isProd = (process.argv.indexOf('--production') >= 0);
var isRender = (process.argv.indexOf('--render') >= 0);
var options = (isProd ?
  require("./webpack.dist.config.js") :
  (isRender ? require("./webpack.render.config.js") :
    require("./webpack.hot.config.js")));

module.exports = (function(options){
  var fs = require('fs'),
  version = require('./package.json').version,
  path = require("path"),
  assign = require('object-assign'),
  webpack = require("webpack"),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin"),
  devPort = process.env.PORT = process.env.PORT || 8000;

var baseConfig = {
  entry: {
    app: ['./app/app.js']
  },

  output: {
    publicPath: '',
    path: 'dist/',
    filename: "[name].js",
    sourceMapFilename: '[file].map',
    chunkFilename: "[name].js",
    libraryTarget: undefined,
    pathinfo: false
  },

  module:{
    noParse: [],
    loaders: [{
      /* convert all source files */
      test: /\.(js|jsx)$/,
      include: [/app/],
      exclude: [/(node_modules|persistence)/],
      loader: 'babel',
      query: {
        plugins: ['transform-runtime'],
        presets: ['es2015', 'stage-0', 'react'],
        cacheDirectory: true
      }
    }, {
      test: /\.json$/,
      loader: 'json',
    }, {
      /* Bundle CSS. */
      test: /\.css$/,
      exclude: /.(\-|\.)min.css$/,
      loader: 'style!css'
    }, {
      /* convert sass */
      test: /\.sass/,
      loader: 'style!css!sass?sourceMap=true&indentedSyntax=sass&includePaths[]=' + (__dirname, "./src")
    }, {
      /* Embed Fonts */
      test: /\.(eot|woff|ttf)$/,
      loader: 'file?name=[name].[ext]&context=/'
    }, {
      /* File Exporter to include any images */
      test: /\.(png|jpg|jpeg|svg|gif)$/,
      exclude:/icons/,
      loader: 'url?limit=8192&name=assets/images/[name].[ext]'
    }, {
      /* File Exporter to include any images */
      test: /\.(png|jpg|jpeg|svg|gif)$/,
      include:/icons/,
      loader: 'file?name=[name].[ext]'
    }, {
      /* File Exporter to include index */
      test: [/index\.html$/, /\.(ico)/],
      loader: 'file?name=[name].[ext]'
    }
  ]
  },

  target: "web",

  resolveLoader: {
    root: [path.join(__dirname, "node_modules"), './app', 'vendor'],
  },

  resolve: {
    root: "app",
    extensions: ["", ".js", ".jsx"],
    /* allow for friendlier names to pull from preminimized files */
    alias: {
      // "triforce": "import-loader?this=>window!triforce"
    },
    /* allow for root relative names in require */
    modulesDirectories: ['bower_components', 'node_modules', 'src']
  },

  plugins: [
    /* "Compiler" switches and embeding versioning. Dead code stripping will remove. */
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(version),
      __PROD__: JSON.stringify(JSON.parse(process.env.NODE_ENV === "production" || 'false')),
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
    }),

    ],

  devServer: {
    contentBase: 'dist/',
    proxy: null,
    https: false,
    historyApiFallback: true,
    stats: {
      cached: false,
      exclude: [/node_modules/]
    }
  },

  /* settings for jshint */
  jshint: {
    "globals": { "__DEV__": true }
  },
}

function runPostConfig(config, options) {
  updateEntry(config, options);

  updateDevServer(config, options);

  updateDebug(config, options);

  updatePlugins(config, options);

  config.plugins.push(
    new webpack.DefinePlugin({process:{env:{BROWSER_ENV:(config.target === 'web') }}})
  );
}

function updateEntry(config, options) {
  var entry = config.entry && config.entry.app || Object.keys(config.entry);

  if (options.hotComponents) {
    entry.unshift('webpack/hot/only-dev-server');
    entry.unshift('webpack-dev-server/client?http'+(options.https ? 's':'')+'://localhost:'+devPort);
  }
}

function updateDebug(config, options) {
  if (options.debug){
    config.output.pathinfo = true;
  }
}

function updateDevServer(config, options) {
  if (options.devServer) {
    config.output.publicPath = 'http'+(options.https ? 's':'')+'://localhost:'+devPort+'/';
    config.output.chunkFilename = "[name]-[id].js";
    config.devServer.https = options.https || false;
  }

  if (options.proxy) {
    config.devServer.proxy = options.proxy;
  }

  if (options.hotComponents) {
    config.module.loaders.some(function(loader) {
      if(loader.loader.indexOf('jsx') === 0){
        loader.loader = 'react-hot!' + loader.loader;
        return true;
      };
      return false;
    })
    config.devServer.hot = true
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    // include --inline to the start command
    // OR add <script src="http://localhost:8000/webpack-dev-server.js"></script> in index.html
  }
}

function updatePlugins(config, options) {
  config.plugins.push(new HtmlWebpackPlugin({
  filename: 'index.html',
  inject: false,
  version: version,
  template: 'app/assets/index.htm'
  }));
  console.log(options);
  if(options.minimize) {
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress:{warnings:false},
        test:/[^min]\.js/i
      }),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        },
        __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
        __version__: version
      }),
      new webpack.NoErrorsPlugin()
    );
  }
}

baseConfig.devtool = options.devtool;
runPostConfig(baseConfig, options);

// console.log(JSON.parse(baseConfig, undefined, 1))

return baseConfig;

}(options));
