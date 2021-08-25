// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap(e){
      // 获取点击 item  的 index 值
      // console.log(e)
      const {index} = e.currentTarget.dataset
      // console.log(index)
      // 不能直接修改这里的 tabs 的 item 的 isActive 值
      this.triggerEvent('tabsChange', index)
    }
  }
})
