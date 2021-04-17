"use strict";

const database = require("../database");
const encode = require("../utils").encode;

module.exports = function(req, res) {
  const unsafeRequest = req.query.q ? req.query.q.split(" ") : [];
  const request = unsafeRequest.map(tag => encode(tag));
  const firsts = request.slice(0, -1);
  const queried = request.length > 0 ? request[request.length - 1] : "";

  // If the queried string is "" or "*"
  if(queried === "" || queried == "*") {
    res.send([{
      result: request.join(" "),
      type: "all-match",
      query: queried,
      name: request.join(" "),
      match: true,
      count: queried === "*" ? "all" : 0,
    }]);
    return;
  }

  // Valid queried string.
  database.getTagsFromPartialTagName(queried)
    .then((results) => {
      // There was no valid results, add the "unmatched" result.
      if(results.length === 0) {
        res.send([{
          result: request.join(" "),
          type: "no-match",
          query: queried,
          name: "(no match)",
          match: false,
          count: 0,
        }]);
        return Promise.resolve();
      }
      // There was valid results, recreate the full string and return the resulting list.
      const str1 = firsts.join(" ");
      const str = str1 ? str1 + " " : "";
      return Promise.all(results
        .map(tag =>
          database.getTagData(tag.name)
            .then((data) =>
              database
                .getTagCount(tag.name)
                .then((count) => ({
                  name: tag.name,
                  type: data.type || "no-type",
                  count: count,
                }))
            )
        )
      ).then((tags) => {
        res.send(tags.map(r => ({
          result: str + r.name,
          type: r.type,
          query: queried,
          name: r.name,
          match: true,
          count: r.count || 0,
        })));
        return;
      });
    }).catch((e) => {
      console.error(`Getting the tags related to the tag ${queried}, for the original request ${req.query.q} failed.`);
      console.error(e.message);
      res.sendStatus(500);
    });
};
