const http = require('http')
const url = require('url')

module.exports = http.createServer((req, res) => {
  const route = url.parse(req.url, true)

  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.write('404 Not found')
  return res.end()
})
