import req2Server from 'supertest'
import request from 'superagent'
import test from 'ava'
import server from './../lib/server'
import config from './../superagent-mock.config'
import mock from 'superagent-mock'

const saMock = mock(request, config)

function testHeaderAndNoError (reqUrl) {
  test.cb('There are no errors', t => {
    req2Server(server).get(reqUrl)
      .end((err, res) => {
        t.ifError(err, "Errors aren't allowed")
        t.end()
      })
  })

  test.cb('Expect json response', t => {
    req2Server(server).get(reqUrl)
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end((_, res) => {
        t.end()
      })
  })
}

;(function testEmptyRequest () {
  const reqUrl = '/'

  testHeaderAndNoError(reqUrl)

  test.cb('Expect usage info when emtpy request', t => {
    req2Server(server).get(reqUrl)
      .end((_, res) => {
        t.truthy(res.body.warning, 'Wrong request!')
        t.regex(res.body.use, /^Use:\s.*/, 'Help message starts with Use')
        t.end()
      })
  })
}())

;(function testSearchRequest () {
  const reqUrl = '/api?q=search%20query'

  testHeaderAndNoError(reqUrl)

  test.cb('Expect array as response', t => {
    req2Server(server).get(reqUrl)
      .end((_, res) => {
        t.true(Array.isArray(res.body))
        t.end()
      })
  })

  test.cb('Expect respect for the num parameter', t => {
    req2Server(server).get(reqUrl + '&num=1')
      .end((_, res) => {
        t.true(res.body.length === 1)
        t.end()
      })
  })

  test.cb('Expect respect for the offset parameter', t => {
    function notDeepEqualWithOffsetN (data, offset) {
      req2Server(server).get(reqUrl + `&num=1&offset=${offset}`)
        .end((_, res) => {
          t.notDeepEqual(data, res.body)
          t.end()
        })
    }

    req2Server(server).get(reqUrl + '&num=1&offset=1')
      .end((_, res) => {
        return notDeepEqualWithOffsetN(res.body, 2)
      })
  })
}())

;(function testLatestRequest () {
  const reqUrl = '/latest'

  testHeaderAndNoError(reqUrl)

  test.cb('Expect Array as result', t => {
    req2Server(server).get(reqUrl)
      .end((_, res) => {
        t.true(Array.isArray(res.body))
        t.end()
      })
  })
}())

test.cb.after(t => {
  saMock.unset()
  t.end()
})
