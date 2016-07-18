# middling
a tiny middleware chainer

---

Middling is a simple middleware handler in the style of functional composition (chaining really).  Middleware is considered any function with this signature:

```function (request, response[, ...][, next]) { /* ... */ }```

- If the last argument is a function, it treated as an asynchronous next signal.  (Thus synchronous and asynchronous middleware functions can be mixed).  
- The function returned by `middling` itself has the signature above, so middling chains can be combined with middling.

Middling was created for use with `http-hash-router` for small, light-weight projects (i.e. without the bajillion popular mature ways to solve this problem).

```// Example TBD```