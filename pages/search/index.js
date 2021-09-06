// 导入请求对象
import { request } from '../../request/index'
// 引入 async 转换成 es5 文件， 只能单个文件进行引入
import regeneratorRuntime from '../../lib/runtime/runtime';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 表示按钮是否显示
    inpShow: false,
    // 表示输入框中的内容
    inpValue: ''
  },
  TimeId: 1,
  // 当输入框数据发生改变时
  handleInput(e){
    let {value} = e.detail
    // 进行合法校验  trim函数会把空格符取消掉
    if(!value.trim()){
      // 说明全是空格符，当没有内容
      this.setData({
        inpShow: false,
        goods: []
      })
      return
    }
    this.setData({
      inpShow: true
    })
    
    // 防抖
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(() => {
      this.qsearch(value)
    }, 1000)
  },
  // 发送请求
  async qsearch(query){
    let res = await request({
      url: '/goods/qsearch',
      data: {query}
    })
    this.setData({
      goods: res
    })
  },
  // 当点击取消按钮时将内容清空，并且清空输入框内容
  handleBtn(){
    this.setData({
      inpValue: '',
      inpShow: false,
      goods: []
    })
  }

})