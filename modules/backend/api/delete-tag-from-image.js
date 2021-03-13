"use strict";

const database = require("../database");

module.exports = async (req, res) => {
  const imageID = req.params.id;
  const tagName = req.params.tagname;

  try {
    await database.deleteTagFromPicture(imageID, tagName);
    await database.updateTagCount(tagName);
    res.sendStatus(200);
  } catch (err) {
    console.error(`Deleting the tag ${tagName} from the picture ${imageID} failed.`);
    console.error(err.message);
    res.sendStatus(500);
  }
};
