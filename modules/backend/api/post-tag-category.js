"use strict";

const database = require("../database");

module.exports = async (req, res) => {
  try {
    await database.updateTag(
      req.params.name,
      { type: req.params.type }
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(`Updating tag category for ${req.params.name} failed.`);
    console.error(err.message);
    res.sendStatus(500);
  }
};
