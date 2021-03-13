"use strict";

const database = require("../database");

module.exports = async (req, res) => {
  try {
    await database.updatePicture(req.params.id, req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error(`Updating picture ${req.params.id} with data ${req.body} failed.`);
    console.error(err.message);
    res.sendStatus(500);
  }
};
