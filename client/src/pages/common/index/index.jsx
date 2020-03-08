import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.styl'

// import { set as setGlobalData, get as getGlobalData } from '../../../utils/global_data'
import Login from '../../../components/login/index'

export default class Index extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () { }

  componentDidMount () {
    Taro.navigateTo({ url: '/pages/customer/login/login' })
   }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '首页'
  }

  render () {
    console.log(process.env.NODE_ENV)
    return (
      <View className='p-page'>
        <Login />
      </View>
    )
  }
}
