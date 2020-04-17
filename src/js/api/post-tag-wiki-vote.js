"use strict";

module.exports = function(req, res) {
  Promise.resolve(true)
    .then(() => {
      res.sendStatus(200);
      return;
    }).catch((e) => {
      console.error(`Updating tag wiki vote count for ${req.params.name} failed.`);
      console.error(e.message);
      res.sendStatus(500);
    });
};
