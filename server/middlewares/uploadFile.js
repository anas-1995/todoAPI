const path = require('path');
const appRoot = require('app-root-path');
const multer = require('multer');

const storage = destPath =>
    multer.diskStorage({
        destination: path.resolve(appRoot.toString(), 'public/uploads', destPath),
        filename: (req, file, cb) => {
            cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
        },
    });

const isItValid = (file, cb) => {

    const fileTypes = /jpeg|jpg|png|gif|svg|pdf/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(null, false, 'The file is not an image, or a pdf file');
};

const uploadFiles = destPath =>
    multer({
        storage: storage(destPath),
        fileFilter(req, file, cb) {
            isItValid(file, cb);
        },
    });

module.exports = {
    uploadFiles,
};