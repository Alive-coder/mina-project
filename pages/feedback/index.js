// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false
      }
    ],
    // 选择的图片
    chooseImgs: [],
    // 存储文本域中的内容
    inpValue: '',

  },
  // 存储外网图片
  upLoadImgs: [],

  // 切换 tabs 效果
  handleTabsChange(e) {
    // console.log(e)
    const index = e.detail
    let {
      tabs
    } = this.data
    // console.log(tabs)
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })

  },

  // 点击按钮选择图片
  chooseImgs() {
    wx.chooseImage({
      // 最多选择的图片数量
      count: 9,
      // 图片的尺寸（原图/压缩）
      sizeType: ['original', 'compressed'],
      // 图片来源（照相机/相册）
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    });

  },

  // 点击图片将图片进行移除
  removeImg(e) {
    const {
      index
    } = e.currentTarget.dataset
    const {
      chooseImgs
    } = this.data
    chooseImgs.splice(index, 1)
    this.setData({
      chooseImgs
    })
  },

  // 当文本域中输入内容时触发
  handleTextInput(e) {
    console.log(e)
    this.setData({
      inpValue: e.detail.value
    })
  },

  // 提交
  handleCommit() {
    // 1.获取到文本框中的内容
    const {
      inpValue,
      chooseImgs
    } = this.data
    // 2. 对内容进行合法性的验证
    if (!inpValue.trim()) {
      // 不合法，进行弹窗提示
      wx.showToast({
        title: '您输入的内容不合法',
        icon: 'none',
        mask: true
      });
      return
    }
    // 6. 进行弹窗提示
    wx.showLoading({
      title: '正在上传中',
      mask: true
    });
      

    // 7. 如果有上传图片就和文字一起上传，否则就直接上传文字
    if(chooseImgs.length != 0){
      // 3. 将图片上传到外网之后返回外网的 url
      // 4. 对选择的图片进行循环
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          // 需要上传到网站
          url: 'https://img.coolcr.cn/api/upload',
          // 需要上传的图片地址
          filePath: v,
          // 上传图片的名称，以便于后端获取到该数据
          name: 'image',
          // 顺带的参数
          formData: {},
          success: (result) => {
            console.log(result)
            let url = JSON.parse(result.data).data.url
            this.upLoadImgs.push(url)
            console.log(this.upLoadImgs)
  
            // 5.当全部都提交完成了执行
            if (i === chooseImgs.length - 1) {
  
              // 隐藏加载
              wx.hideLoading();
  
              console.log('将图片和文本都提交给服务器')
              // 重置页面
              this.setData({
                inpValue: '',
                chooseImgs: []
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });
                
            }
          }
        });
  
  
  
  
      })
    }else{
      // 8. 只有文字
      console.log('只上传了文字')
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
        
    }

  }

})