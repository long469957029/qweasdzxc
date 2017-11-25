function Socket (options) {
  this.init(options || {})
}

Socket.prototype = {
  init (options) {
    const self = this

    _.defaults(options, {
      fail () {},
      messageHandler () {},
    })

    const host = location.hostname
    let socket
    // console.log('WebSocket server :' + host);
    try {
      socket =
        this.socket =
        new WebSocket(`ws://${host === 'localhost' ? 'forehead.5x5x.com' : host}${options.tokenUrl}${options.token}`)
    } catch (err) {
      Global.ui.notification.show('服务器连接失败')
      options.fail()
    }

    socket.onopen = function () {
      // console.info('[Socket connected]')
      self.setupTimer()
    }

    socket.onclose = function () {
      // console.info('[Socket closed]')
      options.close()
    }

    socket.onerror = function (err) {
      // console.error('Socket connect error', err)
      options.fail()
    }

    socket.onmessage = function (e) {
      // console.info('[Socket message]', e)
      let resp = ''
      try {
        resp = JSON.parse(e.data)
      } catch (err) {
        throw new Error('socket message resolve failed')
      }

      options.messageHandler(resp)
    }

    return socket
  },

  beat () {
    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(JSON.stringify({
        type: 'beat',
        message: 'hello server',
      }))
    }
  },

  // sendData: function (data) {
  //   if (this.socket && this.socket.readyState === 1) {
  //     this.socket.send(JSON.stringify(data))
  //   }
  // },

  setupTimer () {
    const self = this
    var timer = this.timer = setTimeout(() => {
      self.beat()
      clearTimeout(timer)
      self.setupTimer()
    }, 1000 * 30)
  },

  release () {
    clearTimeout(this.timer)
    delete this.timer
    this.socket.close()
    delete this.socket
  },
}

module.exports = Socket
