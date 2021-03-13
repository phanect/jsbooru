"use strict";

const fs = require("fs");
const path = require("path");

const config = {
  database: "",
  imageFolder: "",
  thumbnailFolder: "",
  port: 8000,
};


function checkAccess(file) {
  try {
    fs.accessSync(file);
  } catch(e) {
    return false;
  }
  return true;
}

exports.initConfig = function(extConfig) {
  let fileConfig = {};
  try {
    var configFilePath = path.resolve(__dirname, "../config.json");
    const configContents = fs.readFileSync(configFilePath, "utf8");
    console.log(`Found configuration file : ${configFilePath}`);
    try {
      fileConfig = JSON.parse(configContents);
    } catch(e) {
      console.log(`Invalid data: ${configFilePath} does not contain a valid JSON string.`);
    }
  } catch(e) {
    console.log(`No configuraton file found : ${configFilePath}`);
  }
  extConfig = extConfig || fileConfig;
  config.database = path.resolve(__dirname, "./", extConfig.database || "database");
  config.imageFolder = path.resolve(__dirname, "./", extConfig.imageFolder || "images");
  config.thumbnailFolder = path.resolve(__dirname, "./", extConfig.thumbnailFolder || "thumb");
  config.port = extConfig.port || 3000;
  // Check access permissions
  if(!checkAccess(config.database)) {
    console.error(`The database folder ${config.database} can't be accessed. Ensure that the folder is created and that the user has enough permissions to access it.`);
    return false;
  }
  if(!checkAccess(config.imageFolder)) {
    console.error(`The image folder ${config.imageFolder} can't be accessed. Ensure that the folder is created and that the user has enough permissions to access it.`);
    return false;
  }
  if(!checkAccess(config.thumbnailFolder)) {
    console.error(`The thumbnail folder ${config.thumbnailFolder} can't be accessed. Ensure that the folder is created and that the user has enough permissions to access it.`);
    return false;
  }
  return true;
};

module.exports.config = config;
