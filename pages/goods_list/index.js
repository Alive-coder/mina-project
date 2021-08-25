// 导入请求对象
import { request } from '../../request/index'
// 引入 async 转换成 es5 文件， 只能单个文件进行引入
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },
  // 记录发送请求时的参数
  QueryParams:{
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPage: 1,

  // 监听自定义事件（改变点击 tabs 标题改变效果）
  handleTabsChange(e){
    // console.log(e)
    const index = e.detail
    let {tabs} = this.data
    // console.log(tabs)
    tabs.forEach((v, i) => i===index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })

  },
  
  // 请求数据
  async getGoodsList(){
    const result = await request({
      url: '/goods/search',
      data: this.QueryParams
    })
    console.log(result)
    
    // 1. 获取 总页数
    this.totalPage = Math.ceil(result.total / this.QueryParams.pagesize)
    // console.log(this.totalPage)

    // const goodsList = this.data.goodsList
    // goodsList.push(...result.goods)

    this.setData({
      // 如果有下一页，下一页数据拼接到前一页数据上
      goodsList: [...this.data.goodsList, ...result.goods]
      // goodsList
    })

    // 当下拉刷新发送请求显示页面时就关闭显示下拉刷新效果, 在没有使用下拉刷新时也不会对页面有影响
    wx.stopPullDownRefresh()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options 就存储着 url 传递过来的参数
    // console.log(options)
    this.QueryParams.cid = options.cid

    this.getGoodsList()
  },

  /** 上拉加载更多
   * 1. 判断是否有下一页，如果有就加载，没有就显示没有数据
   *    ① 总页数： result.total / 页面条数 pagesize
   * 
   */
  onReachBottom(){
    // 2. 判断 总页数和 当前页面的关系，如果当前页面 >= 总页码 显示没有数据
    if(this.QueryParams.pagenum >= this.totalPage){
      // 没有数据了
      // console.log('没有数据了')
      wx.showToast({title: '没有更多数据了' });
        
    }else{
      // 重新发送请求
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },

  /** 下拉刷新页面
   *    1. 清空 goodsList 数组
   *    2. 重置页码
   *    3. 重新发送请求
   */
  onPullDownRefresh(){
    this.setData({
      goodsList: []
    })
    this.QueryParams.pagenum = 1
    this.getGoodsList()
  }
})