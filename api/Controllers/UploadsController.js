const Jimp = require('jimp');
const videoshow = require('videoshow');
const path = require('path');
const publicPath = path.join(__dirname, '../../public');
const { registerFont, createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const concat = require('ffmpeg-concat');
const AuthController = require('./AuthController');

registerFont(publicPath + '/media/fonts/FjallaOne-Regular.ttf', { family: 'Fjalla One' })
const ffmpeg = require('fluent-ffmpeg');

function createImage(params, distinations) {
    const canvas = createCanvas(1080, 570);
    const ctx = canvas.getContext('2d');

    loadImage(params.image).then((image) => {
        ctx.drawImage(image, 0, 0)
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = '50px "Fjalla One"';
        ctx.fillStyle = params.text_color;
        ctx.rotate(0.1);
        ctx.fillText(params.text, 150, 50);

        const out = fs.createWriteStream(distinations + '/' + params.order + '-' + Date.now() + "-img.JPEG");
        const stream = canvas.createJPEGStream();
        stream.pipe(out);
        out.on('finish', () =>  console.log('The JPEG file was created.'));
    })
    .catch(err => {
        console.log(err);
    });
}

function createVideo(filePath, destination, index) {

    const options = {
        fps: 25,
        loop: 5,
        transition: true,
        transitionDuration: 1,
        videoBitrate: 1024,
        videoCodec: 'libx264',
        size: '640x?',
        audioBitrate: '128k',
        audioChannels: 2,
        format: 'mp4',
        pixelFormat: 'yuv420p'
    };

    videoshow(filePath, options)
        .save(destination + '/' + Date.now() + (index+1) + "-video.mp4")
        .on('start', function (command) {
            console.log('ffmpeg process started:', command);
        })
        .on('error', function (err, stdout, stderr) {
            console.log('Error: ' + err + 'ffmpeg stderr: ' + stderr);
        })
        .on('end', function (output) {
            console.log('Video created in:', output);
        });
}

function getTransitionsEffects(size) {
    effectsCount = size-1;
    effects = [
        {
            name: 'fade',
            duration: 1000
        },
        {
            name: 'fadegrayscale',
            duration: 800
        },
        {
            name: 'circleopen',
            duration: 800
        },
        {
            name: 'directionalwarp',
            duration: 800
        },
        {
            name: 'directionalwipe',
            duration: 800
        },
        {
            name: 'crosswarp',
            duration: 800
        },
        {
            name: 'crosszoom',
            duration: 800
        },
        {
            name: 'dreamy',
            duration: 800
        },
        {
            name: 'squareswire',
            duration: 800
        },
        {
            name: 'angular',
            duration: 800
        },
        {
            name: 'radial',
            duration: 800
        },
        {
            name: 'cube',
            duration: 800
        },
        {
            name: 'swap',
            duration: 800
        }
    ];

    let filteredEffects = effects.slice(0, effectsCount).map(i => i);

    return filteredEffects;
}

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
        let profile = AuthController.profile(req, res);
        const options = {
            fps: 25,
            transition: true,
            transitionDuration: 1,
            videoBitrate: 1024,
            videoCodec: "libx264",
            /*audioBitrate: '128k',
            audioChannels: 2,
            audioCodec:'libmp3lame',*/
            size: "640x?",
            format: "mp4",
            /*subtitleStyles: {
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
            }*/
        }

        // const images = req.body.images;
    	var path = publicPath + '/media/videos/1583248332370';

        if (!fs.existsSync(path)){
            fs.mkdirSync(path, '0777', true);
        }

        // fs.chmodSync(__dirname, '0777');
        // fs.readFile(__dirname + '/2-1583305177353-img.JPEG', (file) => {


            // console.log(file);
        	videoshow([publicPath + '/media/images/1583305176725/1-1583305177608-img.JPEG'], options)
            // .audio(req.body.audio)
            .save(path + '/' + Date.now() + "-video.mp4")
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
        // });

    },

    dynamicTextImage: (req, res) => {

        let requestParams = req.body.data;
        let profile = AuthController.profile(req, res);

        let folderName = Date.now() + profile.id + Math.floor(Math.random() * 1000);
        let uploadedPath = publicPath + '/media/images/' + folderName;
        let distinations = uploadedPath;

        if (!fs.existsSync(distinations)){
            fs.mkdirSync(distinations);
        }

        requestParams.forEach((params) => {
            createImage(params, distinations);
        });

        res.send('Images created successfully in ' + distinations);
    },

    convertImgToMp4: (req, res) => {

        let imgFolder = req.body.folder_name;
        let directoryPath = publicPath + '/media/images/' + imgFolder;
        let profile = AuthController.profile(req, res);

        let folderName = Date.now() + profile.id + Math.floor(Math.random() * 1000);
        let uploadedPath = publicPath + '/media/videos/' + folderName;
        let distinations = uploadedPath;

        if (!fs.existsSync(distinations)){
            fs.mkdirSync(distinations, '0777', true);
        }

        let images = [];

        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }

            files.forEach((file, index) => {
                imgPath = [publicPath + '/media/images/'+ imgFolder + '/' + file];
                createVideo(imgPath, distinations, index);
            })

            res.send('Video converted in ' + distinations);
        });
    },

    mergeVideos: (req, res) => {

        let folderName = req.body.folder_name;


        let directoryPath = publicPath + '/media/videos/' + folderName;

        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }

            let videos = files.map((file) => directoryPath + '/'+ file);
            let transitionsEffect = getTransitionsEffects(videos.length);

            concat({
                output: publicPath + '/media/videos/' + folderName + '/' + folderName + '.mp4',
                videos: videos,
                transitions: transitionsEffect
            });
        });
    },

    addAudioInVideo : (req, res) => {
        ffmpeg()
          .input('https://storage.googleapis.com/facebook-dev-b3b9/dev/YSHhv1583248817SkY23.mp4')
          .input('https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3')
          .audioCodec('libmp3lame')
          .save('demo.mp4')
    }

}