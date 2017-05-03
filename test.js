var tape = require('tape')
var from = require('from2')
var concat = require('concat-stream')
var multi = require('./')

tape('reads from both streams', function (t) {
  var a = from.obj(['a1', 'b1', 'c1'])
  var b = from.obj(['a2', 'b2', 'c2'])

  var rs = multi.obj([a, b])

  rs.pipe(concat({encoding: 'list'}, function (list) {
    t.same(list.sort(), ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'], 'multi output')
    t.end()
  }))
})

tape('reads from both streams different size', function (t) {
  var a = from.obj(['a1'])
  var b = from.obj(['a2', 'b2', 'c2'])

  var rs = multi.obj([a, b])

  rs.pipe(concat({encoding: 'list'}, function (list) {
    t.same(list.sort(), ['a1', 'a2', 'b2', 'c2'], 'multi output')
    t.end()
  }))
})

tape('one can be slow', function (t) {
  var once = true
  var a = from.obj(function (size, cb) {
    setTimeout(function () {
      if (once) {
        once = false
        cb(null, 'slow')
      } else {
        cb(null, null)
      }
    }, 200)
  })

  var b = from.obj(['fast1', 'fast2', 'fast3'])
  var rs = multi.obj([a, b])
  rs.pipe(concat({encoding: 'list'}, function (list) {
    t.same(list, ['fast1', 'fast2', 'fast3', 'slow'], 'multi output')
    t.end()
  }))
})

tape('add later', function (t) {
  var a = from.obj(['a1'])
  var b = from.obj(['a2', 'b2', 'c2'])

  var rs = multi.obj([b])

  rs.once('data', function () {
    rs.add(a)
  })

  rs.pipe(concat({encoding: 'list'}, function (list) {
    t.same(list.sort(), ['a1', 'a2', 'b2', 'c2'], 'multi output')
    t.end()
  }))
})

tape('remove existing', function (t) {
  var a = from.obj(['a1'])
  var b = from.obj(['a2', 'b2', 'c2'])

  var rs = multi.obj([a, b])
  rs.remove(a)

  rs.pipe(concat({encoding: 'list'}, function (list) {
    t.same(list, ['a2', 'b2', 'c2'], 'multi output')
    t.end()
  }))
})

tape('remove non-existing', function (t) {
  var a = from.obj(['a1'])
  var b = from.obj(['a2', 'b2', 'c2'])

  var rs = multi.obj([b])
  rs.remove(a)

  rs.pipe(concat({encoding: 'list'}, function (list) {
    t.same(list, ['a2', 'b2', 'c2'], 'multi output')
    t.end()
  }))
})
