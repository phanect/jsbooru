"use strict";

const database = require("../database");
const encode = require("../utils").encode;

function getUniqueTags(query) {
  const usTags = (query === "" || query === "*")
    ? []
    : query.split(" ").filter((i, idx, arr) => arr.indexOf(i) === idx);
  return usTags.map(tag => encode(tag));
}

module.exports = async (req, res) => {
  const start = +req.query.s || 0;
  const uniqueTags = getUniqueTags(req.query.q);

  try {
    const pics = await database.getPicturesByTag(uniqueTags, start, 20);

    const tags = await Promise.all(
      pics
        .reduce((prev, curr) => prev.concat(curr.tags), [])
        .filter((i, idx, arr) => arr.indexOf(i) === idx)
        .map(async (tag) => {
          const data = await database.getTagData(tag);
          const count = await database.getTagCount(tag);
          return {
            name: tag,
            type: data.type || "no-type",
            count: count,
          };
        })
    );

    const count = await database.getCountByTagList(uniqueTags);
    res.send({
      count: count,
      result: pics,
      tags: tags,
    });
  } catch(err) {
    console.error(`Getting the images from the tag list ${uniqueTags} failed.`);
    console.error(err.message);
    res.sendStatus(500);
  }
};
