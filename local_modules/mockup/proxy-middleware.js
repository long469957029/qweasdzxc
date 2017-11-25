const _ = require('underscore')
const fs = require('fs')
const os = require('os')
const urlUtil = require('url')
const cookieUtil = require('cookie')

const urlPattern = require('url-pattern')

let cookieStore = {}
let urlRules = []
let ua = ''
const log = console.log
module.exports = function(options) {
  // console.log('options: ', options);
  console.log('-----: ', `${os.tmpdir()}/mobileProxyCookie`)
  fs.readFile(`${os.tmpdir()}/mobileProxyCookie`, (err, data) => {
    if (err) {
      console.log('Not found cookie persistence.')
      return
    }
    cookieStore = JSON.parse(data)
  })

  if (options.ua) {
    switch (options.ua) {
      case 'android':
        ua = 'Mozilla/5.0 (Linux; U; Android 4.0.2; en-us; Galaxy Nexus Build/ICL53F) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
        break
      case 'ios':
        ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3'
        break
      default:
        ua = ''
    }
  }
  urlRules = options.urlRules
  return function(req, resp, next) {
    // console.log('making request');

    const matchedConfig = matchReqByConfig(req)
    if (!matchedConfig) {
      next()
    }
    const target = matchedConfig.target

    const opts = urlUtil.parse(target)
    // https://uat.citivelocity.com/ ->
    // {protocol:,path:,pathname:,}
    const httpLib = opts.protocol === 'https:' ? 'https' : 'http'
    const request = require(httpLib).request
    opts.path = req.url
    opts.method = req.method
    opts.headers = opts.headers ? _.extend(req.headers, opts.headers) : req.headers
    Object.keys(cookieStore).forEach((key) => {
      if (!req.headers.Cookie) {
        req.headers.Cookie = ''
      }
      const val = cookieStore[key]
      if (key && val) {
        req.headers.Cookie += `${key}=${val};`
      }
    })
    if (ua) {
      opts.headers['User-Agent'] = ua
    }
    delete opts.headers.host

    // TODO Organize with Q promise.
    const myReq = request(opts, (myRes) => {
      let statusCode = myRes.statusCode,
        headers = myRes.headers,
        location = headers.location
      // console.log('location ', location);
      // console.log('href ', opts.href);
      // Fix the location
      if (statusCode > 300 && statusCode < 304 && location.indexOf(opts.href) > -1) {
        // absoulte path
        console.log('302 ', location)
        headers.location = location.replace(opts.href, '/')
      }
      // console.log(myRes.headers);
      const cookies = myRes.headers['set-cookie'] || []

      // console.log('cookies: ', cookies);
      cookies.forEach((cookie) => {
        const oCookie = cookieUtil.parse(cookie)
        const key = Object.keys(oCookie)[0]
        const val = oCookie[key]
        cookieStore[key] = val
      })
      if (myRes.headers['set-cookie']) {
        fs.writeFile(`${os.tmpdir()}/mobileProxyCookie`, JSON.stringify(cookieStore))
        log('Persist cookies to file.')
      }

      resp.writeHead(myRes.statusCode, myRes.headers)
      myRes.on('error', (err) => {
        next(err)
      })
      myRes.pipe(resp)
    })
    myReq.on('error', (err) => {
      next(err)
    })
    if (!req.readable) {
      myReq.end()
    } else {
      req.pipe(myReq)
    }
  }
}

/**
 * Match path by patterns one by one, check if method match
 * @param req
 * @return matched config or false
 */

function matchReqByConfig(req) {
  if (!urlRules) {
    return
  }
  const matchedConfig = _.find(urlRules, (oConfig) => {
    const pattern = oConfig.pattern
    if (urlPattern.newPattern(pattern).match(req.url)) {
      if (!oConfig.method) { // match all methods
        return true
      } 
      return oConfig.method.toLowerCase() === req.method.toLowerCase()
    }
  })
  if (matchedConfig) {
    log('url ', req.url, ' matched: ', matchedConfig.pattern, ' method: ', matchedConfig.method)
    return matchedConfig
  }
  return false
}
