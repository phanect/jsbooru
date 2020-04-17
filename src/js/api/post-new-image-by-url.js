"use strict";

const database = require("../database");

module.exports = function(req, res) {
  database.insertPicture({
    url: req.body.url,
    tags: [],
  }).then(() => {
    res.sendStatus(200);
    return;
  }).catch((e) => {
    console.error(`Creating a new picture from the url ${req.body.url} failed.`);
    console.error(e.message);
    res.sendStatus(500);
  });
};
