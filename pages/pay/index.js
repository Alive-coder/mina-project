import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from '../../utils/asyncWx.js';
// 引入 async 转换成 es5 文件， 只能单个文件进行引入
import regeneratorRuntime from '../../lib/runtime/runtime';

// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  // 当页面加载完毕获取地址信息并进行判断显示
  onShow() {
    // 获取本地存储中的地址信息
    const address = wx.getStorageSync('address');
    // 获取本地存储中的商品信息进行展示 (或者为空数组)
    let cart = wx.getStorageSync('cart') || []
    // 只对 被选中的 商品进行过滤
    cart = cart.filter(v => v.checked)


    // 商品总数量和总价格
    let totalPrice = 0
    let totalNum = 0
    // 在本地存储中，如果被选中就进行计算总价格和总数量
    cart.forEach(v => {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      })

    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },

  
  
  
})