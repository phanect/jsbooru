"use strict";

const express = require("express");
const path = require("path");
const config = require("./config").config;

exports.init = function(app) {
  app.use("/upload", (req, res) => {
    res.sendFile(path.resolve(config.staticFolder, "upload.html"));
  });
  app.use("/search", (req, res) => {
    res.sendFile(path.resolve(config.staticFolder, "index.html"));
  });
  app.use("/view", (req, res) => {
    res.sendFile(path.resolve(config.staticFolder, "index.html"));
  });
  app.use("/", express.static(config.staticFolder));
};
