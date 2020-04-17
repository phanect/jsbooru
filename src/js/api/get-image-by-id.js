"use strict";

const database = require("../database");

module.exports = function(req, res) {
  database.getPictureData(req.params.id)
    .then((data) =>
      Promise.all(
        data.tags.map(tag =>
          database.getTagData(tag)
            .then((data) =>
              database.getTagCount(tag)
                .then((count) => ({
                  name: tag,
                  type: data.type || "no-type",
                  count: count,
                }))
            )
        )
      ).then((tags) => {
        data.tags = tags;
        res.send(data);
      })
    ).catch((e) => {
      console.error(`Getting the data from the picture ${imageID} failed.`);
      console.error(e.message);
      res.sendStatus(500);
    });
};
