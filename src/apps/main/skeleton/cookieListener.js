const cookieListener = function(cookieName, callback) {
  var self = this;
  // console.log("cookieListener1:"+this)
  this.cookieName = cookieName;
  this.callback = callback;
  this.cookieRegistry = [];
  this.interval = setInterval(function() {
    var cookieVal = Global.cookieCache.get(self.cookieName),
      status = null;
    // console.log("cookieListener:"+this)
    // console.log("cookieVal:"+cookieVal)
    if (self.cookieRegistry[cookieName] == null && cookieVal != null) {
      status = cookieListener.prototype.CREATED
    }else if(self.cookieRegistry[cookieName] != null && cookieVal == null){
      status = cookieListener.prototype.DELETED
    }else if(cookieVal  != self.cookieRegistry[cookieName]){
      status = cookieListener.prototype.UPDATED
    }
    self.cookieRegistry[cookieName] = cookieVal;
    if(status)self.callback(status);
    return status;
  }, 100);

  function removeListener() {
    clearInterval(this.interval)
  }
}
cookieListener.prototype.CREATED = 'created';
cookieListener.prototype.DELETED = 'deleted';
cookieListener.prototype.UPDATED = 'updated';


export default cookieListener
