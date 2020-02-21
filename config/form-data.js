const os = require("os");

const formDataOptions = {
	uploadDir: os.tmpdir(),
	autoClean: true
};

module.exports = formDataOptions;
