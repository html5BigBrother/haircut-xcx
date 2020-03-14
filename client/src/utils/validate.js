import Taro from '@tarojs/taro'


// 参数说明
// vArr
//     类型：数组[]
//     数组子项说明：
//         类型：对象{}
//         键：
//             type 验证类型，如vPhone
//             value 验证的值，如18866667777
//             msg 错误时的提示信息，如手机号错误
//             vFunc 没有公共验证类型时可设置的验证函数
// 当有一项验证失败时就会自动跳出，返回false

const methods = {
  vEmpty(v) {
    v = v === 0 ? '0' : v
    return !!v
  },
  vArrEmpty(arr) {
    return arr && arr.length > 0
  },
  vPhone(v) {
    return /^1[0-9]{10}$/.test(v)
  },
  vPassword: function vPassword(v) {
    if (v) {
      return !/\s+/.test(v)
    }
    return true
  },
  vMinBusinessNum: function vPassword(v) {
    return v.length >= 13
  },
  vMaxBusinessNum: function vPassword(v) {
    return v.length <= 18
  },
  vSpecialChar: function (v) {
    return !(/#|\?|=|&/.test(v))
  },
  vIdentifyCode(code) {
    if (!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
      return false
    } else {
      if (code.length === 18) {
        code = code.split('')
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
        var sum = 0
        var ai = 0
        var wi = 0
        for (var i = 0; i < 17; i++) {
          ai = code[i]
          wi = factor[i]
          sum += ai * wi
        }
        // var last = parity[sum % 11]
        if (parity[sum % 11].toString() !== code[17]) {
          return false
        }
      }
    }

    return true
  },
  vTel(v) {
    return /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(v)
  }
}

function validate(vArr, showError) {
  showError = showError !== false
  let vObj, vType, value, msg, vFunc, vRes
  for (let i = 0, len = vArr.length; i < len; i++) {
    vObj = vArr[i]
    vType = vObj.type
    value = vObj.value
    msg = vObj.msg
    vFunc = vObj.vFunc

    vRes = false
    if (methods[vType]) {
      vRes = methods[vType](value)
    } else if (vFunc) {
      vRes = vFunc(value)
    }

    if (!vRes) {
      if (showError) {
        return msg
      }
      return false
    }
  }

  return true
}
validate.methods = methods

export default validate
