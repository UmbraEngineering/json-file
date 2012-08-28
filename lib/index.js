
var fs    = require('fs');
var path  = require('path');

var File = exports.File = function(filePath) {
	this.indent  = null;
	this.data    = void(0);
	this.path    = path.normalize(filePath);
};

File.prototype.read = function(callback) {
	fs.readFile(this.path
};

