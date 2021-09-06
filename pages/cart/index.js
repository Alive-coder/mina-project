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
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  // 当页面加载完毕获取地址信息并进行判断显示
  onShow() {
    // 获取本地存储中的地址信息
    const address = wx.getStorageSync('address');
    // 获取本地存储中的商品信息进行展示 (或者为空数组)
    const cart = wx.getStorageSync('cart') || []

    /**判断 每个购物车中的商品的 checked 属性，如果都为 ture 则 全选按钮为选中 
     * 如果 cart 不是一个空数组，当每个 商品的 checked 属性都为 true 时就 allChecked 就为 true
     */
    this.setCart(cart)

    this.setData({
      address
    })

  },

  //  获取用户收货地址
  async handleChooseAddress() {
    /**
     *  在 wx.getSetting  方法中的 authSetting['scope.address'] 属性可以看出用户对 地址的权限
     * 1. 如果为 true 或者为 undefined 则表示 用户授权或者 刚打开页面  （这样就允许直接获取地址）
     * 2. 如果为 false 则表示 用户拒绝授权，就必须要等用户重新打开权限（ wx.openSetting） 才可以进行获取地址
     */
    // 代码优化
    // 1. 获取权限状态
    try {
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting['scope.address']
      // 2. 判断 用户是否授予权限
      if (scopeAddress === false) {
        // 用户拒绝授权 重新打开页面进行授权
        await openSetting()
      }
      // 获取地址信息
      const address = await chooseAddress()
      address.allAddress = address.provinceName + address.cityName + address.countyName + address.detailInfo || ''
      wx.setStorageSync('address', address);

    } catch (error) {
      // console.log(error)
    }
  },

  /* 对商品选择进行处理 
    1. 绑定点击事件
    2. 找到被点击商品
    3. 将被选中的商品的 checked 取反
    4. 重新赋值会 data 和 本地存储中
    5. 重新计算总价格和数量
   */
  handleItemCheck(e) {
    // 2.找到被选中的 商品 id
    let id = e.currentTarget.dataset.id
    // 3. 获取到商品列表并且对选中的商品的 checked 取反
    let cart = this.data.cart
    let index = cart.findIndex(v => v.goods_id === id)
    // 取反
    cart[index].checked = !cart[index].checked

    this.setCart(cart)

  },

  // 对总价格，总数量，以及全选进行封装
  setCart(cart) {
    // 重新计算总价格和数量
    let allChecked = true

    // 商品总数量和总价格
    let totalPrice = 0
    let totalNum = 0
    // 在本地存储中，如果被选中就进行计算总价格和总数量
    cart.forEach(v => {
      if (v.checked === true) {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      } else {
        // 只要有一个商品的 checked 为 false 全选就为 false，要不然就为 true（每一个商品都被选中（没改变默认值））
        allChecked = false
      }
    })

    // 如果 cart 为空数组，不为全选
    allChecked = cart.length ? allChecked : false

    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })

    wx.setStorageSync('cart', cart);
  },

  /* 全选和反选 
    1. 先绑定全选按钮点击
    2. 获取 allCheck 的值和 cart 
    3. 对 allCheck 取反并且 cart 中的商品checked 也跟着改变
    4. 重新计算总价格和数量
    5. 将 cart 设置会内存和 data中 ，将 allChecked 设置回data中
   */
  handleItemAllCheck() {
    // 获取 data 中的数据
    let {
      allChecked,
      cart
    } = this.data
    // 取反
    allChecked = !allChecked
    // 对 cart 中的商品进行遍历 , forEach 会对原数组改变
    cart.forEach(v => v.checked = allChecked)
    this.setCart(cart)
    // 设置会 data 中和 缓存中
    this.setData({
      allChecked
    })
  },

  /* 点击增加和减少商品数量 
  1. 先绑定点击事件，通过传递参数进行辨别，以及 goods_id
  2. 获取 data 中的 cart 
  3. 找到对应的商品，并进行数量变化
  4. 重新计算 setCart()
   */
  async changeNum(e) {
    // 接收 good_id 和 operation
    let {
      id,
      operation
    } = e.currentTarget.dataset
    // 获取到 cart 
    let {
      cart
    } = this.data
    // console.log(cart)
    // 获取对应的商品
    let index = cart.findIndex(v => v.goods_id === id)

    /* 如果数量为一并且点击了减号，时进行弹窗，意思用户是否要删除该商品，如果用户点击是就进行删除 
    否则什么都不做
     */
    if (cart[index].num === 1 && operation === -1) {

      const res = await showModal({content: '您是否要删除该商品?'})
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
      
    } else {
      // 对商品的数量的数量进行改变
      cart[index].num += operation
      // 重新计算
      this.setCart(cart)

    }
  },

  /* 去结算 
    需要判断是否填写收货地址以及是否添加商品到购物车中
  */
  async handleBuy(){
    // 获取收货地址和 商品总数
    const { address, totalNum } = this.data
    // 判断是否填写了收货地址(必须要加 return ，否则两个都会触发)
    if(!address.userName){
      await showToast({title: '您还没有填写收货地址'})
      return
    }
    // 判断是否加入了商品
    if(totalNum === 0){
      await showToast({title: '您还没有添加商品'})
      return
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    });
      

  }
  
})