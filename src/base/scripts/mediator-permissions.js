Base.SubscribePermissions = (function() {
  const permissionList = {}

  const permissions = {}

  permissions.init = function(permission) {
    _(permissionList).extend(permission)
  }

  permissions.validate = function(subscriber, channel) {
    const test = permissionList[channel][subscriber]
    return test === undefined ? false : test
  }

  return permissions
}())
