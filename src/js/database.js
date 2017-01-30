const Engine = require("tingodb")();
const config = require("./config").config;

const collectionNames = {
    images: "pictures",
    tags: "tags",
}

exports.init = function() {
    const db = new Engine.Db(config.database, {});

    db.createCollection(collectionNames.images, function(err, images) {
        if(err) throw new Error("Could not initialize images database");
        db.createCollection(collectionNames.tags, function(err, tags) {
            if(err) throw new Error("Could not initialize tags database");
            exports.images = images;
            exports.tags = tags;
        });

    });
}

// Pure inserts

/**
 * Insert a new tag in the database.
 * @param {string} tagName the tag name.
 * @return {Promise<any>} a promise of the result.
 */
exports.insertTag = function(tagName) {
    return new Promise((resolve, reject) => {
        exports.tags.insert(
            { name: tagName },
        function(err, result) {
            if(err) { reject(err); return; }
            resolve(result);
        });
    });
}

/**
 * Inserts a new picture based on the picture data.
 * @param {any} the picture data to insert
 * @return {Promise<string>} the inserted picture's ID.
 */
exports.insertPicture = function(pictureData) {
    return new Promise((resolve, reject) => {
        exports.images.insert(
            pictureData,
        function(err, result) {
            if(err) { reject(err); return; }
            resolve(result[0]._id);
        });
    })
}

// Pure update

/**
 * Updates the given tag with the given tag data.
 * @param {string} tagName the tag to update
 * @param {any} tagData the new data to set.
 * @return {Promise} the promise of a result. 
 */
exports.updateTag = function(tagName, tagData) {
    return new Promise((resolve, reject) => {
        exports.tags.update(
            { name: tagName },
            { $set: tagData },
        function(error, result) {
            if(err) { reject(err); return; }
            resolve(result);
        });
    });
}

/**
 * Update the given picture
 * @param {string} pictureID the picture ID
 * @param {any} pictureData the picture data.
 * @return {Promise} the promise.
 */
exports.updatePicture = function(pictureID, pictureData) {
    return new Promise((resolve, reject) => {
        exports.images.update(
            { _id: pictureID },
            { $set: pictureData },
        function(err, result) {
            if(err) { reject(err); return; }
            resolve(result);
        });
    })
}

// Pure delete

/**
 * Deletes the given tag
 * @param {string} tagName the tag to delete.
 * @return {Promise} the promise.
 */
exports.deleteTag = function(tagName) {
    return new Promise((resolve, reject) => {
        exports.tags.remove(
            { name: tagName },
        function(err, result) {
            if(err) { reject(err); return; }
            resolve(result);
        });
    })
}

/**
 * Deletes a picture from the database.
 * @param {string} pictureID the picture to delete.
 * @return {Promise} the promise of a reply.
 */
exports.deletePicture = function(pictureID) {
    return new Promise((resolve, reject) => {
        exports.images.remove(
            { _id: pictureID },
        function(err, result) {
            if(err) { reject(err); return; }
            resolve(result);
        });
    })
}

// Advanced

/**
 * Get the data for a given tag.
 * @return {Promise<any>} the promise of data.
 */
exports.getTagData = function(tagName) {
    return new Promise((resolve, reject) => {
        exports.tags.find(
            {name: tagName }
        ).toArray(function(err, result) {
            if(err) { reject(err); return; }
            resolve(result);
        });
    });
}

/**
 * Get the tags that begins by the given string.
 * @return {Promise<any[]>} the promise of the matches.
 */
exports.getTagsFromPartialTagName = function(tagName) {
    return new Promise((resolve, reject) => {
        const cleanTagName = tagName.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        exports.tags.find(
            {name: { $regex: new RegExp(`^${cleanTagName}`) } }
        ).toArray(function(err, result) {
            if(err) { reject(err); return; }
            resolve(result);
        });
    });
}

/**
 * Set the given tag to the given image, create the tag if needed.
 * @param {string} pictureID the picture to add the tag to
 * @param {string} tagName the tag name
 * @return {Promise} the promise of a job well done.
 */
exports.insertTagOnPicture = function(pictureID, tagName) {
    return Promise.all([
        new Promise((resolve, reject) => {
            exports.tags.update(
                { name: tagName },
                { name: tagName },
                {upsert: true},
            function(err, result) {
                if(err) { reject(err); return; }
                resolve(result);
            });
        }),
        new Promise((resolve, reject) => {
            exports.images.update(
                { _id: pictureID },
                { $addToSet: {tags: tagName} },
            function(err, result) {
                if(err) { reject(err); return; }
                resolve(result);
            });
        })
    ]);
}

/**
 * Deletes the given tag from an image.
 * @param {string} pictureID the picture ID
 * @param {string} tagName the tag to delete.
 * @return {Promise} the promise.
 */
exports.deleteTagFromPicture = function(pictureID, tagName) {
    return new Promise((resolve, reject) => {
        exports.images.update(
            { _id: pictureID },
            { $pull: {tags: tagName} },
        function(err, result) {
            if(err) { reject(err); return; }
            resolve(result);
        });
    })
}

/**
 * Get all the data about a given picture.
 * @param {string} pictureID the picture ID.
 * @return {Promise<any>} the promise of data.
 */
exports.getPictureData = function(pictureID) {
    return new Promise((resolve, reject) => {
        exports.images.findOne(
            { _id: pictureID },
        function(err, result) {
            if(err) { reject(err); return; }
            resolve(result);
        });
    });
}

/**
 * Get part of the picture list that matches the given tag.
 * @param {string[]} tagNames the tag names.
 * @param {number} skip the number of items to skip.
 * @param {number} limit the item limit.
 * @returns {Promise<any[]>} the promise of data.
 */
exports.getPicturesByTag = function(tagNames, skip, limit) {
    return new Promise((resolve, reject) => {
        exports.images.find(
            { tags: { $all: tagNames } },
            { _id: 1, url: 1, tags: 1 },
            {
                skip: skip,
                limit: limit,
            }
        ).toArray(function(err, result) {
            if(err) { reject(err); return; }
            resolve(result);
        });
    });
}

/**
 * Get the number of images that matches the given tag list.
 * @param {string[]} tagList the tag list to match
 * @return {Promise<number>} the promise of a number.
 */
exports.getCountByTagList = function(tagList) {
    return new Promise((resolve, reject) => {
        exports.images.count(
            { tags: { $all: tagList } },
        function(err, count) {
            if(err) { reject(err); return; }
            resolve(count);
        });
    })
}
