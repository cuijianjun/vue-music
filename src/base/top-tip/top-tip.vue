<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    delay: {
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      showFlag: false
    }
  },
  methods: {
    // 展示
    show () {
      this.showFlag = true
      // 以防反复调用 先清除以前的timeout
      clearTimeout(this.timer)
      // 延时收起
      this.timer = setTimeout(() => {
        this.hide()
      }, this.delay)
    },
    // 隐藏
    hide () {
      this.showFlag = false
    }
  }
}
</script>

<style lang="stylus" scoped>
 @import "~common/stylus/variable"

  .top-tip
    position: fixed
    top: 0
    width: 100%
    z-index: 500
    background: $color-dialog-background
    &.drop-enter-active, &.drop-leave-active
      transition: all 0.3s
    &.drop-enter, &.drop-leave-to
      transform: translate3d(0, -100%, 0)
</style>
