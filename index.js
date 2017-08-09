const server = require('./lib/server')
const throng = require('throng')

const port = process.env.PORT || 5000
const workers = process.env.WEB_CONCURRENCY || 1

throng({
  workers,
  start: start
})

function start (id) {
  console.log(`Started worker ${id}`)

  process.on('SIGTERM', () => {
    console.log(`Worker ${id} exiting`)
    process.exit()
  })

  function onError (e, socket) {
    console.error('ERROR: ', e.message)
    socket.end('HTTP/1.1 400 Bad Request')
  }

  server.listen(port).on('error', onError)
}

process.on('SIGTERM', () => {
  console.log('SIGTERM')
})
