import jsonp from 'common/js/jsonp'
import axios from 'axios'
import {commonParams, options} from './config'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getDiscList () {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const data = Object.assign({}, {
    callback: 'recom6722418763006688',
    g_tk: 1021978079,
    jsonpCallback: 'recom6722418763006688',
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: '{"comm":{"ct":24},"recomPlaylist":{"method":"get_hot_recommend","param":{"async":1,"cmd":2},"module":"playlist.HotRecommendServer"}}'
  })

  return jsonp(url, data)
}
