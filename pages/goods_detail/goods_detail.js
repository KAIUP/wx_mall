import { request } from '../../request/index.js'
Page({
  data: {
    // 需要渲染的商品数据
    goods: {},
    // 接口返回的完整数据
    goodsInfo: {}
  },
  onLoad: function(options) {
    const goodsId = options.goods_id
    this.getGoodsDetail(goodsId)
  },
  async getGoodsDetail(goodsId) {
    const { data: res } = await request({ url: `/goods/detail?goods_id=${goodsId}` })
    this.data.goodsInfo = res.message
    let goodsData = res.message
    this.setData({
      // 由于返回数据对象的属性太多，只需要拿到需要渲染的数据即可
      goods: {
        goods_name: goodsData.goods_name,
        goods_price: goodsData.goods_price,
        // 部分iphone手机不支持 webp 图片格式
        // 确保后台存在jpg图片格式进行修改格式  webp => jpg
        goods_introduce: goodsData.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsData.pics
      }
    })
  },
  // 点击图片放大预览事件
  handlePrviewImage(e) {
    // 获取点击得索引
    const index = e.currentTarget.dataset.index

    // 构造需要预览的图片数组
    let urls = this.data.goods.pics.map(v => v.pics_mid)
    wx.previewImage({
      current: urls[index], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  // 点击加入购物车事件
  handleAddCart() {
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || []
      // 判断当前商品是否存在购物车中(获取商品在购物车中出现次数)
    let index = cart.findIndex(v => v.goods_id === this.data.goodsInfo.goods_id)
    console.log(index);
    if (index === -1) {
      // 商品第一次添加数量为1
      this.data.goodsInfo.num = 1
        // 添加商品选中状态
      this.data.goodsInfo.checked = false
        // 将当前商品加入到购物车数组中
      cart.push(this.data.goodsInfo)
    } else {
      // 多次添加修改数量++
      cart[index].num++
    }
    // 将购物车数据重新加入到缓存中
    wx.setStorageSync("cart", cart)
      // 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true,
    })
  }
})