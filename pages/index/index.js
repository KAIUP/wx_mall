// 引入发送请求方法
import { request } from '../../request/index.js'
Page({
  data: {
    bannersList: [],
    catesList: [],
    floorList: []
  },
  onLoad: function(options) {
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },
  // 获取轮播图数据
  getSwiperList() {
    request({ url: "/home/swiperdata" })
      .then(res => {
        this.setData({
          bannersList: res.data.message
        })
      })
  },
  // 获取分类导航数据
  getCateList() {
    request({ url: "/home/catitems" })
      .then(res => {
        this.setData({
          catesList: res.data.message
        })
      })
  },
  // 获取楼层数据
  getFloorList() {
    request({ url: "/home/floordata" })
      .then(res => {
        this.setData({
          floorList: res.data.message
        })
      })
  }
})