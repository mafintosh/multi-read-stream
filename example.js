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
