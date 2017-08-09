const mongoose = require('mongoose')
const Schema = mongoose.Schema

const querySchema = new Schema({
  query: String,
  date: Date
}, { capped: { size: 512, max: 10 } })

module.exports = mongoose.model('Query', querySchema)
