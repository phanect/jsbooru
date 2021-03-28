"use strict";

const database = require("../database");

module.exports = async (req, res) => {
  try {
    const data = await database.getPictureData(req.params.id);
    const tags = await Promise.all(
      data.tags.map(async (tag) => {
        const data = await database.getTagData(tag);
        const count = await database.getTagCount(tag);
        return {
          name: tag,
          type: data.type || "no-type",
          count: count,
        };
      }),
    );
    data.tags = tags;
    res.send(data);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(404);
  }
};
