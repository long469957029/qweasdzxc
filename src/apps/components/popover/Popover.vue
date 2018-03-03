<script>
  const pointerSize = 6
  const directions = {
    left: [-1, 0],
    right: [1, 0],
    top: [0, 1],
    bottom: [0, -1]
  }
  let events

  export default {
    name: 'Popover',
    render: function (createElement) {
      if (!this.visible) {
        return
      }

      return createElement(
        'div',
        {
          class: this.className,
          style: this.style,
          attrs: {
            'data-popover': this.name
          },
          on: {
            click(event) {
              event.stopPropagation()
            }
          },
          ref: 'dropdown'
        },
        this.$slots.default
      )
    },
    props: {
      name: {
        type: String,
        required: true
      },
      width: {
        type: Number,
        default: 180
      },
      pointer: {
        type: Boolean,
        default: true
      },
      event: {
        type: String,
        default: 'click'
      },
      anchor: {
        type: Number,
        default: 0.5,
        validator: (v) => v >= 0 && v <= 1
      }
    },
    data() {
      return {
        visible: false,
        positionClass: '',
        position: {
          left: 0,
          top: 0
        }
      }
    },
    mounted() {
      events = Vue.$global.bus
      events.$on(this.showEventName, this.showEventListener)
      events.$on(this.hideEventName, this.hideEventListener)
    },
    beforeDestroy() {
      events.$off(this.showEventName, this.showEventListener)
      events.$off(this.hideEventName, this.hideEventListener)
    },
    computed: {
      showEventName() {
        return `show:${this.event}`
      },
      hideEventName() {
        return `hide:${this.event}`
      },
      className() {
        return [
          'vue-popover',
          this.pointer && this.positionClass
        ]
      },
      style() {
        return {
          // width: `${this.width}px`,
          ...this.position
        }
      }
    },
    methods: {
      showEventListener(event) {
        if (this.visible) {
          events.$emit(this.hideEventName)
          return
        }

        this.$nextTick(() => {
          let {target, name, position} = event

          if (name === this.name) {
            let direction = directions[position]

            this.positionClass = `dropdown-position-${position}`
            this.visible = true

            this.$nextTick(() => {
              this.$emit('show', event)

              this.$nextTick(() => {
                let position = this
                  .getDropdownPosition(target, this.$refs.dropdown, direction)

                this.position = {
                  left: `${position.left}px`,
                  top: `${position.top}px`
                }
              })
            })
          }
        })
      },

      hideEventListener(event) {
        if (this.visible) {
          this.visible = false
          this.$emit('hide', event)
        }
      },

      getDropdownPosition(target, dropdown, direction) {
        let trRect = $(target).offset()

        // Position within the parent
        let offsetLeft = trRect.left
        let offsetTop = trRect.top

        trRect = target.getBoundingClientRect()
        let ddRect = dropdown.getBoundingClientRect()


        // let shiftX = ddRect.width - trRect.width
        let shiftY = 0.5 * (ddRect.height + trRect.height)

        // Center of the target element
        let centerX = offsetLeft - 0.5 * (ddRect.width - trRect.width)
        let centerY = offsetTop + trRect.height - shiftY

        // let anchorX = direction[0] * this.anchor
        // let anchorY = direction[0] * this.anchor

        // Position of the dropdown relatively to target
        let x = direction[0] * 0.5 * (ddRect.width + trRect.width)
        let y = direction[1] * shiftY

        // Pointer size correction
        if (this.pointer) {
          x += direction[0] * pointerSize
          y += direction[1] * pointerSize
        }

        return {
          left: centerX + x,
          top: centerY - y
        }
      }
    }
  }
</script>

<style lang="scss">
  $pointer-size: 6px;

  .vue-popover {
    display: block;
    position: absolute;
    color: #333333;

    background-color: #ffffff;
    box-shadow: 0px 2px 10px 0px    rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    border: solid 1px $def-gray-color;
    padding: 9px 14px;

    z-index: 998;
    transition: opacity 0.3s linear;

    &:before {
      display: block;
      position: absolute;
      background: #fff;
      width: $pointer-size;
      height: $pointer-size;
      border-color: $def-gray-color;
      transform: rotate(45deg);
      content: '';
    }

    &.dropdown-position-bottom:before {
      border-left: 1px solid transparent;
      border-right: 1px solid transparent;
      border-bottom: 1px solid #fff;
      top: -$pointer-size;
      left: calc(50% - #{$pointer-size});
      filter: drop-shadow(0px -2px 2px rgba(52, 73, 94, 0.1));
    }

    &.dropdown-position-top:before {
      border-left: 1px solid transparent;
      border-right: 1px solid transparent;
      border-top: 1px solid #fff;
      bottom: -$pointer-size;
      left: calc(50% - #{$pointer-size});
      filter: drop-shadow(0px 2px 2px rgba(52, 73, 94, 0.1));
    }

    &.dropdown-position-left:before {
      border-top: 1px solid transparent;
      border-bottom: 1px solid transparent;
      border-left: 1px solid #fff;
      left: calc(50% - #{$pointer-size});
      top: calc(50% - #{$pointer-size});
      filter: drop-shadow(2px 0px 2px rgba(52, 73, 94, 0.1));
    }

    &.dropdown-position-right:before {
      border-left: 1px solid $def-gray-color;
      border-bottom: 1px solid $def-gray-color;
      left: -$pointer-size / 2 - 1;
      top: calc(50% - #{$pointer-size});
      filter: drop-shadow(-2px 0px 2px rgba(52, 73, 94, 0.1));
    }
  }
</style>
