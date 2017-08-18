import {} from 'dotenv/config'
import req2Server from 'supertest'
import request from 'superagent'
import test from 'ava'
import server from './../lib/server'
import config from './../superagent-mock.config'
import mock from 'superagent-mock'
import Query from './../model/query'

const saMock = mock(request, config)

test.cb.after(t => {
  saMock.unset()
  t.end()
})

test.cb.after(t => {
  Query.collection.drop()
  t.end()
})

function testHeaderAndNoError (title, reqUrl) {
  test.cb(`${title}: There are no errors`, t => {
    req2Server(server).get(reqUrl)
      .end((err, res) => {
        t.ifError(err, "Errors aren't allowed")
        t.end()
      })
  })

  test.cb(`${title}: Expect json response`, t => {
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

  testHeaderAndNoError('Empty Request', reqUrl)

  test.cb('Expect usage info when emtpy request', t => {
    req2Server(server).get(reqUrl)
      .end((_, res) => {
        t.truthy(res.body.warning, 'Wrong request!')
        t.truthy(res.body.use)
        t.truthy(res.body.options)
        t.truthy(res.body.example1)
        t.end()
      })
  })
}())

;(function testSearchRequest () {
  const reqUrl = '/api?q=search+query'

  testHeaderAndNoError('Search Request', reqUrl)

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
        notDeepEqualWithOffsetN(res.body, 2)
      })
  })
}())

;(function testLatestRequest () {
  const reqUrl = '/latest'

  testHeaderAndNoError('Latest Request', reqUrl + '1')

  test.cb('Expect Array as result', t => {
    req2Server(server).get(reqUrl)
      .end((_, res) => {
        t.true(Array.isArray(res.body))
        t.end()
      })
  })
}())
