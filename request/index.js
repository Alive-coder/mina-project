// 用于记录同时发送请求的数量
let ajaxTimes = 0

export const request = (params) => {

    ajaxTimes++

    // 每次请求数据就显示加载中图标，接收到数据就关闭
    wx.showLoading({
        title: '加载中',
        mask: true
    });
      

    // 定义 baseUrl 变量用来存储基础的路径
    const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
    return new Promise((reslove, reject) => {
        wx.request({
            ...params,
            // 进行拼接
            url: baseUrl + params.url,
            success: (result) => {
                // 将 返回结果的 data 数据直接取出来
                reslove(result.data.message)
            },
            fail: (err) => {
                reject(err)
            },
            // 无论请求成功或失败都关闭加载按钮
            complete: () => {
                ajaxTimes--
                // 当都发送完成了再取消 加载中 显示
                if(ajaxTimes === 0){
                    wx.hideLoading()
                }
            }
        });
    })
}