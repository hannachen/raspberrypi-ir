const fs = require('fs')
const path = require('path')
const http = require('http')
const url = require('url')
const Remote = require('./remote')

const HOSTNAME = '0.0.0.0' // listen on all ports
const PORT = 3000
const publicDir = path.resolve('./public')

class Index {

  constructor() {
    this.init = this.init.bind(this)
    this.init()
  }

  init() {
 
    const remote = new Remote()

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
	  switch(btn) {
	    case 'power':
	      remote.sendCmd('N2QAYB000827', 'KEY_POWER')
	      break
	    case 'mute':
	      remote.sendCmd('N2QAYB000827', 'KEY_MUTE')
	      break
	    case 'volup':
	      remote.sendCmd('N2QAYB000827', 'KEY_VOLUME_UP')
	      break
	    case 'voldown':
	      remote.sendCmd('N2QAYB000827', 'KEY_VOLUME_DOWN')
	      break
	    case 'srcpc':
	      remote.sendCmd('SWITCH', 'KEY_1')
	      break
	    case 'srcps4':
	      remote.sendCmd('SWITCH', 'KEY_4')
	      break
	    case 'srcchrome':
	      remote.sendCmd('SWITCH', 'KEY_5')
	      break
	  }
          res.writeHead(200, {'Content-type':'text/html'})
	  res.end(`Button command ${btn} sent!`)

        } else {

          const powerBtn = '<button data-action="/?btn=power">Power</button>'
	  const muteBtn = '<button data-action="/?btn=mute">Mute</button>'
	  const volumeUpBtn = '<button data-action="/?btn=volup">Volume Up</button>'
	  const volumeDownBtn = '<button data-action="/?btn=voldown">Volume Down</button>'
	  const pcBtn = '<button data-action="/?btn=srcpc">PC</button>'
	  const chromeBtn = '<button data-action="/?btn=srcchrome">ChromeCast</button>'
	  const ps4Btn = '<button data-action="/?btn=srcps4">PS4</button>'
	  const script = '<script type="text/javascript" src="./js/app.bundle.js"></script>'
	  const buttons = powerBtn + muteBtn + volumeUpBtn + volumeDownBtn + '<br />' + pcBtn + ps4Btn + chromeBtn
          const htmlContent = `<html><body>${buttons}${script}</body></html>`
	  res.writeHead(200, {'Content-type': 'text/html'})
          res.end(htmlContent)
        }

      // not index
      } else {

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
	      fs.readFile(`${publicDir}html/404.html`, (error, content) => {
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
    console.info(`Server running`)
  }
}

new Index()

