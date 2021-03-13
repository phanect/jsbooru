"use strict";

const database = require("../database");

module.exports = async (req, res) => {
  const imageID = req.params.id;

  try {
    await database.deletePicture(imageID);
    res.sendStatus(200);
  } catch (err) {
    console.error(`[Error] Deleting the image ${imageID} failed.`);
    console.error(err.message);
    res.sendStatus(500);
  }
};
