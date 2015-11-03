var stream = require('readable-stream')
var util = require('util')

module.exports = MultiRead

function MultiRead (streams, opts) {
  if (!(this instanceof MultiRead)) return new MultiRead(streams, opts)
  stream.Readable.call(this, opts)

  this.streams = streams
  this.destroyed = false

  this._finalize = !opts || opts.end !== false
  this._ptr = 0
  this._forward = false
  this._add = add

  var self = this
  streams.forEach(add)

  function add (s) {
    s.on('readable', onreadable)
    s.on('error', onerror)
    s.on('close', onclose)
    s.on('end', onend)
  }

  function onend () {
    self.remove(this)
  }

  function onclose () {
    self.destroy()
  }

  function onerror (err) {
    self.destroy(err)
  }

  function onreadable () {
    if (self._forward) self._read()
  }
}

util.inherits(MultiRead, stream.Readable)

MultiRead.obj = function (streams, opts) {
  if (!opts) opts = {}
  opts.objectMode = true
  return new MultiRead(streams, opts)
}

MultiRead.prototype.finalize = function () {
  this.push(null)
}

MultiRead.prototype.remove = function (stream) {
  var i = this.streams.indexOf(stream)
  this.streams.splice(i, 1)
  if (i < this._ptr) this._ptr--
  if (!this.streams.length && this._finalize) this.finalize()
}

MultiRead.prototype.add = function (stream) {
  this.streams.push(stream)
  this._add(stream)
  if (this._forward) this._read()
}

MultiRead.prototype.destroy = function (err) {
  if (this.destroyed) return
  this.destroyed = true

  for (var i = 0; i < this.streams.length; i++) {
    if (this.streams[i].destroy) this.streams[i].destroy()
  }

  if (err) this.emit('error', err)
  this.emit('close')
}

MultiRead.prototype._read = function () {
  var forward = true
  var more = true
  var length = this.streams.length // we need to save this as onend mutates the list

  while (more) {
    more = false
    for (var i = 0; i < length; i++) {
      if (this._ptr >= this.streams.length) this._ptr = 0
      var stream = this.streams[this._ptr++]
      var data = stream.read()
      if (!data) continue
      more = forward = this.push(data)
    }
  }

  this._forward = forward
}
