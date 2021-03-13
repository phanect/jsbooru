"use strict";

const database = require("../database");

module.exports = function(req, res) {
  database.updateTag(
    req.params.name,
    { type: req.params.type }
  ).then(() => {
    res.sendStatus(200);
    return;
  }).catch((e) => {
    console.error(`Updating tag category for ${req.params.name} failed.`);
    console.error(e.message);
    res.sendStatus(500);
  });
};
