"use strict";

const fs = require("fs");
const { resolve } = require("path");

const config = {
  database: resolve(__dirname, "./database"),
  imageFolder: resolve(__dirname, "./images"),
  thumbnailFolder: resolve(__dirname, "./thumb"),
  port: 3001,
};


function checkAccess(file) {
  try {
    fs.accessSync(file);
  } catch(e) {
    return false;
  }
  return true;
}

exports.initConfig = function() {
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
