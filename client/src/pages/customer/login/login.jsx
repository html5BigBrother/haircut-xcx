import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import './login.styl'

// import Login from '../../../components/login/index'
import icon_logo from '../../../static/imgs/icon.jpg'

export default class Login extends Component {

  constructor (props) {
    super(props)
    this.state = {
      // show: true,
      // buttons: [
      //   {
      //     type: 'default',
      //     className: '',
      //     text: '辅助操作',
      //     value: 0
      //   },
      //   {
      //       type: 'primary',
      //       className: '',
      //       text: '主操作',
      //       value: 1
      //   }
      // ]
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '登录',
  }

  onClickLogin() {
    // Taro.login({
    //   success: function (res) {
    //     console.log(res)
    //     if (res.code) {
    //       //发起网络请求
    //       // Taro.request({
    //       //   url: 'https://test.com/onLogin',
    //       //   data: {
    //       //     code: res.code
    //       //   }
    //       // })
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })

    Taro.navigateTo({ url: '/pages/customer/index/index' })

    // Taro.cloud.callFunction({
    //   name: 'customerRegiste',
    //   // 传给云函数的参数
    //   data: {
    //     name: 'hjaha',
    //     phone: '12345678901',
    //   },
    //   // 成功回调
    //   complete: () => {

    //   }
    // })
  }

  render () {
    return (
      <View className='p-page'>
        <View className='p-contain'>
          <View className='u-logo-box'>
            <Image className='u-logo-icon' src={icon_logo} />
            <View className='u-logo-text'>快预约</View>
          </View>
          <Button className='btn-style btn-primary u-btn' hoverClass='btn-hover' onClick={this.onClickLogin}>手机号登录</Button>
          <Button className='btn-style btn-default u-btn' hoverClass='btn-hover'>取消</Button>
        </View>
      </View>
    )
  }
}
