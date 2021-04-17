"use strict";

const database = require("../database");

module.exports = function(req, res) {
  const imageID = req.params.id;
  database.deletePicture(imageID)
    .then(_ => { res.sendStatus(200); })
    .catch((e) => {
      console.error(`[Error] Deleting the image ${imageID} failed.`);
      console.error(e.message);
      res.sendStatus(500);
    });
};
