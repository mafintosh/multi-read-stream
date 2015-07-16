# multi-read-stream

Readable stream that reads from multiple readable streams at the same time.
If you are looking for a readable stream that reads *sequentially* from other streams checkout [multistream](https://github.com/feross/multistream)

```
npm install multi-read-stream
```

[![build status](http://img.shields.io/travis/mafintosh/multi-read-stream.svg?style=flat)](http://travis-ci.org/mafintosh/multi-read-stream)

## Usage

``` js
var from = require('from2')
var multi = require('multi-read-stream')

var rs = multi.obj([
  from.obj([{hello: 'world'}]),
  from.obj([{hej: 'verden'}])
])

rs.on('data', function (data) {
  console.log(data) // {hello: 'world'} or {hej: 'verden'}
})

rs.on('end', function () {
  console.log('(no more data)')
})
```

## API

#### `stream = multi(arrayOfReadableStreams, [options])`

Create a new multi read stream. Options are forwarded to the
stream constructor.

#### `objStream = multi.obj(arrayOfReadableStreams, [options])`

Same as above but sets `objectMode = true`

## License

MIT
