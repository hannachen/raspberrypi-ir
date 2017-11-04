class App {

  constructor() {
    
    this.init = this.init.bind(this)
    this.initEvents = this.initEvents.bind(this)
    this.onDomReady = this.onDomReady.bind(this)

    this.init()  
  }

  init() {
    this.initEvents()
  }

  initEvents() {
    document.addEventListener("DOMContentLoaded", this.onDomReady)
  }

  onDomReady() {
    const buttons = document.querySelectorAll('button')

    console.log(buttons)

    buttons.forEach(button => {
      button.addEventListener('click', this.onButtonClick, true)
    })
  }

  onButtonClick(e) {
    const action = e.target.dataset.action
    console.info(`Button action: ${action}`)
    if (action) {
      fetch(action)
	.then(res => (res.text()))
        .then(res => {
      	  console.log(`Server response: ${res}`)
        })
    }
  }
}

new App()
