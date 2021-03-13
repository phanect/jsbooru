"use strict";

const database = require("../database");
const path = require("path");
const config = require("../config").config;
const thumb = require("../thumbnailer");

module.exports = async (req, res) => {
  try {
    const nonCreatedThumbnails = (await database.getPictures()).filter(picture => !picture.thumbnail && picture.url);

    const result = Promise.all(
      nonCreatedThumbnails.map(nct => {
        const imageFileName = nct.url.substring(5);
        const imagePath = path.resolve(config.imageFolder, imageFileName);
        const urlID = path.basename(imagePath, path.extname(imagePath));
        return (async () => {
          console.info(`Starting conversion for ${nct._id} : ${urlID}`);

          try {
            const hash = await thumb.createThumbnail(imagePath);
            await database.updatePicture(
              nct._id,
              { thumbnail: `/thumb/${urlID}.jpg`, hash: hash }
            );
            return { id: nct._id, ok: true };
          } catch (err) {
            return { id: nct._id, ok: false };
          }
        })();
      })
    );

    const ok = result.filter(r => r.ok);
    const fail = result.filter(r => !r.ok);
    res.send({
      text: `Updated pictures: ${ok.length}, failed pictures: ${fail.length}`,
      ok: ok.map(d => d.id),
      fail: fail.map(d => d.id),
    });
  } catch (err) {
    console.error("Getting the GET clean data failed.");
    console.error(err.message);
    res.sendStatus(500);
  }
};
