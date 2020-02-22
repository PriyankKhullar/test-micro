const videoshow = require('videoshow');
const path = require('path');
const publicPath = path.join(__dirname, '../../public');
const random = Math.floor(Math.random()* 100);

module.exports = {

    video: (req, res) => {
    	const options = {
    		fps: 25,
    		transition: true,
    		transitionDuration: 1,
    		videoBitrate: 1024,
    		videoCodec: "libx264",
    		size: "640x?",
    		format: "mp4",
    		subtitleStyles: {
    			Fontname: "Verdana",
    			Fontsize: "26",
    			PrimaryColour: "11861244",
    			SecondaryColour: "11861244",
    			TertiaryColour: "11861244",
    			BackColour: "-2147483640",
    			Bold: "2",
    			Italic: "0",
    			BorderStyle: "2",
    			Outline: "2",
    			Shadow: "3",
    			Alignment: "1",
    			MarginL: "40",
    			MarginR: "60",
    			MarginV: "40"
    		}
    	}

    	const images = req.body.images;
    	var path = publicPath + '/media/videos/';

    	videoshow(images, options).save(path + random + "-video.mp4")
    	.on('start', function (command) {
    		console.log('ffmpeg process started:', command);
    	})
    	.on('error', function (err, stdout, stderr) {
            res.status(400).json({
                'error': true,
                'message': 'Error: ' + err + 'ffmpeg stderr: ' + stderr
            });
    	})
    	.on('end', function (output) {
            console.log('Video created in:', output);
    		res.status(201).json({
                'message': 'Video created successfully!',
                'path': output
            });
    	});
    }
}