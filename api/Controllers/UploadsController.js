const Jimp = require('jimp');
const videoshow = require('videoshow');
const path = require('path');
const publicPath = path.join(__dirname, '../../public');
const { registerFont, createCanvas, loadImage } = require('canvas');
const fs = require('fs');

module.exports = {
    image: (req, res) => {
        params = req.body;

        Jimp.read(params.image).then(image => {
            Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => {
                image
                .resize(Number(params.height), Number(params.width)) // resize
                .quality(60)
                .print(font, Number(params.text_align_horizontal), Number(params.text_align_vertical),
                    params.text, Number(params.max_width))
                .write(publicPath + '/media/images/' + Date.now() + "-image.jpg");
            });

            res.status(201).json({
                'message': 'Image uploaded successfully!',
            });
        })
        .catch(err => {
            res.status(400).json({
                'error': true,
                'message': err
            });
        });
    },

    video: (req, res) => {
    	const options = {
    		fps: 25,
    		transition: true,
    		transitionDuration: 1,
    		videoBitrate: 1024,
    		videoCodec: "libx264",
            audioBitrate: '128k',
            audioChannels: 2,
            audioCodec:'libmp3lame',
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

    	videoshow(images, options)
        .audio(req.body.audio)
        .save(path + Date.now() + "-video.mp4")
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
    },

    dynamicTextImage: (req, res) => {

        const canvas = createCanvas(500, 500)
        const ctx = canvas.getContext('2d')

        registerFont(publicPath + '/media/fonts/FjallaOne-Regular.ttf', { family: 'Fjalla One' })

        // Draw cat with lime helmet
        loadImage(req.body.image).then((image) => {
            ctx.drawImage(image, 0, 0)
            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = '30px "Fjalla One"';
            ctx.fillStyle = "white";
            ctx.rotate(-0.2);
            ctx.fillText("THIS IS A LONG LONG TITLE", 10, 90);

            let path = publicPath + '/media/images/' + Date.now() + "-img.JPEG";
            const out = fs.createWriteStream(path);
            const stream = canvas.createJPEGStream();
            stream.pipe(out);
            out.on('finish', () =>  res.send('The JPEG file was created.'));
        })
        .catch(err => {
            res.status(400).json({
                'error': true,
                'message': err
            });
        });
    }
}