import { request } from '../../request/index.js'
import { login } from '../../utils/util.js'
Page({
  data: {

  },
  onLoad: function(options) {

  },
  getuserinfo(e) {
    try {
      // 获取用户信息
      const { encryptedData, rawData, signature, iv } = e.detail
        //获取小程序登陆后的code
        // const res = await login()
        // console.log(res);
      wx.login({
        timeout: 10000,
        success: async result => {
          const { code } = result
          // 获取token所需参数
          const params = { encryptedData, rawData, signature, iv, code }
          const { token } = await request({ url: '/users/wxlogin', data: params, methods: 'post' })

          // 假token
          let distoken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'

          // 把获取的token存入缓存中并跳转回支付页面
          wx.setStorageSync("token", distoken)
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } catch (error) {
      console.log(error);
    }
  }
})