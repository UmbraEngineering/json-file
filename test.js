var json       = require('./')
  , assert     = require('assert')
  , inputFile  = './test/input.json'
  , outputFile = './test/tmp/output.json'
  , updateFile = './test/tmp/update.json'
  , expected   = require('./test/expected.json')
  , input      = require(inputFile)
  , inFile     = new json.File(inputFile)
  , outFile    = new json.File(outputFile)
  , upFile     = new json.File(updateFile)
  , doneInput  = false
  , doneOutput = false
  , doneUpdate = false
  ;

// Input tests
inFile.read(function(err)
{
  assert.ifError(err);
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

outFile.write(function(err)
{
  assert.ifError(err);
  // done writing, compare
  assert.deepEqual(expected, require(outputFile));
  doneOutput = true;
});

// Update tests
upFile.update(function(err, save)
{
  assert.ifError(err);

  assert.deepEqual(input.foo, this.get('foo'));
  assert.deepEqual(input.foo.bar.baz, this.get('foo.bar.baz'));
  assert.deepEqual(input.foo['bar.baz'], this.get('foo[bar.baz]'));

  // remove existing keys
  this.del('foo.bar.baz');
  assert.deepEqual(input.foo['bar.baz'], this.get('foo[bar.baz]'));

  this.del('foo[bar.baz]');
  assert.deepEqual({bar:{}}, this.get('foo'));

  this.del('foo');

  // add new items
  this.set('foo', 'bar');
  this.set('a.b.c', 'baz');
  this.set('a[b.c]', 'baz');

  this.set('x', 'foo for x')
        .set('y', 'bar for y')
        .set('z', 'baz for z')
        .set('[x.y.z]', 'boom for [x.y.z]')
        ;

  // save the changes
  save(function(err)
  {
    assert.ifError(err);
    // compare saved
    assert.deepEqual(expected, require(updateFile));
    doneUpdate = true;
  });
});

// almost done
process.on('exit', function()
{
  assert.ok(doneInput, 'input tests have not passed');
  assert.ok(doneOutput, 'output tests have not passed');
  assert.ok(doneUpdate, 'update tests have not passed');
});
