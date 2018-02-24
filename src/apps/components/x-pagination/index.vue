<template>
  <div class="x-pagination">
    <div class="inline-block m-right-xs">共<span class="total-size">{{totalSize}}</span>条记录</div>
    <div class="pagination inline-block">
      <ul>
        <li class="pagination-pre" :class="{disabled: pageIndex === 1}" @click="goToPrev"><span>&lt;</span></li>
        <li v-if="maxSphere - minSphere > 0" v-for="i in (maxSphere - minSphere)" :class="{active: (i + minSphere) === pageIndex}" @click="goToPage(minSphere + i)">
          <span>{{minSphere + i}}</span>
        </li>
        <template v-if="totalPage > maxSphere">
          …
          <li><span>{{totalPage}}</span></li>
        </template>
        <li class="pagination-next" :class="{disabled: pageIndex === totalPage}" @click="goToNext"><span>&gt;</span></li>
      </ul>
      <span>跳转至 </span><input type="text" v-model.number="goToIndex" @keypress="inputGoToPage" class="pagination-curt-page">
      <button class="pagination-go-to btn" @click.prevent="goToPage(goToIndex)">GO</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'x-pagination',

    model: {
      event: 'change'
    },

    props: {
      pageSize: {
        type: Number,
        default: 12,
      },
      totalSize: {
        type: Number,
        default: 0,
      },
      value: {
        type: Number,
        default: 1
      },
    },

    data() {
      return {
        maxPaginationNum: 6,
        goToIndex: 1,
      }
    },

    computed: {
      pageIndex: {
        get() {
          return this.value + 1
        },
        set(pageIndex) {
          this.$emit('change', pageIndex - 1)
        }
      },

      totalPage() {
         return Math.ceil(this.totalSize / this.pageSize)
      },
      // 最小区间
      minSphere() {
        let minSphere

        minSphere = this.pageIndex - Math.floor(_(this.maxPaginationNum).div(2))
        minSphere = minSphere > 0 ? minSphere : 0
        return minSphere
      },

      // 最大区间
      maxSphere() {
        let maxSphere

        maxSphere = this.pageIndex + Math.ceil(_(this.maxPaginationNum).div(2)) +
          (Math.floor(_(this.maxPaginationNum).div(2)) - this.pageIndex + this.minSphere) - 1

        maxSphere = maxSphere > this.totalPage ? this.totalPage : maxSphere

        return maxSphere
      }
    },

    methods: {
      inputGoToPage() {
        if (e.keyCode === 13) {
          if (this.totalSize) {
            this.$_gotoPage(this.goToIndex)
          }
        }
      },
      goToPage(index) {
        if (this.totalSize) {
          this.$_gotoPage(index)
        }
      },
      goToPrev() {
        if (this.pageIndex > 1) {
          this.pageIndex = this.pageIndex - 1

          this.$emit('page-change', {pageIndex: this.pageIndex - 1})
        }
      },
      goToNext() {
        if (this.pageIndex < this.totalPage) {
          this.pageIndex = this.pageIndex + 1

          this.$emit('page-change', {pageIndex: this.pageIndex - 1})
        }
      },

      resetIndex() {
        this.pageIndex = 1
        this.goToIndex = 1
      },

      $_gotoPage(gotoPageIndex) {
        // 如果输入 非法字符，负值或大于最大值的数值 还原之前的值 并阻止刷新
        if (!gotoPageIndex || gotoPageIndex < 0) {
          gotoPageIndex = 1
        } else if (gotoPageIndex > Math.ceil(this.totalSize / this.pageSize)) {
          gotoPageIndex = Math.ceil(this.totalSize / this.pageSize)
        }
        this.pageIndex = gotoPageIndex

        this.$emit('page-change', {pageIndex: this.pageIndex - 1})
      },
    },
  }
</script>

<style lang="scss" scoped>
  $pg-filter: 5px !default;

  $pg-item: (
    color: $font-inverse,
    bg-color: $font-default,
    hover-color: $font-default,
    bg-hover-color: $main-deep-color,
    active-color: $font-default,
    bg-active-color: $color-pleasant,
    disabled-color: #888888,
    bg-disabled-color: $font-default
  );

  .x-pagination {

    font-size:12px;
    color:#666666;
    display: flex;
    justify-content: center;
    align-items: center;

    .pagination {
      margin: 0;
      ul {
        display: inline-block;
        margin-right: 20px;
        > {
          li {
            display: inline-block;
            margin-left: $pg-filter;
            > {
              span {
                padding: 7px 10px;
                min-width: 30px;
                box-sizing: border-box;
                line-height: 14px;
                text-align: center;
                display: inline-block;
                cursor: pointer;
                border: 1px solid #cccccc;
                background-color: transparent;
                border-radius: 5px;
                color: map_get($pg-item, color);
                &:hover, &:focus {
                  background-color: map_get($pg-item, bg-hover-color);
                  color: map_get($pg-item, hover-color);
                }
              }
            }
          }
          .active > {
            span {
              background-color: #14b1bb;
              color: map_get($pg-item, active-color);
              &:hover {
                background-color: #14b1bb;
              }
            }
          }
          .disabled > {
            span {
              background-color: #ffffff;
              color: map_get($pg-item, disabled-color);
              cursor: not-allowed;
              &:hover, &:focus {
                background-color: map_get($pg-item, bg-disabled-color);
                color: map_get($pg-item, disabled-color);
              }
            }
          }
        }
      }

      >.active {
        > span,
        > span:focus,
        > span:hover {
          background-color: #14b1bb;
          border: 1px solid #14b1bb;
        }
      }
      .pagination-curt-page {
        width: 40px;
        padding: 7px;
        vertical-align: initial;
        text-align: center;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-right: 0;
        background: transparent;

      }

      .pagination-go-to {
        padding: 7px 5px;
        margin-left: -5px;
        vertical-align: initial;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
</style>
