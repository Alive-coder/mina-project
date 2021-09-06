// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    collectNums: 0
  },
  onShow(){
    // 可以直接在内存中获取到用户信息，这里只是做演示
    const userinfo = {}
    userinfo.name = 'Alive'
    userinfo.image = 'https://img0.baidu.com/it/u=2504077138,2582278536&fm=26&fmt=auto&gp=0.jpg'

    // 获取商品收藏数量进行展示
    let collect = wx.getStorageSync('collect');
      
    this.setData({userinfo, collectNums: collect.length})
  }

})