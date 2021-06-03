const express = require('express');

const router = express.Router();


const MediaService = require('../../schema/media');

const { uploadFiles } = require('../../middlewares/uploadFile');

const uploadDeveloperImage = uploadFiles('clients');




// @route   GET api/client/test
// @desc    Test media route
// @access  public
router.get('/test',
    (req, res) => res.json({ test: 'success' }));



// @route   GET api/media
// @desc    Upload file
// @access  public
router.post('/', uploadDeveloperImage.single('avatar'), async function(req, res, next) {
    try {
        let url = `${process.env.BASE_URL}${process.env.FILE_PATH}${req.file.filename}`;
        let mainMedia = await MediaService.addMedia({ url })
        return res.json(mainMedia);
    } catch (error) {
        return res.json(error);
    }
})





module.exports = router;