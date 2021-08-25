// 导入请求对象
import { request } from '../../request/index'

//Page Object
Page({
  data: {
    // 导航栏数据
    swiperList: [],
    // 分类数据
    cartsList: [],
    // 楼层数据
    floorList: []

  },
  // 当页面刚开始加载时就发送网络请求
  onLoad(){
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // });
    this.getSwiperList(),
    this.getCartsList(),
    this.getFloorList()
  },
  // 获取轮播图数据
  getSwiperList(){
    request({url: '/home/swiperdata'})
    .then(result => {
      this.setData({
        swiperList: result
       })
    })
  },
  // 获取分类数据
  getCartsList(){
    request({url: '/home/catitems'})
    .then(result => {
      this.setData({
        cartsList: result
       })
    })
  },
  // 获取楼层数据
  getFloorList(){
    request({url: '/home/floordata'})
    .then(result => {
      this.setData({
        floorList: result
       })
    })
  }








});
  