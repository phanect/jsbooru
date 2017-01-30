const database = require("../database");

module.exports = function(req, res) {
    database.insertTag(req.params.name)
    .then(_ => { res.sendStatus(200); })
    .catch((e) => {
        console.error(`Creating a new tag ${req.params.name} failed.`);
        console.error(e.message);
        res.sendStatus(500);
    });
};
