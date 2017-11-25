// Base.Storage is an abstract adapter class that wraps the multitude of in
// browser data storage into a single common set of methods for storing and
// retreiving data.
//
// Base.Storage also supports the KVO pattern, by firing DOM/jQuery Events when
// a key is set.
//
// ### Example
//
//       // create a new store named 'mystore', tied to the #main element, using HTML5 localStorage
//       // Note: localStorage only works on browsers that support it
//       var store = new Base.Storage({name: 'mystore', element: '#element', type: 'local'});
//       store.set('foo', 'bar');
//       store.get('foo'); //=> 'bar'
//       store.set('json', {obj: 'this is an obj'});
//       store.get('json'); //=> {obj: 'this is an obj'}
//       store.keys(); //=> ['foo','json']
//       store.clear('foo');
//       store.keys(); //=> ['json']
//       store.clearAll();
//       store.keys(); //=> []
//
// ### Arguments
//
// The constructor takes a single argument which is a Object containing these possible options.
//
// * `name` The name/namespace of this store. Stores are unique by name/type. (default 'store')
// * `element` A selector for the element that the store is bound to. (default 'body')
// * `type` The type of storage/proxy to use (default 'memory')
//
// Extra options are passed to the storage constructor.
// Base.Storage supports the following methods of storage:
//
// * `memory` Basic object storage
// * `data` jQuery.data DOM Storage
// * `cookie` Access to document.cookie. Limited to 2K
// * `local` HTML5 DOM localStorage, browswer support is currently limited.
// * `session` HTML5 DOM sessionStorage, browswer support is currently limited.
//
Base.Storage = function(options) {
  const store = this
  this.options = options || {}
  this.name = this.options.name || 'store'
  this.element = this.options.element || 'body'
  this.$element = $(this.element)
  if (_.isArray(this.options.type)) {
    _.each(this.options.type, (type, i) => {
      if (Base.Storage.isAvailable(type)) {
        store.type = type
        return false
      }
    })
  } else {
    this.type = this.options.type || 'memory'
  }
  this.meta_key = this.options.meta_key || '__keys__'
  this.storage = new Base.Storage[Base.Storage.stores[this.type]](this.name, this.element, this.options)
}

Base.Storage.stores = {
  memory: 'Memory',
  data: 'Data',
  local: 'LocalStorage',
  session: 'SessionStorage',
  cookie: 'Cookie',
}

_.extend(Base.Storage.prototype, {
  // Checks for the availability of the current storage type in the current browser/config.
  isAvailable() {
    if (_.isFunction(this.storage.isAvailable)) {
      return this.storage.isAvailable()
    } 
    return true
  },
  // Checks for the existance of `key` in the current store. Returns a boolean.
  exists(key) {
    return this.storage.exists(key)
  },
  // Sets the value of `key` with `value`. If `value` is an
  // object, it is turned to and stored as a string with `JSON.stringify`.
  // It also tries to conform to the KVO pattern triggering jQuery events on the
  // element that the store is bound to.
  //
  // ### Example
  //
  //     var store = new Base.Storage({name: 'kvo'});
  //     $('body').bind('set-kvo-foo', function(e, data) {
  //       console.log(data.key + ' changed to ' + data.value);
  //     });
  //     store.set('foo', 'bar'); // logged: foo changed to bar
  //
  set(key, value) {
    const string_value = (typeof value === 'string') ? value : JSON.stringify(value)
    key = key.toString()
    this.storage.set(key, string_value)
    if (key != this.meta_key) {
      this._addKey(key)
      this.$element.trigger(`set-${this.name}`, {
        key,
        value,
      })
      this.$element.trigger(`set-${this.name}-${key}`, {
        key,
        value,
      })
    }
    // always return the original value
    return value
  },
  // Returns the set value at `key`, parsing with `JSON.parse` and
  // turning into an object if possible
  get(key) {
    const value = this.storage.get(key)
    if (typeof value === 'undefined' || value === null || value === '') {
      return value
    }
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  },
  // Removes the value at `key` from the current store
  clear(key) {
    this._removeKey(key)
    return this.storage.clear(key)
  },
  // Clears all the values for the current store.
  clearAll() {
    const self = this
    this.each((key, value) => {
      self.clear(key)
    })
  },
  // Returns the all the keys set for the current store as an array.
  // Internally Base.Storage keeps this array in a 'meta_key' for easy access.
  keys() {
    return this.get(this.meta_key) || []
  },
  // Iterates over each key value pair passing them to the `callback` function
  //
  // ### Example
  //
  //     store.each(function(key, value) {
  //       console.log('key', key, 'value', value);
  //     });
  //
  each(callback) {
    let i = 0,
      keys = this.keys(),
      returned

    for (i; i < keys.length; i++) {
      returned = callback(keys[i], this.get(keys[i]))
      if (returned === false) {
        return false
      }
    }
  },
  // Filters the store by a filter function that takes a key value.
  // Returns an array of arrays where the first element of each array
  // is the key and the second is the value of that key.
  //
  // ### Example
  //
  //     var store = new Base.Storage;
  //     store.set('one', 'two');
  //     store.set('two', 'three');
  //     store.set('1', 'two');
  //     var returned = store.filter(function(key, value) {
  //       // only return
  //       return value === 'two';
  //     });
  //     // returned => [['one', 'two'], ['1', 'two']];
  //
  filter(callback) {
    const found = []
    this.each((key, value) => {
      if (callback(key, value)) {
        found.push([key, value])
      }
      return true
    })
    return found
  },
  // Works exactly like filter except only returns the first matching key
  // value pair instead of all of them
  first(callback) {
    let found = false
    this.each((key, value) => {
      if (callback(key, value)) {
        found = [key, value]
        return false
      }
    })
    return found
  },
  // Returns the value at `key` if set, otherwise, runs the callback
  // and sets the value to the value returned in the callback.
  //
  // ### Example
  //
  //     var store = new Base.Storage;
  //     store.exists('foo'); //=> false
  //     store.fetch('foo', function() {
  //       return 'bar!';
  //     }); //=> 'bar!'
  //     store.get('foo') //=> 'bar!'
  //     store.fetch('foo', function() {
  //       return 'baz!';
  //     }); //=> 'bar!
  //
  fetch(key, callback) {
    if (!this.exists(key)) {
      return this.set(key, callback.apply(this))
    } 
    return this.get(key)
  },
  // loads the response of a request to `path` into `key`.
  //
  // ### Example
  //
  // In /mytemplate.tpl:
  //
  //     My Template
  //
  // In app.js:
  //
  //     var store = new Base.Storage;
  //     store.load('mytemplate', '/mytemplate.tpl', function() {
  //       s.get('mytemplate') //=> My Template
  //     });
  //
  load(key, path, callback) {
    const s = this
    $.get(path, function(response) {
      s.set(key, response)
      if (callback) {
        callback.apply(this, [response])
      }
    })
  },

  _addKey(key) {
    const keys = this.keys()
    if ($.inArray(key, keys) == -1) {
      keys.push(key)
    }
    this.set(this.meta_key, keys)
  },
  _removeKey(key) {
    const keys = this.keys()
    const index = $.inArray(key, keys)
    if (index != -1) {
      keys.splice(index, 1)
    }
    this.set(this.meta_key, keys)
  },
})

// Tests if the type of storage is available/works in the current browser/config.
// Especially useful for testing the availability of the awesome, but not widely
// supported HTML5 DOM storage
Base.Storage.isAvailable = function(type) {
  try {
    return Base.Storage[Base.Storage.stores[type]].prototype.isAvailable()
  } catch (e) {
    return false
  }
}

// Memory ('memory') is the basic/default store. It stores data in a global
// JS object. Data is lost on refresh.
Base.Storage.Memory = function(name, element) {
  this.name = name
  this.element = element
  this.namespace = [this.element, this.name].join('.')
  Base.Storage.Memory.store = Base.Storage.Memory.store || {}
  Base.Storage.Memory.store[this.namespace] = Base.Storage.Memory.store[this.namespace] || {}
  this.store = Base.Storage.Memory.store[this.namespace]
}
_.extend(Base.Storage.Memory.prototype, {
  isAvailable() {
    return true
  },
  exists(key) {
    return (typeof this.store[key] !== 'undefined')
  },
  set(key, value) {
    this.store[key] = value
    return value
  },
  get(key) {
    return this.store[key]
  },
  clear(key) {
    delete this.store[key]
  },
})

// Data ('data') stores objects using the jQuery.data() methods. This has the advantadge
// of scoping the data to the specific element. Like the 'memory' store its data
// will only last for the length of the current request (data is lost on refresh/etc).
Base.Storage.Data = function(name, element) {
  this.name = name
  this.element = element
  this.$element = $(element)
}
_.extend(Base.Storage.Data.prototype, {
  isAvailable() {
    return true
  },
  exists(key) {
    return !!this.$element.data(this._key(key))
  },
  set(key, value) {
    return this.$element.data(this._key(key), value)
  },
  get(key) {
    return this.$element.data(this._key(key))
  },
  clear(key) {
    this.$element.removeData(this._key(key))
  },
  _key(key) {
    return ['store', this.name, key].join('.')
  },
})

// LocalStorage ('local') makes use of HTML5 DOM Storage, and the window.localStorage
// object. The great advantage of this method is that data will persist beyond
// the current request. It can be considered a pretty awesome replacement for
// cookies accessed via JS. The great disadvantage, though, is its only available
// on the latest and greatest browsers.
//
// For more info on DOM Storage:
// https://developer.mozilla.org/en/DOM/Storage
// http://www.w3.org/TR/2009/WD-webstorage-20091222/
//
Base.Storage.LocalStorage = function(name, element) {
  this.name = name
  this.element = element
}
_.extend(Base.Storage.LocalStorage.prototype, {
  isAvailable() {
    return ('localStorage' in window) && (window.location.protocol != 'file:')
  },
  exists(key) {
    return (this.get(key) !== null)
  },
  set(key, value) {
    return window.localStorage.setItem(this._key(key), value)
  },
  get(key) {
    return window.localStorage.getItem(this._key(key))
  },
  clear(key) {
    window.localStorage.removeItem(this._key(key))
  },
  _key(key) {
    return ['store', this.element, this.name, key].join('.')
  },
})

// .SessionStorage ('session') is similar to LocalStorage (part of the same API)
// and shares similar browser support/availability. The difference is that
// SessionStorage is only persistant through the current 'session' which is defined
// as the length that the current window is open. This means that data will survive
// refreshes but not close/open or multiple windows/tabs. For more info, check out
// the `LocalStorage` documentation and links.
Base.Storage.SessionStorage = function(name, element) {
  this.name = name
  this.element = element
}
_.extend(Base.Storage.SessionStorage.prototype, {
  isAvailable() {
    return ('sessionStorage' in window) &&
      (window.location.protocol != 'file:') &&
      (_.isFunction(window.sessionStorage.setItem))
  },
  exists(key) {
    return (this.get(key) !== null)
  },
  set(key, value) {
    return window.sessionStorage.setItem(this._key(key), value)
  },
  get(key) {
    let value = window.sessionStorage.getItem(this._key(key))
    if (value && typeof value.value !== 'undefined') {
      value = value.value
    }
    return value
  },
  clear(key) {
    window.sessionStorage.removeItem(this._key(key))
  },
  _key(key) {
    return ['store', this.element, this.name, key].join('.')
  },
})

// .Cookie ('cookie') storage uses browser cookies to store data. JavaScript
// has access to a single document.cookie variable, which is limited to 2Kb in
// size. Cookies are also considered 'unsecure' as the data can be read easily
// by other sites/JS. Cookies do have the advantage, though, of being widely
// supported and persistent through refresh and close/open. Where available,
// HTML5 DOM Storage like LocalStorage and SessionStorage should be used.
//
// .Cookie can also take additional options:
//
// * `expires_in` Number of seconds to keep the cookie alive (default 2 weeks).
// * `path` The path to activate the current cookie for (default '/').
//
// For more information about document.cookie, check out the pre-eminint article
// by ppk: http://www.quirksmode.org/js/cookies.html
//
Base.Storage.Cookie = function(name, element, options) {
  this.name = name
  this.element = element
  this.options = options || {}
  this.path = this.options.path || '/'
  // set the expires in seconds or default 14 days
  this.expires_in = this.options.expires_in || 0
  // this.expires_in = this.options.expires_in || (14 * 24 * 60 * 60);
}
_.extend(Base.Storage.Cookie.prototype, {
  isAvailable() {
    return ('cookie' in document) && (window.location.protocol != 'file:')
  },
  exists(key) {
    return (this.get(key) !== null)
  },
  set(key, value, expires) {
    return this._setCookie(key, value, expires)
  },
  get(key) {
    return this._getCookie(key)
  },
  clear(key) {
    this._setCookie(key, '', -1)
  },
  _key(key) {
    return ['store', this.element, this.name, key].join('.')
  },
  _getCookie(key) {
    const escaped = this._key(key).replace(/(\.|\*|\(|\)|\[|\])/g, '\\$1')
    const match = document.cookie.match(`(^|;\\s)${escaped}=([^;]*)(;|$)`)
    return (match ? match[2] : null)
  },
  _setCookie(key, value, expires) {
    if (!expires) {
      expires = (this.expires_in * 1000)
    }
    const date = new Date()
    date.setTime(date.getTime() + expires)
    let set_cookie = [
      this._key(key), '=', value]

    if (expires) {
      set_cookie.push('; expires=', date.toGMTString())
    }
    set_cookie = set_cookie.concat('; path=', this.path)

    document.cookie = set_cookie.join('')
  },
})
