"use strict";

const database = require("../database");

module.exports = function(req, res) {
  const imageID = req.params.id;
  const tagName = req.params.tagname;
  database.insertTagOnPicture(imageID, tagName)
    .then(() => database.updateTagCount(tagName))
    .then(() => {
      res.sendStatus(200);
      return;
    })
    .catch((e) => {
      console.error(`Adding tag ${tagName} on picture ${imageID} failed.`);
      console.error(e.message);
      res.sendStatus(500);
    });
};
