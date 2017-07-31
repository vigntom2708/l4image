const server = require('./lib/server')

const port = process.env.PORT || 5000

function onError (e, socket) {
  console.log('ERROR: ', e.message)
  socket.end('HTTP/1.1 400 Bad Request')
}

server.listen(port).on('error', onError)
