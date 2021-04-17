"use strict";

const database = require("../database");

module.exports = async (req, res) => {
  try {
    await database.updateTagCounts();
    res.sendStatus(200);
  } catch (err) {
    console.error("Getting the GET clean data failed.");
    console.error(err.message);
    res.sendStatus(500);
  }
};
