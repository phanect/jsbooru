"use strict";

const database = require("../database");
const encode = require("../utils").encode;

module.exports = async (req, res) => {
  const tagName = req.params.name;
  const unsafeTagList = tagName.split(" ");
  const tagList = unsafeTagList.map(tag => encode(tag));
  if(tagList.length > 1) {
    try {
      const count = await database.getCountByTagList(tagList);
      res.send({
        name: tagName,
        count: count,
      });
    } catch(err) {
      console.error(`Getting the data from the tag list ${tagName} failed.`);
      console.error(err.message);
      res.sendStatus(500);
    }
    return;
  }

  try {
    const data = await database.getTagData(tagName);
    const count = await database.getTagCount(tagName);
    res.send({
      name: tagName,
      type: (data && data.type) || "no-type",
      count: count || 0,
    });
  } catch(err) {
    console.error(`Getting the data from the tag ${tagName} failed.`);
    console.error(err.message);
    res.sendStatus(500);
  }
};
