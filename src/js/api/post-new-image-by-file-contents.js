"use strict";

const fs = require("fs");
const path = require("path");
const config = require("../config").config;
const database = require("../database");
const uuid = require("../utils").uuid;
const thumb = require("../thumbnailer");

function saveInDBAndRedirect(res, newFile, urlID, hash) {
  if(hash) {
    console.info(`Thumbnail hash : ${hash}`);
  }
  return database.insertPicture(
    hash
      ? {
        url: `/img/${newFile}`,
        thumbnail: `/thumb/${urlID}.jpg`,
        hash: hash,
        tags: [],
      }
      : {
        url: `/img/${newFile}`,
        tags: [],
      }
  ).then((id) => {
    console.info(`Assigned ID : ${id}`);
    res.redirect(`/#/view/${id}`);
    return;
  }).catch((e) => {
    console.error("Creating an ID for the new uploaded picture failed.");
    console.error(e.message);
    res.sendStatus(500);
  });
}

module.exports = function(req, res) {
  console.info("--- Adding new file ---");
  req.pipe(req.busboy);
  req.busboy.on("file", (fieldname, file, filename) => {
    const urlID = uuid();
    const extension = path.extname(filename);
    const newFile = urlID + extension;
    const newFileAbsolute = path.resolve(config.imageFolder, newFile);
    console.info(`Added file : ${newFileAbsolute}`);
    const fstream = fs.createWriteStream(newFileAbsolute);
    file.pipe(fstream);
    fstream.on("close", () => {
      thumb.createThumbnail(newFileAbsolute)
        .then((hash) =>
          saveInDBAndRedirect(res, newFile, urlID, hash)
        ).catch(() =>
          saveInDBAndRedirect(res, newFile)
        );
    });
  });
  return;
};
