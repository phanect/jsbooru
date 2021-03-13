"use strict";

const database = require("../database");

module.exports = async (req, res) => {
  try {
    await database.insertPicture({
      url: req.body.url,
      tags: [],
    });
    res.sendStatus(200);
  } catch (err) {
    console.error(`Creating a new picture from the url ${req.body.url} failed.`);
    console.error(err.message);
    res.sendStatus(500);
  }
};
