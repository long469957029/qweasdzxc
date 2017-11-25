/**
 * 减少`Backbone.Router`处理路由事件代码，可以将事件定义在指定的`Controller`对象里面。
 *
 * 通过`appRoutes`来配置`AppRouter`
 *
 */
Base.AppRouter = Backbone.Router.extend({

  constructor(options) {
    this.options = options || {}
    this.onRouteHandler = []
    Backbone.Router.apply(this, arguments)

    const appRoutes = this.getOption('appRoutes')
    const controller = this._getController()
    this.processAppRoutes(controller, appRoutes)
    this.on('route', this._processOnRoute, this)
  },

  /**
   * 和Backbone Router里面定义的`route`方法相似，但是该方法是在`controller`里面被调用的。
   */
  appRoute(route, methodName) {
    const controller = this._getController()
    this._addAppRoute(controller, route, methodName)
  },

  // 执行`route event`，如果onRoute方法存在的话，执行`onRoute`方法
  _processOnRoute(routeName, routeArgs) {
    if (_.isFunction(this.onRoute)) {
      const routePath = _.invert(this.getOption('appRoutes'))[routeName]
      this.onRoute(routeName, routePath, routeArgs)
    }
  },

  /**
   * 可以在`runtime`时，指定一个`controller`和多个`routes`，
   * 同时也不会改变`AppRouter`当前的`controller`。
   */
  processAppRoutes(controller, appRoutes) {
    if (!appRoutes) {
      return
    }

    const routeNames = _.keys(appRoutes).reverse() // Backbone requires reverted order of routes

    _.each(routeNames, function(route) {
      this._addAppRoute(controller, route, appRoutes[route])
    }, this)
  },

  _getController() {
    return this.getOption('controller')
  },

  _addAppRoute(controller, route, methodName) {
    const method = controller[methodName]

    if (!method) {
      throw new Base.Error(`方法 "${methodName}" 在指定\`controller\`中不存在`)
    }

    this.route(route, methodName, _.bind(method, controller))
  },
  onRoute (routeName, routePath, routeArgs) {
    // 如考虑性能要求，可优化为两个部分：异步与同步事件数组
    _(this.onRouteHandler).each((item) => {
      item.callback(item.args, routeName, routePath, routeArgs)
    })
  },

  addOnRouteHandler (callback, args) {
    this.onRouteHandler.push({ callback, args })
  },

  getOption: Base.proxyGetOption,

  triggerMethod: Base.triggerMethod,

  bindEntityEvents: Base.proxyBindEntityEvents,

  unbindEntityEvents: Base.proxyUnbindEntityEvents,

})
