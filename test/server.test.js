import request from 'supertest'
import test from 'ava'
import server from './../lib/server'

test(t => {
  t.true(true)
})

function requestAndTest (title, route, task) {
  test.cb(title, t => {
    request(server)
      .get(route)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .end((err, res) => {
        t.ifError(err, "Errors aren't allowed")
        task(t, res)
        t.end()
      })
  })
}

requestAndTest('Empty Request', '/', (t, res) => {
  t.truthy(res.body.warning, 'Wrong request!')
  t.regex(res.body.use, /^Use:\s.*/, 'Help message starts with Use:')
})

requestAndTest('Search Request', '/api?q=search+query', (t, res) => {
  t.true(Array.isArray(res.body))
})

requestAndTest('Show latest search queries', '/latest', (t, res) => {
  t.true(Array.isArray(res.body))
})
