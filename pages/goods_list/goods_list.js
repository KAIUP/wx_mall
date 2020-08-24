import { request } from '../../request/index.js'
Page({
  data: {
    tabs: [{
        id: 0,
        name: '综合',
        isActive: true
      },
      {
        id: 1,
        name: '销量',
        isActive: false
      },
      {
        id: 2,
        name: '价格',
        isActive: false
      }
    ],
    //接口需要参数
    queryParams: {
      query: '',
      cid: '',
      pagenum: 1,
      pagesize: 10,
    },
    goodsList: [],
    // 总页数
    totalPages: 1
  },
  onLoad: function(options) {
    this.data.queryParams.cid = options.cid
    this.getGoodsList()
  },
  // tab标题点击事件
  tabsItemChange(e) {
    // 1.获取点击的索引
    const { index } = e.detail

    // 2.修改原数据
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)

    // 3.赋值到data中
    this.setData({
      tabs
    })
  },
  // 获取商品列表数据
  async getGoodsList() {
    const { data: res } = await request({ url: '/goods/search', data: this.data.queryParams })
      // 获取总条数
    const total = res.message.total
      // 总页数 = 总条数/获取的条数 [并向上取整 Math.ceil()]
    this.data.totalPages = Math.ceil(total / this.data.queryParams.pagesize)
    this.setData({
      goodsList: [...this.data.goodsList, ...res.message.goods]
    })

    // 当数据请求成功后关闭下拉刷新窗口
    wx.stopPullDownRefresh()
  },
  // 页面上拉触底事件
  onReachBottom() {
    // 判断是否还有数据(当前页数大于等于总页数时，表示没有数据了)
    if (this.data.queryParams.pagenum >= this.data.totalPages) {
      wx.showToast({ title: '没有更多数据了' })
    } else {
      this.data.queryParams.pagenum++
        this.getGoodsList()
    }
  },
  // 下拉刷新事件
  onPullDownRefresh() {
    // 1.清空商品数据
    this.setData({
      goodsList: []
    })

    // 2.重置页码
    this.data.queryParams.pagenum = 1

    // 3.重新发送请求
    this.getGoodsList()
  }
})