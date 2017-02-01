const database = require("../database");
const encode = require("../utils").encode;

function getUniqueTags(query) {
    var usTags = (query === "" || query === "*")
        ? []
        : query.split(" ").filter((i, idx, arr) => { return arr.indexOf(i) === idx; })
    return usTags.map(tag => encode(tag));
}

module.exports = function(req, res) {
    const start = +req.query.s || 0;
    const uniqueTags = getUniqueTags(req.query.q);

    database.getPicturesByTag(uniqueTags, start, 20)
    .then((pics) =>
        Promise.all(
            pics.reduce((prev, curr) => prev.concat(curr.tags), [])
                .filter((i, idx, arr) => { return arr.indexOf(i) === idx; })
                .map(tag => 
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
