import { request } from '../../request/index.js'
Page({
  data: {
    // 接口返回数据
    categories: [],
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 当前左侧菜单索引
    currentIndex: 0,
    // 右侧内容距离顶部距离
    scrollTop: 0
  },
  onLoad: function(options) {
    /*
    由于接口请求数据量大，所以可以进行本地缓存
    1. 先判断本地缓存中有没有旧数据
    2.没有旧数据则发送网络请求
    3.有旧数据同时旧数据没有过期，就是用本地缓存的数据即可
    */

    // 1 获取本地数据
    const localCates = wx.getStorageSync("cates");
    // 2 判断
    if (!localCates) {
      // 不存在即发送网络请求
      this.getCategories()
    } else {
      // 有旧数据 先判断有没有过期（自定义过期时间）
      if (Date.now() - localCates.time > 1000 * 300) {
        // 过期重新发送请求
        this.getCategories()
      } else {
        // 使用缓存数据
        this.categories = localCates.data

        // 映射出左侧菜单数据
        let leftMenuList = this.categories.map(v => v.cat_name)

        // 右侧商品数据
        let rightContent = this.categories[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  // 获取分类
  async getCategories() {
    // request({
    //   url: '/categories'
    // }).then(res => {
    //   this.categories = res.data.message

    //   // 把接口返回数据存入本地
    //   wx.setStorageSync("cates", { time: Date.now(), data: this.categories })

    //   // 映射出左侧菜单数据
    //   let leftMenuList = this.categories.map(v => v.cat_name)

    //   // 右侧商品数据
    //   let rightContent = this.categories[0].children
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    /* 使用es7 async await 发送网络请求 */
    const { data: res } = await request({ url: '/categories' })
    this.categories = res.message

    // 把接口返回数据存入本地
    wx.setStorageSync("cates", { time: Date.now(), data: this.categories })

    // 映射出左侧菜单数据
    let leftMenuList = this.categories.map(v => v.cat_name)

    // 右侧商品数据
    let rightContent = this.categories[0].children
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单点击事件
  handleItemTap(e) {
    const { index } = e.currentTarget.dataset

    // 根据不同索引来渲染右侧商品内容
    let rightContent = this.categories[index].children

    this.setData({
      currentIndex: index,
      rightContent,
      // 每次点击左侧菜单后重新设置右侧内容距离顶部距离为0
      scrollTop: 0
    })
  }
})