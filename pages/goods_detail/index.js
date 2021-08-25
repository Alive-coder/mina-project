// 导入请求对象
import { request } from '../../request/index'
// 引入 async 转换成 es5 文件， 只能单个文件进行引入
import regeneratorRuntime from '../../lib/runtime/runtime';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: {}
  },
  goodsInfo: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    const {goods_id} = options
    this.getGoodsDetail(goods_id)
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id){
    // console.log(goods_id)
    // 发送网络请求
    const res = await request({
      url: '/goods/detail',
      data: {goods_id}
    })
    this.goodsInfo = res
    console.log(res)
    this.setData({
      goodsDetail: {
        pics: res.pics,
        goods_price: res.goods_price,
        goods_name: res.goods_name,
        /**
         *  苹果用户不支持 webp 格式的图片，前端可以简单的将 webp格式转换成 jpg
         * 前提是在 后台中要存在 对应的 jpg 格式的图片
         * */ 
        goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg')
      }
    })
  },

  // 点击轮播图图片进行放大
  handlePreviewImage(e){
    // console.log(e)
    // console.log(this.goodsInfo)
    const urls = this.goodsInfo.pics.map(v => v.pics_mid)
    // console.log(e.currentTarget.dataset.currenturl)
    const current = e.currentTarget.dataset.currenturl
    wx.previewImage({
      // current 存储 当前放大的图片的 url
      current,
      // urls 存储可以放大的图片的 url
      urls
    });
      
  }

  
})