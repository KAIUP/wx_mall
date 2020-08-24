Page({
  data: {
    cartData: [],
    AllChecked: false,
    totalPrice: 0,
    totalNum: 0,
  },
  onLoad: function(options) {

  },
  onShow() {
    // 获取缓存中购物车数据
    const cartData = wx.getStorageSync("cart") || []
    this.setCart(cartData)
  },
  // 购物车商品的选中
  checkedChange(e) {
    // 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id
      // 获取购物车数据
    let { cartData } = this.data
      // 根据获取的商品id找到该对应商品
    let index = cartData.findIndex(v => v.goods_id === goods_id)
      // 该商品的选中状态进行取反
    cartData[index].checked = !cartData[index].checked
    this.setCart(cartData)
  },
  // 设置购物车状态时进行的操作
  setCart(cartData) {
    let AllChecked = true
    let totalPrice = 0
    let totalNum = 0
    cartData.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      } else {
        AllChecked = false
      }
    })

    // 判断数据是否为空
    AllChecked = cartData.length ? AllChecked : false
    this.setData({
      cartData,
      AllChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync("cart", cartData);
  },
  // 全选功能
  handleAllChecked() {
    // 获取data中数据
    let { cartData, AllChecked } = this.data
      // 修改全选的状态
    AllChecked = !AllChecked
      // 循环修改商品中的选中状态
    cartData.forEach(v => v.checked = AllChecked)
      // 把购物新数据重新设置回data和缓存中
    this.setCart(cartData)
  },
  // 修改商品数量事件
  editCount(e) {
    // 获取传过来的值
    const { operation, id } = e.currentTarget.dataset
    let { cartData } = this.data
      // 获取对应商品的索引
    let index = cartData.findIndex(v => v.goods_id === id)
      // 判断商品数量不能为0的操作
    if (cartData[index].num == 1 && operation == -1) {
      wx.showToast({ title: '该商品数量不能再少了', icon: "none" })
      return
    }
    // 进行+-操作
    cartData[index].num += operation
      // 重新设置值
    this.setCart(cartData)
  },
  // 结算功能
  handleToPay() {
    if (this.data.totalNum === 0) {
      return wx.showToast({ title: '您好没有选购商品', icon: "none" })
    }
    wx.navigateTo({
      url: `/pages/pay/pay?totalPrice=${this.data.totalPrice}&totalNum=${this.data.totalNum}`,
    })
  }
})