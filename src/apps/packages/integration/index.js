const Integration = Base.ItemView.extend({

  template: require('./index.html'),
  events: {
  },

  initialize() {
    function getQueryParams(qs) {
      qs = qs.split('+').join(' ')

      let params = {}, // eslint-disable-line
        tokens, // eslint-disable-line
        re = /[?&]?([^=]+)=([^&]*)/g // eslint-disable-line

      while (tokens = re.exec(qs)) { // eslint-disable-line
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2])
      }

      return params
    }

    const query = getQueryParams(document.location.search)
    const userName = query.userName
    const password = query.pwd
    const gameCode = query.code
    const isTrail = query.trail

    iapiSetCallout('Login', calloutLogin) // eslint-disable-line
    iapiSetCallout('Logout', calloutLogout) // eslint-disable-line

    function logout(allSessions, realMode) { // eslint-disable-line
      iapiLogout(allSessions, realMode) // eslint-disable-line
    }
    function calloutLogin(response) {
      if (response.errorCode) {
        alert(`Login failed, ${response.errorText}`)
      } else {
        window.location = `http://cache.download.banner.winforfun88.com/casinoclient.html?language=ZH-CN&game=${gameCode}${isTrail == 1 ? '&mode=offline' : ''}` // eslint-disable-line
      }
    }

    function calloutLogout(response) {
      if (response.errorCode) {
        alert(`Logout failed, ${response.errorCode}`)
      } else {
        alert('Logout OK')
      }
    }
    iapiLogin(userName, password, 1, 'ZH-CN') // eslint-disable-line
  },


})

const integration = new Integration() // eslint-disable-line

