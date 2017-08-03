const http = require('http')
const url = require('url')
const seeker = require('./seeker')

function findByQuery ({q, offset = 1, num = 10}, res) {
  const baseUrl = 'https://www.googleapis.com/customsearch/v1'

  const baseQuery = {
    cx: process.env.GOOGLE_SEARCH_ID || require('./../config').cx,
    key: process.env.GOOGLE_API_KEY || require('./../config').key,
    searchType: 'image'
  }

  const start = (offset - 1) * num + 1
  const queryObj = Object.assign({}, baseQuery, { q, start, num })
  const query = Object.keys(queryObj).map(key => `${key}=${queryObj[key]}`)
  const searchUrl = baseUrl + '?' + query.join('&')

  seeker(searchUrl, (err, data) => {
    if (err) {
      console.error('error: ', err)
      res.writeHead(err.status || 500)
      return res.end(err.message)
    }

    const result = JSON.stringify(data)

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(result)
    })

    return res.end(result)
  })
}

function usageInfo (res, message) {
  const info = JSON.stringify({
    warning: message || 'Wrong request!',
    use: 'Use: https://vgm-l4image/{ api?q=<query> | latest }',
    example1: 'https://vgm-l4image/api?q=Uzumaki+Naruto',
    example2: 'https://vgm-l4image/latest'
  })

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(info)
  })

  return res.end(info)
}

function latestQueries (res) {
  const data = JSON.stringify([])

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  })

  return res.end(data)
}

module.exports = http.createServer((req, res) => {
  const route = url.parse(req.url, true)

  if (route.pathname === '/api') {
    return findByQuery(route.query, res)
  }

  if (route.pathname === '/latest') {
    return latestQueries(res)
  }

  return usageInfo(res)
})
