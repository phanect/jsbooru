"use strict";

const fs = require("fs");
const path = require("path");
const config = require("../config").config;
const database = require("../database");
const uuid = require("../utils").uuid;
const thumb = require("../thumbnailer");

const saveInDBAndRedirect = async (res, newFile, urlID, hash) => {
  if(hash) {
    console.info(`Thumbnail hash : ${hash}`);
  }

  try {
    const id = await database.insertPicture(
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
    );
    console.info(`Assigned ID : ${id}`);
    res.redirect(`/view/${id}`);
  } catch (err) {
    console.error("Creating an ID for the new uploaded picture failed.");
    console.error(err.message);
    res.sendStatus(500);
  }
};

module.exports = async (req, res) => new Promise((resolve) => {
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
    fstream.on("close", async () => {
      try {
        const hash = await thumb.createThumbnail(newFileAbsolute);
        await saveInDBAndRedirect(res, newFile, urlID, hash);
        resolve();
      } catch (err) {
        await saveInDBAndRedirect(res, newFile);
        resolve();
      }
    });
  });
});
