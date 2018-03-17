<template>
  <div class="contact-search">
    <div class="contact-search-panel">
      <input class="contact-search-container" @focus="showSearchResult" v-on:mouseenter="showSearchResult"
             v-on:mouseleave="clearSearchResult" v-model="searchInput" @blur="clearSearchResult">
      <span class="sfa sfa-icon-search-sm search-img-small" v-if="searchInputEmpty"></span>
      <span class="js-search-input-cancel sfa sfa-icon-search-close search-close" v-if="searchInputEmpty"
            @click="clearSearchInput">
        <span class="search-close-img"></span>
        </span>
      <span class="sfa sfa-icon-search-lg search-img-lg" v-if="!searchInputEmpty"></span>
      <span class="search-panel-text" v-if="!searchInputEmpty">搜索</span>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'search',

    data () {
      return {
        searchInput: '',
        searchInputEmpty: false,
      }
    },

    props: {},

    components: {},

    mounted () {
      this.$nextTick(() => {
      })
    },

    watch: {
      searchInput: function (val) {
        if (val.length === 0) {
          this.$store.commit(types.CLEAR_CONTACT_SEARCH_NAME)
        } else {
          this.$store.commit(types.CONTACT_SEARCH_NAME, val)
          this.$store.commit(types.TOGGLE_IM_CONTACT_PANEL, true)
        }
      }
    },

    computed: {
      ...mapGetters([
        'getMessagePanelStatus',
      ])
    },

    filters: {},

    methods: {
      showSearchResult(){
        this.searchInputEmpty = true
      },
      clearSearchResult(){
        if (this.searchInput.length === 0) {
          this.$store.commit(types.TOGGLE_IM_CONTACT_PANEL, false)
          this.searchInputEmpty = false
        }
      },
      clearSearchInput(){
        this.searchInput = ''
        this.$store.commit(types.TOGGLE_IM_CONTACT_PANEL, false)
        this.$store.commit(types.TOGGLE_MESSAGE_PANEL, 0)
      }
    }
  }
</script>

<style scoped lang="scss">
  .contact-search {
    background-color: white;
    height: 55px;
    border-bottom: 1px solid $def-line-color;
    .contact-search-panel {
      padding: 13px 20px;
      .search-img-small {
        position: absolute;
        top: 70px;
        left: 34px;
        display: block;
        /*pointer-events: none;*/
      }
      .search-close {
        cursor: pointer;
        display: block;
        position: absolute;
        left: 203px;
        /*.search-close-img {*/
        /*pointer-events: none;*/
        /*}*/
        top: 70px;
      }
      .search-img-lg {
        position: absolute;
        left: 98px;
        top: 69px;
      }
      .search-panel-text {
        color: $font-auxiliary-color;
        position: absolute;
        top: 67px;
        left: 128px;
        font-size: 14px;
      }
      .contact-search-container {
        background-color: $new-main-body-color;
        width: 134px;
        height: 26px;
        border: 1px solid $new-main-body-color;
        border-radius: 20px;
        padding: 0 37px;
        &:hover, &:focus, &:active, &.active {
          border: 1px solid $new-main-deep-color;
          outline-width: 0;
        }
        /*&:focus, &.active, &:hover {*/
        /*& ~ span {*/
        /*&.search-img-small {*/
        /*display: block;*/
        /*}*/
        /*&.search-close {*/
        /*display: block;*/
        /*}*/
        /*&.search-img-lg {*/
        /*display: none;*/
        /*}*/
        /*&.search-panel-text {*/
        /*display: none;*/
        /*}*/
        /*}*/
        /*}*/
      }
    }
  }
</style>

