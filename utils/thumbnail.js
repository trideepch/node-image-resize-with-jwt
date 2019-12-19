'use strict';

const sharp = require('sharp');
const sleep = require('sleep');
const Image = require("../models/image.model");

class Thumbnail {
    constructor(imageObj) {
        this.__img = imageObj;
        this.__process();
    }

    async __process() {
        const sec = process.env.SlEEP;
        let updateObj = null;
        let image = null;
        try {
            console.log("sleeping for %s seconds", sec);
            sleep.sleep(sec);
            updateObj = { status: "PROCESSING" };
            image = await Image.findByIdAndUpdate(this.__img._id, { $set: updateObj }, {
                new: true
            });
            console.log(image);

            console.log("waking up after %s seconds", sec);

            console.log("sleeping for %s seconds", sec);
            sleep.sleep(sec);
            // 

            const outputPath = process.env.IMAGES_THUMB_PATH;
            let outputFilePath = outputPath + this.__img.path.split("/").pop();
            console.log("outputFilePath", outputFilePath);

            try {
                const thumb = await sharp(this.__img.path).resize(200, 200).toFile(outputFilePath);
                console.log("thumb", thumb);

                updateObj = { status: "COMPLETE", processed: true, thumbnail_path: outputFilePath };
                image = await Image.findByIdAndUpdate(this.__img._id, { $set: updateObj }, {
                    new: true
                });
                console.log(image);
            } catch (error) {
                updateObj = { status: "ERROR" };
                image = await Image.findByIdAndUpdate(this.__img._id, { $set: updateObj }, {
                    new: true
                });
                console.log(image);
            }
            console.log("waking up after %s seconds", sec);
        } catch (error) {
            console.error("Error occurred: ", error)
        }
    }
}

module.exports = Thumbnail;