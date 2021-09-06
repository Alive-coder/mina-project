// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: false
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '退货/退款',
        isActive: false
      },
    ]

  },
  // 监听自定义事件（改变点击 tabs 标题改变效果）
  handleTabsChange(e){
    // console.log(e)
    const index = e.detail
    this.changeTitleActive(index)
    
  },
  // 改变标题样式
  changeTitleActive(index){
    let {tabs} = this.data
    // console.log(tabs)
    tabs.forEach((v, i) => i===index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },

  onShow(){
    /* 这里只是拿到从个人中心传入的 type 值，方便发送请求获取订单信息进行展示 */
    // 获取历史页面信息
    let pages =  getCurrentPages();
    // 获取当前页面信息
    let currentPage = pages[pages.length - 1]
    // 获取 options 的 type 值
    let type = currentPage.options.type
    console.log(type)
    // 当页面刚进入时，使外界的标题选中和页面中的选中效果一致
    this.changeTitleActive(type - 1)
  }
  

})