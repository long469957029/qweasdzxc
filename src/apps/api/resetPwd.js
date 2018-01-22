export default {
  valCodeXhr ({code}, then, fail) {
    return Global.sync.axios({
      url: '/acct/imgcode/val.json',
      data: {
        code,
      },
    })
      .then(then)
      .catch(fail)
  },
}
