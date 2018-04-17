import {getSongs, getLyric} from 'api/song'
import {ERR_OK, Guid} from '@/api/config'
import {Base64} from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        // 判断返回字符是否为字符串 处理jsoncallback为字符串的情况
        if (typeof res === 'string') {
          let reg = /^\w+\(({[^()]+})\)$/ // 处理callback数据
          let matches = res.match(reg) // match 检索是否存在数值
          if (matches) {
            // json转换
            let ret = JSON.parse(matches[1])
            if (ret.retcode === ERR_OK) {
              this.lyric = Base64.decode(ret.lyric)
              console.log(this.lyric)
              resolve(this.lyric)
            } else {
              reject(new Error('no lyric'))
            }
          }
        }
      })
    })
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: ''
  })
}
function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

// 歌曲播放地址
export function getSongUrl (song, mId) {
  getSongs(mId).then((res) => {
    if (res.code === ERR_OK) {
      if (res.data.items) {
        let item = res.data.items[0]
        song.url = `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=${Guid}&fromtag=66`
      }
    }
  })
}
