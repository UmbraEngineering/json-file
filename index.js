var fs = require('fs');
var path = require('path');
var findWhitespace = /^(\s+)/;

var File = exports.File = function(filePath) {
  this.path = path.normalize(filePath);
};

exports.read = function(filePath, callback) {
  var file = new File(filePath);
  if (callback) {
    file.read(callback);
  } else {
    file.readSync();
  }
  return file;
};

File.prototype.data = undefined;
File.prototype.indent = null;

// ------------------------------------------------------------------
//  File I/O

/**
 * Combines read/write method and creates new file
 * if one doesn't exist
 *
 * @param {function} callback - invoked when file's been read into object
 */
File.prototype.update = function(callback) {
  this.read(function(err, json) {
    // ignore nonexistent file error
    if (err && err.code != 'ENOENT') {
      return callback.call(this, err);
    }

    // invoke callback within file instance
    // with `write` function as `save` callback
    callback.call(this, null, this.write.bind(this));
  }.bind(this));
};

File.prototype.updateSync = function(callback) {
  var content;

  try {
    content = fs.readFileSync(this.path, 'utf8');
  } catch (e) {
    if (e.code != 'ENOENT') throw e;
    content = '{}';
  }

  this._processJson(content);
};

File.prototype.read = function(callback) {
  fs.readFile(this.path, 'utf8', this._afterRead.bind(this, callback));
};

File.prototype._afterRead = function(callback, err, json) {
  if (err) {
    return callback(err);
  }
  this._processJson(json);
  callback();
};

File.prototype.readSync = function() {
  this._processJson(
    fs.readFileSync(this.path, 'utf8')
  );
};

File.prototype._processJson = function(json) {
  this.data = JSON.parse(json);
  this.indent = determineWhitespace(json);
};

File.prototype.write = function(callback, replacer, space) {
  var space = space || this.indent,
    json = JSON.stringify(this.data, replacer, space);
  fs.writeFile(this.path, json, callback);
};

File.prototype.writeSync = function(replacer, space) {
  var space = space || this.indent,
    json = JSON.stringify(this.data, replacer, space);
  fs.writeFileSync(this.path, json);
};

// ------------------------------------------------------------------
//  Property editing

File.prototype.get = function(key) {
  return this._resolve(key, function(scope, key, value) {
    return value;
  });
};

File.prototype.set = function(key, value) {
  this._resolve(key, function(scope, key) {
    scope[key] = value;
  });
  return this;
};

/**
 * Remove key from the object
 *
 * @param   {mixed} key - key to delete
 * @returns {File} returns itself for chaining
 */
File.prototype.del = function(key) {
  this._resolve(key, function(scope, key) {
    delete scope[key];
  });
  return this;
};

// Has a callback, but is NOT async
File.prototype._resolve = function(key, callback) {
  var current, parseable, keys, lastKey;

  // init top node
  this.data = this.data || {};

  // get slider reference
  current = this.data;

  // separate for traversable and non-traversable parts
  parseable = key.split(/\[(.*)\]/, 2);

  // get traversable keys
  keys = parseable[0] ? parseable[0].split('.') : [];

  // last key or non-traversable part
  lastKey = parseable[1] || keys.pop();

  // traverse
  keys.forEach(function(key) {

    // if key doesn't exist (or not referencing object), create it as empty object
    if (typeof current[key] != 'object') {
      current[key] = {};
    }

    // go deeper
    current = current[key];
  });

  return callback(current, lastKey, current[lastKey]);
};

// ------------------------------------------------------------------

function determineWhitespace(contents) {
  var whitespace = 0;
  contents = contents.split('\n');
  for (var i = 0, c = contents.length; i < c; i++) {
    var match = findWhitespace.exec(contents);
    if (match && typeof match[1] === 'string') {
      if (match[1][0] === '\t') {
        whitespace = '\t';
        break;
      } else if (match[1].length < whitespace || ! whitespace) {
        whitespace = match[1].length;
      }
    }
  }
}
