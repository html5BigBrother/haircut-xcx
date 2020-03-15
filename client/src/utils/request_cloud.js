import Taro from '@tarojs/taro'
import { showModalError } from './util'

function validateResCode(code) {

}

export default function cloudRequest({ name, data = {}, errorTips = true }) {
  return new Promise(function (resolve) {
    Taro.cloud.callFunction({
      // 云函数名称
      name,
      // 传给云函数的参数
      data,
      success(res) {
        console.log('<-------------------------------------------------------------')
        console.log(`cloudName：${name}`)
        console.log('request data：')
        console.log(data)
        console.log('response: ')
        console.log(res)
        console.log('------------------------------------------------------------->')

        if (res && res.result && res.result.code) {
          const result = res.result
          if (result.code === 'success') {
            resolve(result)
          } else {
            if (errorTips) showModalError({ content: result.msg })
            resolve(result)
          }
        }
      },
      fail(res) {
        console.log('<-------------------------------------------------------------')
        console.log(`cloudName：${name}`)
        console.log('request data：')
        console.log(data)
        console.log('response: ')
        console.log(res)
        console.log('------------------------------------------------------------->')
        // console.log('response: ' + JSON.stringify(res))
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
