/*当页面同时发送多个异步请求时，需要等待这些请求都发送完毕后再关闭loading*/
let ajaxTimes = 0 // 初始发送请求次数
export const request = (params) => {
  // 每调用一次请求次数增加 1
  ajaxTimes++
  // loading效果(发送请求之前显示)
  wx.showLoading({
    title: '加载中',
    mask: true
  })

  // 定义公共url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        // 每发送完毕后次数减1
        ajaxTimes--
        // 当请求都发送完后再关闭
        if (ajaxTimes === 0) {
          // 关闭loading效果
          wx.hideLoading()
        }
      }
    })
  })
}