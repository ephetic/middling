'use strict'
const rewire = require('rewire')
const tape = require('tape')

const midl = rewire('../')

tape('it behaves well with no fns provided', t => {
  const chain = midl()
  chain(null, null, () => {
    t.pass('nothing bad happened')
    t.end()
  })
})

tape('it accepts [fns] and fns...', t => {
  const args = midl.__get__('args')
  const fns = [() => {}, () => {}]
  t.deepEquals(args(fns), args.call(null, fns), '===')
  t.end()
})

tape('it calls fns in order', t => {
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
  const c1 = midl()
  const c2 = midl((req, res, next) => { res.c2 = true; next() })
  const c3 = midl((req, res, next) => { res.c3 = true; next() })

  const chain = midl(c2, c1, c3)
  const res = {}
  chain({}, res, () => {
    t.ok(res.c2, 'c2 should have been run')
    t.ok(res.c3, 'c3 should have been run')
    t.end()
  })

})

tape('it treats fns as synchronous if next is omitted', t => {
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