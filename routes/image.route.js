'use strict';
const auth = require("../middleware/auth");
const User = require("../models/user.model");
const Image = require("../models/image.model");
const Util = require("../utils/util");
const upload = require("../middleware/upload");
const Thumbnail = require("../utils/thumbnail");
const express = require("express");

const router = express.Router();


router.post("/upload", auth, async(req, res) => {
    //find an existing user
    let user = await User.findById(req.user._id);
    // console.log(JSON.stringify(user));
    //upload file
    let file;
    upload(req, res, async(err) => {
        if (err) {
            res.status(400).send({ "error": err, "status": 400 });
        }
        file = req.file;
        let validImage = Util.validateImageExtention(file);
        if (!validImage) return res.status(400).send({ "error": "Only JPG, JPEG or PNG Allowed", "status": 400 });

        let img = new Image({
            name: file.originalname,
            path: file.path,
            user: user._id,
            resource_id: Util.getUniqueId(),
            status: 'PENDING'
        });

        await img.save();

        res.send({
            status: 200,
            msg: "Image Uploaded",
            result: img
        });
        // create thumbnail in async
        new Thumbnail(img);
    });
});

router.get("/download", auth, async(req, res) => {
    if (req.query && req.query['resource_id']) {
        let image = await Image.findOne({ resource_id: req.query['resource_id'], user: req.user._id });
        if (image['status'] == "COMPLETE" && image['processed']) {
            res.download(image['thumbnail_path']);
        } else {
            res.send({ status: 200, msg: "Image Found", result: image });
        }
    } else {
        res.status(400).send({ "error": "resource_id is required", "status": 400 });
    }
});

router.get("/all", auth, async(req, res) => {
    let images = await Image.find({ user: req.user._id });
    res.send({
        "status": 200,
        "msg": "Images Found",
        "result": images
    });
});

module.exports = router;