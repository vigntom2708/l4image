const http = require('http')
const url = require('url')

function findByQuery (q, res) {
  const data = JSON.stringify([])

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  })

  return res.end(data)
}

function usageInfo (res) {
  const info = JSON.stringify({
    warning: 'Wrong request!',
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
    return findByQuery(route.query.q, res)
  }

  if (route.pathname === '/latest') {
    return latestQueries(res)
  }

  return usageInfo(res)
})
