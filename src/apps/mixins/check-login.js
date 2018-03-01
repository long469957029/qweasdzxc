export default {

  computed: {
    ...mapGetters([
      'isLogin'
    ]),
  },

  methods: {
    login() {
      this.$store.commit(types.TOGGLE_LOGIN_DIALOG, true)
    },
  }
}
