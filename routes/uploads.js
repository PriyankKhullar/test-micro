const express = require('express');
const router = express.Router();
const UploadsController = require('../api/Controllers/UploadsController');

// uploads
router.post('/image', UploadsController.image);
router.post('/dynamic-image', UploadsController.dynamicTextImage);
router.post('/video', UploadsController.video);
router.post('/merge-video', UploadsController.mergeVideos);

module.exports = router;