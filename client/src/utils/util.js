import Taro from '@tarojs/taro'


// 保存登录信息
export function setUserInfo(option) {
  if (option) {
    Taro.setStorageSync('identity', option.identity)
    Taro.setStorageSync('id', option.data.id)
  }
}

// 清除登录信息
export function clearUserInfo() {
  Taro.removeStorageSync('identity')
  Taro.removeStorageSync('id')
}

// 获取登录信息
export function getUserInfo() {
  const identity = Taro.getStorageSync('identity') || ''
  const id = Taro.getStorageSync('id') || ''
  return { identity, id }
}

// 路由
function queryFromObjectToString(url, query) {
  let queryStr = ''
  if (query) {
    queryStr = url.indexOf('?') >= 0 ? '&' : '?'
    for (let key in query) {
      queryStr += `${key}=${query[key]}&`
    }
    queryStr = queryStr.substr(0, queryStr.length - 1)
  }
  return url + queryStr
}

export function navigateTo(url, query) {
  Taro.navigateTo({ url: queryFromObjectToString(url, query) })
}

export function redirectTo(url, query) {
  Taro.redirectTo({ url: queryFromObjectToString(url, query) })
}

export function reLaunch(url, query) {
  Taro.reLaunch({ url: queryFromObjectToString(url, query) })
}

// 弹框
export function showModal({ title, content, showCancel, confirmText, cancelText, confirmColor, cancelColor }) {
  return new Promise(function (resolve) {
    Taro.showModal({
      title: title || '提示',
      content: content || '提示',
      showCancel: showCancel !== false,
      confirmText: confirmText || '确定',
      cancelText: cancelText || '取消',
      confirmColor: confirmColor || '#3CC51F',
      cancelColor: cancelColor || '#353535',
      success(res) {
        if (res.confirm) resolve(true)
        else if (res.cancel) resolve(false)
      }
    })
  })
}
export function showModalError({ title, content, confirmText, confirmColor }) {
  return new Promise(function () {
    Taro.showModal({
      title: title || '错误',
      content: content || '系统繁忙',
      showCancel: false,
      confirmText: confirmText || '确定',
      confirmColor: confirmColor || '#3CC51F',
    })
  })
}