<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from '@/components/music-list/music-list'
  import { getSongList } from '@/api/recommend' // 推荐歌曲接口
  import { ERR_OK } from '@/api/config'
  import { mapGetters } from 'vuex' // 获取vuex里面的disc信息
  import { createSong, getSongUrl } from '@/common/js/song' // 处理数据结构
  export default {
    name: 'disc',
    data () {
      return {
        songs: []
      }
    },
    computed: {
      title () {
        return this.disc.title
      },
      bgImage () {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    created () {
      this._getSongList()
    },
    methods: {
      _getSongList () {
        // 如果没有推荐列表的id 就返回去
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          }
        })
      },
      // 歌曲结构处理
      _normalizeSongs (list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        // 循环添加歌曲地址
        ret.forEach(item => {
          item.url = getSongUrl(item, item.mid)
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
