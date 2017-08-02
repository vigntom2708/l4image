import req2Server from 'supertest'
import request from 'superagent'
import test from 'ava'
import server from './../lib/server'
import config from './../superagent-mock.config'
import mock from 'superagent-mock'

const searchUrl = '/api?q=search%20string'

test.cb.before('Setup mock', t => {
  mock(request, config)
  t.end()
})

function requestAndTest (title, route, task) {
  test.cb(title, t => {
    req2Server(server(request))
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

requestAndTest('Search Request', '/api?q=search%20query', (t, res) => {
  t.true(Array.isArray(res.body))
})

requestAndTest('Show latest search queries', '/latest', (t, res) => {
  t.true(Array.isArray(res.body))
})

test.cb('Test pagination', t => {
  function resultsNotDeepEqual (offset, num, expected) {
    req2Server(server(request)).get(searchUrl + `&offset=${offset}&num=${num}`)
      .end((_, res) => {
        t.notDeepEqual(res.body, expected)
        t.end()
      })
  }

  req2Server(server(request)).get(searchUrl)
    .end((_, res) => {
      resultsNotDeepEqual(2, 1, res.body)
    })
})
