<template>
  <transition name="slide">
    <div class="user-center">
      <!-- 返回键 -->
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <!-- 按钮控件 -->
      <div class="switches-wrapper">
        <switches :currentIndex="currentIndex" :switches="switches" @switch="switchItem"></switches>
      </div>
      <!-- 播放按钮 -->
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <!-- 歌曲列表 -->
      <div class="list-wrapper" ref="listWrapper">
        <!-- 收藏历史 -->
        <scroll ref="favortieList" class="list-scroll" v-if="currentIndex === 0" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <!-- 播放历史 -->
        <scroll ref="playList" class="list-scroll" v-if="currentIndex === 1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <!-- 无数据时展示 -->
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
  import Switches from '@/base/switches/switches' // 按钮控件
  import SongList from '@/base/song-list/song-list' // 歌曲列表
  import Scroll from '@/base/scroll/scroll' // 滚动组件
  import NoResult from '@/base/no-result/no-result' // 无数据提示
  import Song from '@/common/js/song' // 初始化数据结构
  import {playlistMixin} from '@/common/js/mixin' // 公共组件
  import {mapGetters, mapActions} from 'vuex'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        currentIndex: 0, // 按钮默认选中位置
        switches: [
          {name: '我喜欢的'},
          {name: '最近听的'}
        ]
      }
    },
    computed: {
      // 判断那个选着下
      noResult() {
        if (this.currentIndex === 0) {
          return !this.favoriteList.length
        } else {
          return !this.playHistory.length
        }
      },
      // 提示问题
      noResultDesc() {
        if (this.currentIndex === 0) {
          return '暂无收藏歌曲'
        } else {
          return '你还没有听过歌曲'
        }
      },
      ...mapGetters([
        'favoriteList',
        'playHistory'
      ])
    },
    methods: {
      // 返回上一层
      back() {
        this.$router.back()
      },
      // 切换按钮控件
      switchItem(index) {
        this.currentIndex = index
      },
      // 处理滚动
      handlePlaylist(playlist) {
        const bottom = playlist.length ? '60px' : 0
        // 修改bottom
        this.$refs.listWrapper.style.bottom = bottom
        // 重置展示中的组件的滚动高度
        this.$refs.favoriteList && this.$refs.favoriteList.refresh()
        this.$refs.playlist && this.$refs.playList.refresh()
      },
      // 随机播放
      random() {
        // 根据下标判断当前添加那个列表的歌曲
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
        if (list.length === 0) {
          return
        }
        // 循环操作实例
        list = list.map((item) => {
          console.log(item.url)
          return new Song(item)
        })
        // 把处理好的数据结构添加到歌曲列表
        this.randomPlay({list})
      },
      // 选中歌曲
      selectSong(song) {
        this.insertSong(new Song(song)) // 插入歌曲
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    },
    components: {
      Switches,
      SongList,
      Scroll,
      NoResult
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 5px
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
