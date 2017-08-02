const http = require('http')
const url = require('url')
const makeSeeker = require('./seeker')

function findByQuery (q, res, request) {
  const seeker = makeSeeker(request)

  const reqUrl = {
    base: 'https://www.googleapis.com',
    place: 'customsearch/v1'
  }

  const query = {
    cx: process.env.GOOGLE_SEARCH_ID || require('./../config').cx,
    key: process.env.GOOGLE_API_KEY || require('./../config').key,
    searchType: 'image'
  }

  const values = obj => Object.keys(obj).map(k => `${k}=${obj[k]}`)
  const searchUrl = values(reqUrl).join('/')
  const searchQuery = values(query).join('&')
  const path = searchUrl + '?' + searchQuery + `&q=${q}`
  console.log('path is: ', path)

  seeker(path, (err, data) => {
    if (err) {
      res.writeHead(err.status, err.message)
      res.end()
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

function makeServer (request) {
  return http.createServer((req, res) => {
    const route = url.parse(req.url, true)

    if (route.pathname === '/api') {
      return findByQuery(route.query.q, res, request)
    }

    if (route.pathname === '/latest') {
      return latestQueries(res)
    }

    return usageInfo(res)
  })
}

module.exports = makeServer
