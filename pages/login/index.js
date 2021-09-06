// pages/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 获取用户信息并且保存至本地存储
  handleGetUserInfo(e) {

    // console.log(e)
    const { userinfo } = e.detail
    // 加入到缓存中 
    wx.setStorageSync('userinfo', userinfo);
    // 返回上一层页面
    wx.navigateBack({
      delta: 1
    });
  }
})