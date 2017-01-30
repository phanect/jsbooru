const database = require("../database");

module.exports = function(req, res) {
    const start = +req.query.s || 0;
    const tags = req.query.q ? req.query.q.split(" ") : [];
    const uniqueTags = (req.query.q === "" || req.query.q === "*")
        ? []
        : tags.filter((i, idx, arr) => { return arr.indexOf(i) === idx; });

    database.getPicturesByTag(uniqueTags, start, 20)
    .then((pics) =>
        Promise.all(
            pics.reduce((prev, curr) => prev.concat(curr.tags), [])
                .filter((i, idx, arr) => { return arr.indexOf(i) === idx; })
                .map(tag => 
                    database.getTagData(tag)
                    .then((data) =>
                        database.getCountByTagList(tag)
                        .then((count) => ({
                            name: tag,
                            type: data.type || "no-type",
                            count: count,
                        }))
                    )
                )
        )
        .then((tags) => {
            return database
            .getCountByTagList(uniqueTags)
            .then((count) => {
                res.send({
                    count: count,
                    result: pics,
                    tags: tags,
                });
            });
        })
    )
    .catch((e) => {
        console.error(`Getting the images from the tag list ${uniqueTags} failed.`);
        console.error(e.message);
        res.sendStatus(500);
    });
}
