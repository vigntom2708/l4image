require('dotenv').config()

const { MongoClient } = require('mongodb')

const nodeEnv = process.env.NODE_ENV
const mongoURL = process.env[`MONGO_URL_${nodeEnv.toUpperCase()}`]

if (!mongoURL) {
  console.error('MongoDB url not defined!')
  process.exit(1)
}

if (nodeEnv !== 'production') {
  createDB('development')
  createDB('test')
  process.exit(0)
}

createDB('production')

process.exit(0)

function createDB (appEnv) {

}
