var json       = require('./')
  , assert     = require('assert')
  , inputFile  = './test/input.json'
  , outputFile = './test/tmp/output.json'
  , expected   = require('./test/expected.json')
  , input      = require(inputFile)
  , inFile     = new json.File(inputFile)
  , outFile    = new json.File(outputFile)
  , doneInput  = false
  , doneOutput = false
  ;

// Input tests
inFile.read(function()
{
  assert.deepEqual(input.foo, inFile.get('foo'));
  assert.deepEqual(input.foo.bar.baz, inFile.get('foo.bar.baz'));
  assert.deepEqual(input.foo['bar.baz'], inFile.get('foo[bar.baz]'));
  doneInput = true;
});

// Output tests
outFile.set('foo', 'bar');
outFile.set('a.b.c', 'baz');
outFile.set('a[b.c]', 'baz');

outFile.set('x', 'foo for x')
      .set('y', 'bar for y')
      .set('z', 'baz for z')
      .set('[x.y.z]', 'boom for [x.y.z]')
      ;

outFile.write(function()
{
  // done writing, compare
  assert.deepEqual(expected, require(outputFile));
  doneOutput = true;
});

process.on('exit', function()
{
  assert.ok(doneInput, 'input tests has not passed');
  assert.ok(doneOutput, 'output tests has not passed');
});
