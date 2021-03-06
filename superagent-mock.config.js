const url = require('url')

module.exports = [{
  pattern: /https:\/\/www\.googleapis\.com\/customsearch\/v1\?(.*)/,

  fixtures (match, params, headers, context) {
    return {
      kind: 'customsearch#search',
      url: {
        type: 'application/json'
      },
      items: [{
        kind: 'customsearch#result',
        title: 'search result title 1',
        link: 'https://www.example.com/images/image1.jpg',
        snippet: 'snippet | alt',
        displayLink: 'www.imagesource1.com',
        image: {
          contextLink: 'https://www.imagesource1.com/path/to/context',
          height: 1234,
          width: 5678,
          thumbnailLink: 'https://thumbnail.example.com/path2image1',
          thumbnailHeight: 12,
          thumbnailWidth: 34
        }
      },
      {
        kind: 'customsearch#result',
        title: 'search result title 2',
        link: 'https://www.example.com/images/image2.jpg',
        snippet: 'snipet-2 | alt-2',
        displayLink: 'www.imagesource2.com',
        image: {
          contextLink: 'https://www.imagesource2.com/path/to/context',
          height: 234,
          width: 567,
          thumbnailLink: 'https://thumbnail.example.com/path2image2',
          thumbnailHeight: 23,
          thumbnailWidth: 45
        }
      }]
    }
  },

  get (match, data) {
    const query = url.parse(match[0], true).query
    const result = Object.assign({}, data, {
      items: data.items.slice(query.start - 1, query.num)
    })

    return { body: result }
  }
}]
