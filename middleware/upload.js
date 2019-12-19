const multer = require('multer');
const uploadPath = process.env.IMAGES_PATH;
const path = require('path')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, process.env.IMAGES_PATH)
    },
    filename: function(req, file, cb) {
        // cb(null, file.originalname);
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    storage: storage
}).single('img');

module.exports = upload;