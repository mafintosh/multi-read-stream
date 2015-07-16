# multi-read-stream

Readable stream that reads from multiple readable streams at the same time

```
npm install multi-read-stream
```

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
