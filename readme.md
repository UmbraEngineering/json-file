# jsonfile2

A Node.js module for reading/modifying/writing JSON files. Based on [json-file](http://www.npmjs.com/package/json-file]).

[![Build Status](https://travis-ci.org/alexindigo/jsonfile2.svg)](https://travis-ci.org/alexindigo/jsonfile2)

## Install

```bash
$ npm install --save jsonfile2
```

## Usage

```javascript
var json = require('jsonfile2');

// Load a JSON file
var file = json.read('./package.json');

// Read and write some values
file.get('version');  // eg. "1.0.0"
file.get('repository.type');  // eg. "git"
file.set('description', 'Some new description');

// The raw data
console.log(file.data);

// Write the updates to the file
file.writeSync();
```

## API

#### json.read ( String filePath[, Function callback ])

A shortcut for creating a `json.File` object and loading the file contents.

```javascript
// This...
var file = json.read('/a/b/c');

// Is equivilent to this...
var file = new json.File('/a/b/c');
file.readSync();

// Likewise, this...
var file = json.read('/a/b/c', function() {
  // ...
});

// Is equivilent to this...
var file = new json.File('/a/b/c');
file.read(function() {
  // ...
});
```
#### json.File ( String filePath )

JSON File object constructor. Takes a path to a JSON file.

```javascript
var file = new json.File('/path/to/file.json');
```

#### File::read ( Function callback )

Reads the JSON file and parses the contents.

```javascript
file.read(function(err) {
  // Now you can do things like use the .get() and .set() methods
});
```
#### File::readSync ( void )

Reads the JSON file and parses the contents synchronously.

#### File::write ( Function callback )

Write the new contents back to the file.

```javascript
file.write(function(err) {
  // Your JSON file has been updated
});
```

#### File::writeSync ( void )

Write the new contents back to the file synchronously.

#### File::update ( Function callback )

Reads the JSON file and parses the contents,
will not error if file doesn't exist.
In that case file will be created upon save.
All other errors will propagate.

*Note: `callback` function will be called within context of the jsonFile object.*

```javascript
file.update(function(err, save) {
  // Now you can do things like use the .get() and .set() methods
  this.get('a.b');
  this.set('[c.d]', 25);
  save();
});
```
#### File::updateSync ( void )

Reads the JSON file and parses the contents synchronously,
same as async sibling doesn't throw on non-existent file.
(Will throw on all other errors).

```javascript
file.updateSync();
// Now you can do things like use the .get() and .set() methods
file.get('a.b');
file.set('[c.d]', 25);

file.writeSync();
```

#### File::get ( Mixed key )

Get a value from the JSON data.

```javascript
file.get('foo'); // === file.data['foo']
file.get('foo.bar.baz'); // === file.data['foo']['bar']['baz']
file.get('foo[bar.baz]'); // === file.data['foo']['bar.baz']
```

#### File::del ( Mixed key )

Delete a key from the JSON data.

```javascript
file.del('foo'); // file.data['foo'] branch will be removed
file.del('foo.bar.baz'); // file.data['foo']['bar']['baz'] node will be removed
file.del('foo[bar.baz]'); // file.data['foo']['bar.baz'] node will be removed
```

#### File::set ( Mixed key, Mixed value )

Set a value in the JSON data.

```javascript
file.set('foo', 'bar');
file.set('a.b.c', 'baz');
file.set('a[b.c]', 'baz');
```

The `set` method returns the file object itself, so this method can be chained.

```javascript
file.set('a', 'foo')
    .set('b', 'bar')
    .set('c', 'baz');
```
