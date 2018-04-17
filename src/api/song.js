import jsonp from 'common/js/jsonp'
import { commonParams, Guid } from './config'
import axios from 'axios'

// 获取歌曲的完整路径 传入歌曲id和歌曲文件名
export function getSongs (songmid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = Object.assign({}, commonParams, {
    g_tk: 1013223097,
    hostUin: 0,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    songmid: songmid,
    filename: `C400${songmid}.m4a`,
    guid: Guid,
    callback: 'MusicJsonCallback7948110260497878',
    jsonpCallback: 'MusicJsonCallback7948110260497878'
  })
  const option = {
    param: 'callback',
    prefix: 'callback'
  }
  return jsonp(url, data, option)
}

// 获取歌词
export function getLyric(mid) {
  const url = '/api/lyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
