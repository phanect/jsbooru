"use strict";

const Engine = require("tingodb")();
const config = require("./config").config;
const toStartByRegex = require("./utils").toStartByRegex;

const collectionNames = {
  images: "pictures",
  tags: "tags",
  tagcounts: "tag_counts",
  tagwiki: "tag_wiki",
};

exports.init = function() {
  const db = new Engine.Db(config.database, {});

  db.createCollection(collectionNames.images, (err, images) => {
    if(err) {
      throw new Error("Could not initialize images database");
    }
    db.createCollection(collectionNames.tags, (err, tags) => {
      if(err) {
        throw new Error("Could not initialize tags database");
      }
      db.createCollection(collectionNames.tagcounts, (err, tagcounts) => {
        if(err) {
          throw new Error("Could not initialize tag_counts database");
        }
        if(err) {
          throw new Error("Could not initialize tags database");
        }
        db.createCollection(collectionNames.tagwiki, (err, tagwiki) => {
          if(err) {
            throw new Error("Could not initialize tag_wiki database");
          }
          exports.images = images;
          exports.tags = tags;
          exports.tagcounts = tagcounts;
          exports.tagwiki = tagwiki;
        });
      });
    });
  });
};

// Pure inserts

/**
 * Insert a new tag in the database.
 *
 * @param {string} tagName - the tag name.
 * @returns {Promise<any>} a promise of the result.
 */
exports.insertTag = function(tagName) {
  return new Promise((resolve, reject) => {
    exports.tags.insert(
      { name: tagName },
      (err, result) => {
        if(err) {
          reject(err);
          return;
        }
        resolve(result);
      });
  });
};

/**
 * Inserts a new picture based on the picture data.
 *
 * @param {any} pictureData - the picture data to insert
 * @returns {Promise<string>} the inserted picture's ID.
 */
exports.insertPicture = function(pictureData) {
  return new Promise((resolve, reject) => {
    exports.images.insert(
      pictureData,
      (err, result) => {
        if(err) {
          reject(err); return;
        }
        resolve(result[0]._id);
      });
  });
};

/**
 * Insert a new tag in the database.
 *
 * @param {string} tagName - the tag name.
 * @param {string} wiki - the wki entry.
 * @returns {Promise<any>} a promise of the result.
 */
exports.insertTagWiki = function(tagName, wiki) {
  return new Promise((resolve, reject) => {
    exports.tagwiki.insert(
      {
        name: tagName,
        wiki: wiki,
        score: 0,
      },
      (err, result) => {
        if(err) {
          reject(err); return;
        }
        resolve(result);
      });
  });
};

// Pure select

/**
 * Get the list of pictures.
 *
 * @returns {Promise<any[]>} the picture list.
 */
exports.getPictures = function() {
  return new Promise((resolve, reject) => {
    exports.images.find()
      .toArray((err, result) => {
        if(err) {
          reject(err); return;
        }
        resolve(result);
      });
  });
};

/**
 * Get the data for a given tag.
 *
 * @returns {Promise<any>} the promise of the tag data.
 */
exports.getTagData = function(tagName) {
  return new Promise((resolve, reject) => {
    exports.tags.findOne(
      { name: tagName },
      (err, result) => {
        if(err) {
          reject(err); return;
        }
        resolve(result);
      });
  });
};

/**
 * Get the tag count for an unique tag.
 *
 * @param {string} tagName - the name of the tag to retrieve the count for.
 * @returns {Promise<number>} a promise on the count.
 */
exports.getTagCount = function(tagName) {
  return new Promise((resolve, reject) => {
    exports.tagcounts.findOne(
      { name: tagName },
      { count: 1 },
      (err, result) => {
        if(err) {
          reject(err);
          return;
        }
        resolve(result && result.count);
      });
  });
};

/**
 * Get the tag count for an unique tag.
 *
 * @param {string} tagName - the name of the tag to retrieve the count for.
 * @returns {Promise<number>} a promise on the count.
 */
exports.getTagWiki = function(tagName) {
  return new Promise((resolve, reject) => {
    exports.tagwiki.find(
      { name: tagName },
      { author: 1, wiki: 1, score: 1 }
    ).toArray((err, result) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(result.map(r => ({
        author: r.author,
        entry: r.count,
        score: r.score,
      })));
    });
  });
};

// Pure update

/**
 * Updates the given tag with the given tag data.
 *
 * @param {string} tagName - the tag to update
 * @param {any} tagData - the new data to set.
 * @returns {Promise} the promise of a result.
 */
exports.updateTag = function(tagName, tagData) {
  return new Promise((resolve, reject) => {
    exports.tags.update(
      { name: tagName },
      { $set: tagData },
      (err, result) => {
        if(err) {
          reject(err);
          return;
        }
        resolve(result);
      });
  });
};

/**
 * Update the given picture
 *
 * @param {string} pictureID - the picture ID
 * @param {any} pictureData - the picture data.
 * @returns {Promise} the promise.
 */
exports.updatePicture = function(pictureID, pictureData) {
  return new Promise((resolve, reject) => {
    exports.images.update(
      { _id: pictureID },
      { $set: pictureData },
      (err, result) => {
        if(err) {
          reject(err);
          return;
        }
        resolve(result);
      });
  });
};

// Pure delete

/**
 * Deletes the given tag
 *
 * @param {string} tagName - the tag to delete.
 * @returns {Promise} the promise.
 */
exports.deleteTag = function(tagName) {
  return new Promise((resolve, reject) => {
    exports.tags.remove(
      { name: tagName },
      (err, result) => {
        if(err) {
          reject(err);
          return;
        }
        resolve(result);
      });
  });
};

/**
 * Deletes a picture from the database.
 *
 * @param {string} pictureID - the picture to delete.
 * @returns {Promise} the promise of a reply.
 */
exports.deletePicture = function(pictureID) {
  return new Promise((resolve, reject) => {
    exports.images.remove(
      { _id: pictureID },
      (err, result) => {
        if(err) {
          reject(err);
          return;
        }
        resolve(result);
      });
  });
};

// Advanced

/**
 * Get the tags that begins by the given string.
 *
 * @returns {Promise<any[]>} the promise of the matches.
 */
exports.getTagsFromPartialTagName = function(tagName) {
  return toStartByRegex(tagName)
    .then((expr) =>
      new Promise((resolve, reject) => {
        exports.tags.find(
          { name: { $regex: expr }}
        ).toArray((err, result) => {
          if(err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      })
    );
};

/**
 * Set the given tag to the given image, create the tag if needed.
 *
 * @param {string} pictureID - the picture to add the tag to
 * @param {string} tagName - the tag name
 * @returns {Promise} the promise of a job well done.
 */
exports.insertTagOnPicture = function(pictureID, tagName) {
  return Promise.all([
    new Promise((resolve, reject) => {
      exports.tags.update(
        { name: tagName },
        { $set: { name: tagName }},
        { upsert: true },
        (err, result) => {
          if(err) {
            reject(err);
            return;
          }
          resolve(result);
        });
    }),
    new Promise((resolve, reject) => {
      exports.images.update(
        { _id: pictureID },
        { $addToSet: { tags: tagName }},
        (err, result) => {
          if(err) {
            reject(err);
            return;
          }
          resolve(result);
        });
    }),
  ]);
};

/**
 * Deletes the given tag from an image.
 *
 * @param {string} pictureID - the picture ID
 * @param {string} tagName - the tag to delete.
 * @returns {Promise} the promise.
 */
exports.deleteTagFromPicture = function(pictureID, tagName) {
  return new Promise((resolve, reject) => {
    exports.images.update(
      { _id: pictureID },
      { $pull: { tags: tagName }},
      (err, result) => {
        if(err) {
          reject(err);
          return;
        }
        resolve(result);
      }
    );
  });
};

/**
 * Get all the data about a given picture.
 *
 * @param {string} pictureID - the picture ID.
 * @returns {Promise<any>} the promise of data.
 */
exports.getPictureData = function(pictureID) {
  return new Promise((resolve, reject) => {
    exports.images.findOne(
      { _id: pictureID },
      (err, result) => {
        if(err) {
          reject(err);
          return;
        }
        resolve(result);
      }
    );
  });
};

/**
 * Get part of the picture list that matches the given tag.
 *
 * @param {string[]} tagList - the tag names.
 * @param {number} skip - the number of items to skip.
 * @param {number} limit - the item limit.
 * @returns {Promise<any[]>} the promise of data.
 */
exports.getPicturesByTag = function(tagList, skip, limit) {
  return new Promise((resolve, reject) => {
    exports.images.find(
      { tags: { $all: tagList }},
      { _id: 1, url: 1, thumbnail: 1, tags: 1 },
      { skip, limit }
    ).toArray((err, result) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

/**
 * Get the number of images that matches the given tag list.
 *
 * @param {string[]} tagList - the tag list to match
 * @returns {Promise<number>} the promise of a number.
 */
exports.getCountByTagList = function(tagList) {
  return new Promise((resolve, reject) => {
    exports.images.count(
      { tags: { $all: tagList }},
      (err, count) => {
        if(err) {
          reject(err);
          return;
        }
        resolve(count);
      }
    );
  });
};

/**
 * Update the tag count for all tags.
 *
 * @returns {Promise<any>} the promise of the updated count.
 */
exports.updateTagCounts = function() {
  return new Promise((resolve, reject) => {
    exports.tags.find(
      {}, { name: 1 }
    ).toArray((err, result) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(result.map(tag => tag.name));
    });
  })
    .then(
      (tagList) => Promise.all(
        tagList.map(
          (tagName) => exports.updateTagCount(tagName)
        )
      )
    );
};

/**
 * Update the tag count for the given tag.
 *
 * @param {string} tagName - the tag name to count
 * @returns {Promise<any>} the promise of the updated count.
 */
exports.updateTagCount = function(tagName) {
  return new Promise((resolve, reject) => {
    exports.images.count(
      { tags: { $all: [ tagName ]}},
      (err, count) => {
        if(err) {
          reject(err);
          return;
        }
        resolve(count);
      }
    );
  }).then((tagCount) => new Promise((resolve, reject) => {
    exports.tagcounts.update(
      { name: tagName },
      { name: tagName, count: tagCount },
      { upsert: true },
      (err, result) => {
        if(err) {
          reject(err);
          return;
        }
        resolve(result);
      }
    );
  }));
};
