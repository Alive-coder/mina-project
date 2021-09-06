// getSetting 方法
export const getSetting = () => {
    return new Promise((reslove, reject) => {
        wx.getSetting({
            success: (result) => {
                reslove(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}

// chooseAddress 方法
export const chooseAddress = () => {
    return new Promise((reslove, reject) => {
        wx.chooseAddress({
            success: (result) => {
                reslove(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}

// openSetting 方法
export const openSetting = () => {
    return new Promise((reslove, reject) => {
        wx.openSetting({
            success: (result) => {
                reslove(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}

// showModal 方法
export const showModal = ({content}) => {
    return new Promise((reslove, reject) => {
        wx.showModal({
            title: '提示',
            content,
            success: (res) => {
              reslove(res)
            },
            fail: (err) => {
                reject(err)
            }
          })
    })
}

// showToast 方法
export const showToast = ({title}) => {
    return new Promise((reslove, reject) => {
        wx.showToast({
            title,
            icon: 'none',
            success: (res) => {
              reslove(res)
            },
            fail: (err) => {
                reject(err)
            }
          })
    })
}