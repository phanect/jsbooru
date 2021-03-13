"use strict";

const database = require("../database");

module.exports = function(req, res) {
  database.updatePicture(req.params.id, req.body)
    .then(() => {
      res.sendStatus(200);
      return;
    }).catch((e) => {
      console.error(`Updating picture ${req.params.id} with data ${req.body} failed.`);
      console.error(e.message);
      res.sendStatus(500);
    });
};
