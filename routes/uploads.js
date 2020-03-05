const express = require('express');
const router = express.Router();
const UploadsController = require('../api/Controllers/UploadsController');

// uploads
router.post('/image', UploadsController.image);
router.post('/video', UploadsController.video);

router.post('/dynamic-image', UploadsController.dynamicTextImage);
router.post('/convert-to-mp4', UploadsController.convertImgToMp4);
router.post('/merge-video', UploadsController.mergeVideos);
router.post('/add-audio', UploadsController.addAudioInVideo);

module.exports = router;