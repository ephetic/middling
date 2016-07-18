/**
 * Expors function to chain a give list or 
 * splat of middleware functions.
 *
 * @param {Array(Function)|Function...}
 * @return {Function} fn(req, res, done)
 */
module.exports = function () {
  var fns = desplat(arguments)
  return function () {
    var args = Array.apply(null, arguments)
    if (args[args.length - 1] instanceof Function)
      var done = once(args.pop())
    var ix = 0
    next()

    function next(err) {
      var fn = fns[ix++]
      if (err || !fn) return done && done(err)

      fn.apply(null, args.concat(next))
      if (fn.length <= args.length) next()
    }
  }
}

function desplat (params) {
  return params[0] instanceof Array
    ? params[0] 
    : Array.apply(null, params);
}

function once (fn) {
  var called = false
  return function() {
    if (called) return
    called = true
    fn.apply(null, arguments)
  }
}