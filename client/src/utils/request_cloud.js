import Taro from '@tarojs/taro'
import { showModalError } from './util'

export default function cloudRequest({ name, data = {} }) {
  return new Promise(function (resolve) {
    Taro.cloud.callFunction({
      // 云函数名称
      name,
      // 传给云函数的参数
      data,
      success(res) {
        console.log(res)
        resolve(res)
        // console.log(`cloudName：${name}。request data：`)
        // console.log(data)
        // console.log('response data:' + JSON.stringify(data || {}))
      },
      fail(res) {
        console.log(`cloudName：${name}。request data：`)
        console.log(data)
        console.log('response: ' + JSON.stringify(res))
        let errMsg = res.errMsg
        if (/timeout|请求超时/.test(errMsg)) {
          showModalError({ content: '请求超时'})
        } else if (/fail/.test(errMsg)) {
          showModalError({ content: '系统繁忙，请稍后再试' })
        }
        resolve(false)
      }
    })
  })
}
