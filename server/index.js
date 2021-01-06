// Modules
const http = require('http')

// Create HTTP Server
http.createServer( (request, response) => {

  // Enable CORS
  response.setHeader('Access-Control-Allow-Origin', '*')
  const { url, method } = request
  // response.end(`Hello from HTTP server - Updated ${request.url}`)

  if (method === 'POST' && url.match(/^\/subscribe\/?$/)) {
    let body = []
    request.on('data', chunk => body.push(chunk))
    request.on('end', () => response.end('Subscribed'))
  } else if (method === 'GET' && url.match(/^\/key\/?$/)) {
    response.end('Public Key')
  } else if (method === 'POST' && url.match(/^\/push\/?$/)) {
    let body = []
    request.on('data', chunk => body.push(chunk))
    request.on('end', () => response.end('Push Sent'))
  } else {
    response.statusCode = 404
    response.end(`nothing found for ${url} using ${method}`)
  }
// Start the Server
}).listen( 3333, () => { console.log('Server Running') })
