import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.styl'

import { navigateTo } from '../../../utils/util'

// import { set as setGlobalData, get as getGlobalData } from '../../../utils/global_data'
import icon_logo from '../../../static/imgs/icon.jpg'

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

  onClickBusiness() {
    navigateTo('/pages/business/login/login')
  }

  onClickCustomer() {
    navigateTo('/pages/customer/login/login')
  }

  render () {
    console.log(process.env.NODE_ENV)
    return (
      <View className='p-page'>
        <View className='p-contain'>
          <Image className='u-bg-logo' src={icon_logo} />
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
