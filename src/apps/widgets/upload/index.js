

require('./index.scss')
require('./jquery.fileupload-5.42.3')

$.widget('gl.upload', {

  template: '' +
  '<span class="btn <%=btnClass %> fileinput-button box-sizing">' +
  '<span><%=title %></span>' +
  '<input class="js-wt-upload-btn" type="file" name="files[]" multiple>' +
  '</span>' +
  '<div class="js-wt-upload-progress-container progress hidden">' +
  '<div class="js-wt-upload-progress progress-bar progress-bar-success"></div>' +
  '</div>',

  options: {
    title: '上传附件',
    url: '/info/txt/dotxt.json',
    btnClass: 'btn-cool',
    namespace: 'upload',
    paramName: 'imgFile',
    process: true,
    done: _.noop,
    fail: _.noop,
  },

  _create() {
    const self = this

    this.element.html(_(this.template).template()({
      btnClass: this.options.btnClass,
      title: this.options.title,
    }))

    const $processContainer = self.element.find('.js-wt-upload-progress-container')
    const $process = self.element.find('.js-wt-upload-progress')
    const $uploadBtn = this.element.find('.js-wt-upload-btn')

    $uploadBtn.fileupload({
      url: this.options.url,
      dataType: 'json',
      paramName: this.options.paramName,
    })
      .on('fileuploadadd', () => {
        if (self.options.process) {
          $processContainer.removeClass('hidden')
        }
      })
      .on('fileuploaddone', (e, res) => {
        self.options.done(res.result)

        if (self.options.process) {
          $processContainer.addClass('hidden')
          $process.css('width', 0)
        }
      })
      .prop('disabled', !$.support.fileInput)
      .parent()
      .addClass($.support.fileInput ? undefined : 'disabled')

    if (self.options.process) {
      $uploadBtn.fileupload()
        .on('fileuploadprogressall', (e, res) => {
          const progress = parseInt(res.loaded / res.total * 100, 10)
          $process.css('width', `${progress}%`)
        })
        .on('fileuploadfail', (e, data) => {
          $processContainer.addClass('hidden')
        })
    }
  },
})

module.exports = $.gl.upload
