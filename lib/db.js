const mongoose = require('mongoose')

const nodeEnv = process.env.NODE_ENV
const dbURL = process.env[`MONGO_URL_${nodeEnv.toUpperCase()}`]

if (!dbURL) {
  console.error('Mongodb url is not defined!')
}

mongoose.connect(dbURL, {
  useMongoClient: true,
  keepAlive: 120
})

mongoose.connection.on('connected', () => {
  console.log(`Mongoose (${nodeEnv}) connection opened`)
})

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose (${nodeEnv}) connection error: ${err.message}`)
})

mongoose.connection.on('disconnected', () => {
  console.log(`Mongoose (${nodeEnv}) connection disconnected`)
})

process.on('SIGTERM', () => {
  mongoose.connection.close(() => {
    console.log(`Mongoose (${nodeEnv}) connection terminated`)
    process.exit(0)
  })
})
