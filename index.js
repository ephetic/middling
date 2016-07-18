/**
 * Expors function to chain a give list or 
 * splat of middleware functions.
 *
 * @param {Array(Function)|Function...}
 * @return {Function} fn(req, res, next)
 */
module.exports = function () {
  var fns = args(arguments)
  return function (req, res, next) {
    var ix = 0
    inner()

    function inner(err) {
      var fn = fns[ix++]
      if (err || !fn) 
        return next && next(err)
      fn(req, res, inner)
      if (fn.length === 2) inner()
    }
  }
}

function args (params) {
  return (params[0] instanceof Array
    ? params[0] 
    : Array.apply(null, params));
}