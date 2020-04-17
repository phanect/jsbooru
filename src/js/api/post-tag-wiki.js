"use strict";

const database = require("../database");
const encode = require("../utils").encode;

module.exports = function(req, res) {
  database.insertTagWiki(
    encode(req.params.name),
    encode(req.body.wiki)
  ).then(() => {
    res.sendStatus(200);
    return;
  }).catch((e) => {
    console.error(`Adding tag wiki entry for ${req.params.name} failed.`);
    console.error(e.message);
    res.sendStatus(500);
  });
};
