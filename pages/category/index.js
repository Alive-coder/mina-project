// 导入请求对象
import { request } from '../../request/index'
// 引入 async 转换成 es5 文件， 只能单个文件进行引入
import regeneratorRuntime from '../../lib/runtime/runtime';

// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    // Cates: [],
    leftMenuList: [],
    rightCotent: [],
    currentIndex: 0,
    scrollTop: 0
  },
  Cates: [],
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 1.获取本地存储库中的数据
    const Cates = wx.getStorageSync('cates');

    // 2.当本地没有存储数据时就发送请求
    if(!Cates){
      this.getCates()
    }else{
      // 当有旧数据时,当超过时间时也发送请求
      if(Date.now() - Cates.time > 10000){
        this.getCates()
      }
      else{
        this.Cates = Cates.data
        // console.log('使用')
        // 进行渲染
        let leftMenuList = this.Cates.map(v => v.cat_name)
        let rightCotent = this.Cates[0].children
        // console.log(leftMenuList)
        this.setData({
          leftMenuList,
          rightCotent
        })
      }

    }
  },
  // 请求数据
  async getCates(){
    // request({
    //   url: '/categories'
    // })
    // .then(result => {
    //   // 写法一：
    //   // this.setData({
    //   //   Cates: result.data.message
    //   // })
    //   // // console.log(this.Cates)

    //   // let leftMenuList = this.data.Cates.map(v => v.cat_name)
    //   // let rightCotent = this.data.Cates[0].children
    //   // // console.log(leftMenuList)
    //   // this.setData({
    //   //   leftMenuList,
    //   //   rightCotent
    //   // })

    //   // 写法二：
    //   this.Cates = result.data.message

    //   // 3.把接口中的数据存储到本地存储库中
    //   wx.setStorageSync('cates', {time: Date.now(), data: this.Cates});
        
    //   let leftMenuList = this.Cates.map(v => v.cat_name)
    //   let rightCotent = this.Cates[0].children
    //   // console.log(leftMenuList)
    //   this.setData({
    //     leftMenuList,
    //     rightCotent
    //   })

    // })

    // 使用 async 处理异步请求  , 只有执行了下面的请求代码才会继续往下执行
    const result = await request({url: '/categories'})

      this.Cates = result

      wx.setStorageSync('cates', {time: Date.now(), data: this.Cates});
        
      let leftMenuList = this.Cates.map(v => v.cat_name)
      let rightCotent = this.Cates[0].children
      // console.log(leftMenuList)
      this.setData({
        leftMenuList,
        rightCotent
      })

  },
  // 点击左侧菜单进行切换
  handleItemTap(e){
    // console.log(e)
    // 将 index 赋值给 currentIndex 用于切换
    let {index} = e.currentTarget.dataset
    // 当点击菜单时，请求 index 的数据
    let rightCotent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightCotent,
      // 将 scrollTop 设置为 0 置顶
      scrollTop: 0
    })
  }




})