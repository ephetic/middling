'use strict'
const rewire = require('rewire')
const tape = require('tape')

const midl = rewire('../')

tape('it behaves well with no fns provided', t => {
  t.plan(1)
  const chain = midl()
  chain(null, null, () => {
    t.pass('nothing bad happened')
    t.end()
  })
})

tape('it accepts [fns] and fns...', t => {
  const args = midl.__get__('desplat')
  const fns = [() => {}, () => {}]
  t.deepEquals(args(fns), args.call(null, fns), 'it should have converted splat to array')
  t.end()
})

tape('it calls fns in order', t => {
  t.plan(4)
  const fn1 = (req, res, next) => { 
    t.notOk(res.fn2Called, 'fn2 should not have been called first')
    res.fn1Called = true; 
    next()
  }
  const fn2 = (req, res, next) => { 
    t.ok(res.fn1Called, 'fn1 should have been called first')
    res.fn2Called = true; 
    next()
  }
  const chain = midl(fn1, fn2)
  const res = {}
  chain({}, res, () => {
    t.ok(res.fn1Called, 'fn1 should have been called')
    t.ok(res.fn2Called, 'fn2 should have been called')
    t.end()
  })
})

tape('it should abort the chain on err', t => {
  t.plan(3)
  const fn1 = (req, res, next) => { 
    t.notOk(res.fn2Called, 'fn2 should not have been called first')
    res.fn1Called = true; 
    next(true)
  }
  const fn2 = (req, res, next) => { 
    t.fail('fn2 should never be called')
    next()
  }
  const chain = midl(fn1, fn2)
  const res = {}
  chain({}, res, () => {
    t.ok(res.fn1Called, 'fn1 should have been called')
    t.notOk(res.fn2Called, 'fn2 should not have been called')
    t.end()
  })
})

tape('it can chain chains', t => {
  t.plan(2)
  const c1 = midl()
  const c2 = midl((req, res, next) => { res.c2 = (res.c2||0) + 1; next() })
  const c3 = midl((req, res, next) => { res.c3 = (res.c3||0) + 1;; next() })

  const chain = midl(c2, c1, c3)
  const res = {}
  chain({}, res, () => {
    t.equals(res.c2, 1, 'c2 should have been run once')
    t.equals(res.c3, 1, 'c3 should have been run once')
    t.end()
  })

})

tape('it treats fns as synchronous if next is omitted', t => {
  t.plan(4)
  const fn1 = (req, res, next) => { 
    t.notOk(res.fn2Called, 'fn2 should not have been called first')
    res.fn1Called = true; 
    next()
  }
  const fn2 = (req, res) => { 
    t.ok(res.fn1Called, 'fn1 should have been called first')
    res.fn2Called = true; 
  }
  const chain = midl(fn1, fn2)
  const res = {}
  chain({}, res, () => {
    t.ok(res.fn1Called, 'fn1 should have been called')
    t.ok(res.fn2Called, 'fn2 should have been called')
    t.end()
  })})