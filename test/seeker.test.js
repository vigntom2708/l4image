import test from 'ava'
import request from 'superagent'
import config from './../superagent-mock.config'
import mock from 'superagent-mock'
import makeSeeker from './../lib/seeker'

(function testSearcher () {
  const seeker = makeSeeker(request)
  const searchUrl = 'https://www.googleapis.com/customsearch/v1?q=search+string'

  test.cb.before('Setup superagent mock', t => {
    mock(request, config)
    t.end()
  })

  test.cb('test request errors', t => {
    seeker(searchUrl, (err, data) => {
      t.ifError(err, "Errors aren't allowed")
      t.end()
    })
  })

  test.cb('There are search results', t => {
    seeker(searchUrl, (_, data) => {
      t.true(Array.isArray(data))
      t.truthy(data[0])
      t.end()
    })
  })

  test.cb('There is the alt text', t => {
    seeker(searchUrl, (_, data) => {
      t.truthy(data[0].alt)
      t.end()
    })
  })

  test.cb('There is the image url', t => {
    seeker(searchUrl, (_, data) => {
      t.truthy(data[0].imageUrl)
      t.end()
    })
  })

  test.cb('There is the page url', t => {
    seeker(searchUrl, (_, data) => {
      t.truthy(data[0].pageUrl)
      t.end()
    })
  })
}())
