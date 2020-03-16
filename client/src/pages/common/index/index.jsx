import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.styl'

import { navigateTo, reLaunch, setUserInfo } from '../../../utils/util'
import cloudRequest from '../../../utils/request_cloud'

// import { set as setGlobalData, get as getGlobalData } from '../../../utils/global_data'
import icon_logo from '../../../static/imgs/icon_logo.svg'
import index_bg from '../../../static/imgs/index_bg.png'

export default class Index extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () { }

  componentDidMount () {}

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '首页'
  }

  async onClickBusiness() {
    Taro.showLoading({ title: '加载中', mask: true })
    const res = await cloudRequest({ name: 'autoLogin', data: { type: 'business' }, errorTips: false })
    Taro.hideLoading()
    if (res.code === 'success') {
      setUserInfo({ identity: 'business', data: res.data })
      reLaunch('/pages/business/index/index')
    } else {
      navigateTo('/pages/business/login/login')
    }
  }

  async onClickCustomer() {
    // navigateTo('/pages/customer/login/login')
    Taro.showLoading({ title: '加载中', mask: true })
    const res = await cloudRequest({ name: 'autoLogin', data: { type: 'customer' }, errorTips: false })
    Taro.hideLoading()
    if (res.code === 'success') {
      setUserInfo({ identity: 'customer', data: res.data })
      reLaunch('/pages/customer/index/index')
    } else {
      navigateTo('/pages/customer/login/login')
    }
  }

  render () {
    return (
      <View className='p-page'>
        <View className='p-contain'>
          <Image className='u-bg-logo' src={index_bg} />
          <View className='u-brand-name'>快预约</View>
          <View className='u-brand-slogan'>这是一句宣传语</View>
          <View className='u-enter-wrap'>
            <Button className='u-enter-item btn-style btn-purple' hoverClass='btn-hover' onClick={this.onClickBusiness.bind(this)}>我是商家</Button>
            <Button className='u-enter-item btn-style btn-orange' hoverClass='btn-hover' onClick={this.onClickCustomer.bind(this)}>我是客户</Button>
          </View>
          <View className='u-foot'>
            <Image className='u-foot-logo' src={icon_logo} />
            <Text>这里也是一段文案或者公司名称</Text>
          </View>
        </View>
      </View>
    )
  }
}
