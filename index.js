import server from './server'
import remote from './remote'

class Index {

  constructor() {
    this.init = this.init.bind(this)

    this.init()
  }

  init() {
    server.on('buttonpress', this.onButtonPress)
  }

  onButtonPress(btn) {
    remote.sendCmd(btn)
  }

}

new Index()

