const fs = require('fs')
const path = require('path')
const http = require('http')
const url = require('url')
const EventEmitter = require('events')

const HOSTNAME = '0.0.0.0'
const PORT = 3000
const publicDir = path.resolve('./public')

class Server extends EventEmitter {

  constructor() {
    super()

    this.init = this.init.bind(this)
    this.onServerStart = this.onServerStart.bind(this)
    this.init()
  }

  init() {

    console.info(`Initializing server... base: ${publicDir}`)

    // Start the server
    http.createServer((req, res) => {

      // sort out file path
      const filePath = url.parse(req.url).pathname
      console.info(`File path: ${filePath}`)

      // empty path/index
      if (filePath == '/') {

        // use the url to parse the requested url
        const query = url.parse(req.url, true).query
        const btn = query.btn

        if (btn) {
          console.info(`Button entered: ${btn}`)
          this.emit('buttonpress', btn)

          res.writeHead(200, {'Content-type':'text/html'})
          res.end(`Button command ${btn} sent!`)

        } else { // Display index file

          fs.readFile(`./html/index.html`, (err, content) => {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(content, 'utf-8')
          })
        }

      } else { // not the homepage

        const extname = String(path.extname(filePath)).toLowerCase()
        const mimeTypes = {
          '.html': 'text/html',
          '.js': 'text/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpg',
          '.gif': 'image/gif',
          '.svg': 'application/image/svg+xml'
        }
        let contentType = 'text/html'
        contentType = mimeTypes[extname] || 'application/octet-stream'
        fs.readFile(`${publicDir}${filePath}`, (err, content) => {
          if (err) {
            if (err.code == 'ENOENT') {
              fs.readFile(`./html/404.html`, (error, content) => {
                res.writeHead(400, { 'Content-Type': contentType })
                res.end(content, 'utf-8')
              })
            } else {
              res.writeHead(500)
              res.end(`Sorry, check with the site admin for error: ${err.code} ..\n`)
              res.end()
            }
          } else {
            res.writeHead(200, { 'Content-Type': contentType })
            res.end(content, 'utf-8')
          }
        })
      }

    }).listen(PORT, HOSTNAME, this.onServerStart)
  }

  onServerStart() {
    this.emit('ready')
    console.info(`Server running`)
  }
}

const server = new Server()
export default server
