"use strict";

const database = require("../database");
const encode = require("../utils").encode;

module.exports = function(req, res) {
  const tagName = req.params.name;
  const unsafeTagList = tagName.split(" ");
  const tagList = unsafeTagList.map(tag => encode(tag));
  if(tagList.length > 1) {
    database.getCountByTagList(tagList)
      .then((count) => {
        res.send({
          name: tagName,
          count: count,
        });
        return;
      })
      .catch((e) => {
        console.error(`Getting the data from the tag list ${tagName} failed.`);
        console.error(e.message);
        res.sendStatus(500);
      });
    return;
  }
  database.getTagData(tagName)
    .then((data) =>
      database.getTagCount(tagName)
        .then((count) => {
          res.send({
            name: tagName,
            type: (data && data.type) || "no-type",
            count: count || 0,
          });
          return;
        })
    ).catch((e) => {
      console.error(`Getting the data from the tag ${tagName} failed.`);
      console.error(e.message);
      res.sendStatus(500);
    });
};