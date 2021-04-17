"use strict";

const database = require("../database");
const encode = require("../utils").encode;

module.exports = async (req, res) => {
  try {
    await database.insertTag(encode(req.params.name));
    res.sendStatus(200);
  } catch (err) {
    console.error(`Creating a new tag ${req.params.name} failed.`);
    console.error(err.message);
    res.sendStatus(500);
  }
};
