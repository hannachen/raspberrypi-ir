const fs = require('fs')
const exec = require('child_process').exec

class Remote {
  
  constructor() {

    this.init = this.init.bind(this)
    this.init()
  }
  
  init() {
    const buttonData = fs.readFileSync('remote.json')
    const buttonJson = JSON.parse(buttonData)

    this.buttons = buttonJson
  }

  sendCmd(btn, next) {
    const button = this.buttons[btn]
    if (!button) {
      console.error(`Button ${btn} does not exist`)
      return
    }
    const cmd = `irsend SEND_ONCE ${button.remote} ${button.key}`

    console.info(`Sending command: ${cmd}`)
    exec(cmd, err => {
      if (err) throw err
      if (typeof next === 'function') {
        next()
      }
    })
  }
}

const remote = new Remote()
export default remote