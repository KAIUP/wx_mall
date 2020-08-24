import { request } from '../../request/index.js'
Page({
  data: {
    goods: [],
    totalPrice: 0,
    totalNum: 0,
  },
  onLoad: function(options) {
    // 获取传递过来的参数
    let { totalPrice, totalNum } = options
    // 获取缓存中的购物车数据
    const cartData = wx.getStorageSync("cart") || []
      // 过滤出已选中的商品
    const goods = cartData.filter(v => v.checked)
    this.setData({
      goods,
      totalPrice,
      totalNum
    })
  },
  async handleToPay() {
    // 1.获取缓存中的token
    const token = wx.getStorageSync("token")

    // 2.没有token跳转到授权页面
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
      return
    }

    // 3.创建订单
    const header = { Authorization: token }
      // 3.1 准备创建订单所需参数
    const order_price = this.data.totalPrice
    const consignee_addr = '江西省南昌市青山湖区'
    let goods = []
    this.data.goods.forEach(v => {
        goods.push({
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.goods_price
        })
      })
      // 所有请求参数
    const orderParams = {
        order_price,
        consignee_addr,
        goods
      }
      // 3.2 发送请求创建订单，获取订单编号
    let { order_number } = await request({ url: '/my/orders/create', data: orderParams, methods: 'POST', header: header })
    order_number = 'HMDD20200718000000001058'
      // 3.3 发起预支付请求
    const res = await request({ url: 'my/orders/req_unifiedorder', data: order_number, methods: 'POST', header: header })
    console.log(res);
  }
})