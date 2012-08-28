# json-file

A Node.js module for reading/modifying/writing JSON files.

## Install

```bash
$ npm install json-file
```

## Usage

```javascript
var json = require('json-file');

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
file.read(function() {
	//
	// Now you can do things like use the .get() and .set() methods
	//
});
```
#### File::readSync ( void )

Reads the JSON file and parses the contents synchronously.

#### File::write ( Function callback )

Write the new contents back to the file.

```javascript
file.write(function() {
	//
	// Your JSON file has been updated
	//
});
```

#### File::writeSync ( void )

Write the new contents back to the file synchronously.

#### File::get ( Mixed key )

Get a value from the JSON data.

```javascript
file.get('foo'); // === file.data['foo']
file.get('foo.bar.baz'); // === file.data['foo']['bar']['baz']
```

#### File::set ( Mixed key, Mixed value )

Set a value in the JSON data.

```javascript
file.set('foo', 'bar');
file.set('a.b.c', 'baz');
```

The `set` method returns the file object itself, so this method can be chained.

```javascript
file.set('a', 'foo')
    .set('b', 'bar')
    .set('c', 'baz');
```

