import 'taro-ui/dist/style/index.scss'
import Taro, { Component } from '@tarojs/taro'
import Index from './pages/common/index/index'

import './app.styl'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  
  componentDidMount () {
    console.log('env：' + process.env.NODE_ENV)
    let env = 'dev-6w2bf'
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
    // if (process.env.NODE_ENV === '') env = 'online-qx7oz'
    Taro.cloud.init({
      env,
      traceUser: true    
    })
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  config = {
    pages: [
      'pages/common/index/index'
    ],
    subPackages: [
      {
        root: 'pages/customer',
        pages: [
          'login/login',
          'index/index',
          'user_edit/user_edit',
          'bussiness_detail/bussiness_detail'
        ]
      },
      {
        root: 'pages/business',
        pages: [
          'login/login',
          'index/index',
          'user_edit/user_edit',
          'staff_add/staff_add',
          'staff_temperature/staff_temperature',
          'staff_temperature_history/staff_temperature_history',
          'user_edit_time/user_edit_time',
          'user_edit_address/user_edit_address'
        ]
      },
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    cloud: true,
    functionalPages: {
      'independent': true
    },
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于小程序位置接口的效果展示'
      }
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
