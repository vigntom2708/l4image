function filter (data) {
  return data.items.map(obj => ({
    alt: obj.snippet,
    imageUrl: obj.link,
    pageUrl: obj.image.contextLink
  }))
}

function seeker (request) {
  return (query, callback) => {
    return request.get(query)
      .end((err, data) => {
        if (err) { return callback(err) }

        return callback(null, filter(data.body))
      })
  }
}

module.exports = seeker
