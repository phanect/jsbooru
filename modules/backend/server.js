"use strict";

const bodyParser = require("body-parser");
const busboy = require("connect-busboy");
const express = require("express");

const confHelper = require("./config");
const database = require("./database");

module.exports = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(busboy());

  if(!confHelper.initConfig()) {
    console.error("Server error : configuration file loading failed without recovery.");
    console.info("There was an error reading the configuration file.");
    process.exit(-1);
  }
  const config = confHelper.config;

  database.init();

  app.use("/img", express.static(config.imageFolder));
  app.use("/thumb", express.static(config.thumbnailFolder));
  app.use("/api", require("./api"));

  app.listen(config.port, () => {
    console.info(`Started app on port ${config.port}`);
  }).on("error", (err) => {
    console.info("Error opening the server. Are you sure the given port is valid ?");
    console.error(`Server error : ${err.message}`);
    console.error(err);
    process.exit(-1);
  });
};
