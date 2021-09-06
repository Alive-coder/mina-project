// 导入请求对象
import { request } from '../../request/index'
// 引入 async 转换成 es5 文件， 只能单个文件进行引入
import regeneratorRuntime from '../../lib/runtime/runtime';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: {},
    // 表示商品是否被选中，true为被选中，false未被选中
    isCollect: false
  },
  goodsInfo: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    // console.log(options)
    // 使用 页面栈 获取到 options
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length - 1]
    let options = currentPage.options
      
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
    // console.log(res)

    // 1. 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || []
    //  2. 判断当前商品是否被选中
    let isCollect = collect.some(v => v.goods_id === this.goodsInfo.goods_id)

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
      },
      isCollect
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
      
  },


  /**   加入购物车  （存储在本地内存中）
   * 1. 先绑定点击按钮
   * 2. 获取本地内存中的 cart ， 判断本地存储中是否有这个商品
   * 3. 如果没有就直接添加商品
   * 4. 如果有就商品数量 ++
   * 5. 再将改变之后的数组设置会本地存储中
   * 6. 提示用户添加成功
   */
   handleAddCart(){
    //  获取本地存储中的 购物车数组
     let cart = wx.getStorageSync('cart') || []
    //  判断 商品对象是否存在于 购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id)
    if(index === -1){
      // 商品对象不存在与 购物车数组中
      this.goodsInfo.num = 1
      this.goodsInfo.checked = true
      cart.push(this.goodsInfo)
    }else{
      // 存在
      cart[index].num++
    }
    // 将改变后的数组设置为本地存储
    wx.setStorageSync('cart', cart);
    // 给用户提示
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      mask: true
    });
      
      
     
       
   },


  //  点击收藏切换商品收藏状态
  collectChange(){
    // 1.切换点击选中状态
    let isCollect = false
    // 2. 获取缓存中的收藏数组
    let collect = wx.getStorageSync('collect') || [];
    // 3. 判断数组中是否含有该商品（该商品是否被收藏）
    let index = collect.findIndex(v => v.goods_id === this.goodsInfo.goods_id)
    // 4. 判断商品是否被选中
    if(index !== -1){
      // 已经被收藏过了，删除该商品
      collect.splice(index, 1)
      isCollect = false
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: true
      });
        
    }else{
      // 未被收藏，收藏该商品
      collect.push(this.goodsInfo)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    // 5. 重新将 收藏数组 存入缓存中
    wx.setStorageSync('collect', collect);
    this.setData({isCollect})
      
      
  }

  
})