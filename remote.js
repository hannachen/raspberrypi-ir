const exec = require('child_process').exec

module.exports = class Remote {
  
  constructor() {
  }
  
  init() {
  }

  sendCmd(remote, key, next) {
    const cmd = `irsend SEND_ONCE ${remote} ${key}`

    console.info(`Sending command: ${cmd}`)
    exec(cmd, err => {
      if (err) throw err
      if (typeof next === 'function') {
        next()
      }
    })
  }
}
