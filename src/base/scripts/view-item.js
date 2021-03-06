
/**
 * `ItemView` 对应一个Entity Item，该 Entity 为 Backbone.Model 或者为 Backbone.Collection
 *
 * `single item view`实现了:
 * 使用`underscore.js templates`渲染，序列化view的`model`或者`collection`，调用继承自view的方法，
 * 比如 `onRender`
 *
 */
Base.ItemView = Base.View.extend({

  startOnLoading: false,

  options: {
    loadingHeight: 500,
  },

  // 设置继承链
  constructor() {
    this.uniqueId = _.uniqueId('js-page-main')
    Base.View.apply(this, arguments)
  },

  /**
   * 序列化view的`model`或者`collection`
   * 你可以在你的View中，重写`serializeData`，定制化View的数据
   */
  serializeData() {
    if (!this.model && !this.collection) {
      return {}
    }

    const args = [this.model || this.collection]
    if (arguments.length) {
      args.push(...arguments)
    }

    if (this.model) {
      return this.serializeModel.apply(this, args)
    } 
    return {
      items: this.serializeCollection.apply(this, args),
    }
  },

  /**
   * 序列化`collection`，序列化collection所有的model
   */
  serializeCollection(collection) {
    return collection.toJSON(..._.rest(arguments))
  },

  /**
   * 渲染view，可重写
   */
  render() {
    this._ensureViewIsIntact()

    this.triggerMethod('before:render', this)

    // } else {

    // this.triggerMethod('render', this);

    // }
    this._renderTemplate()

    this.triggerMethod('render', this)
    return this
  },

  refresh() {
    this.startOnLoading = true
    this.render()
  },

  _getLoading() {
    return Global.ui.loader.get({
      wrapperClass: 'js-page-loader',
      height: this.options.loadingHeight,
    })
  },

  loadingFinish() {
    this.$el.find('.js-page-loader').remove()
    this.$el.find(`.${this.uniqueId}`).removeClass('hidden')
    this.startOnLoading = false
  },

  _renderTemplate() {
    const template = this.getTemplate()

    if (template === false) {
      return
    }

    if (_.isUndefined(template)) {
      throw new Base.Error({
        name: 'UndefinedTemplateError',
        message: 'template为空，不能渲染。',
      })
    }

    let data = this.serializeData()
    data = this.mixinTemplateHelpers(data)

    const compiledTpl = _.template(template)

    let html

    if (this.startOnLoading) {
      html = `<div class="${this.uniqueId} hidden">${compiledTpl(data)}</div>`
      html += this._getLoading()
    } else {
      html = compiledTpl(data)
      // html = '<div class="' + this.uniqueId + '">' + compiledTpl(data) + '</div>';
    }

    this.attachElContent(html)

    return this
  },

  /**
   * 将内容渲染到页面上
   */
  attachElContent(html) {
    this.$el.html(html)

    return this
  },

})
