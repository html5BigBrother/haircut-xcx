import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtTabBar, AtIcon, AtDivider } from 'taro-ui'
import './index.styl'

import icon_logo from '../../../static/imgs/icon.jpg'

export default class Index extends Component {

  constructor (props) {
    super(props)
    this.state = {
      current: 0,
      businessList: [
        { name: '桥主' },
        { name: '主力' },
        { name: '哈尼' },
        { name: '三地' }
      ],
      orderList: [
        { name: '1' },
        { name: '1' },
        { name: '1' },
        { name: '1' },
      ]
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '快预约',
  }

  onClickLogin() {
    Taro.navigateTo({ url: '/pages/customer/index/index' })
  }
  onClickTabBar(value) {
    this.setState({
      current: value
    })
  }

  renderBusinessList() {
    const { businessList } = this.state
    return (
      <View className='p-section-business'>
        <View className='u-title'>商家列表</View>
        <View className='p-list-business'>
          {
            businessList.map((item) => 
              <View className='u-item' key={item.id}>
                <Image className='u-item-image' src={icon_logo}></Image>
                <View className='flex-1'>
                  <View className='u-item-text-1'>
                    <Text style={`margin-right: ${Taro.pxTransform(12)};`}>item.name</Text>
                    <AtIcon value='check-circle' color='#30CB9B' size={14}></AtIcon>
                  </View>
                  <View className='u-item-text-2'>滨江区星光大道B座2楼</View>
                  <View className='u-item-text-2'>
                    <Text decode>营业时间&emsp;09:00-21:00</Text>
                  </View>
                </View>
              </View>
            )
          }
          <AtDivider content='没有更多了' fontColor='#888' fontSize='24' lineColor='#f2f2f2' />
        </View>
      </View>
    )
  }

  renderOrderList() {
    const { orderList } = this.state
    return (
      <View className='p-section-order'>
        {
          orderList.map((item) =>
            <View className='p-item-card' key={item.id}>
              <View className='u-item-form'>
                <View className='u-item-form-name'>流水号：</View>
                <View className='u-item-form-val flex-1'>20200000001</View>
                <View style='color: #2A9FFF;'>已预约</View>
              </View>
              <View className='u-item-form'>
                <View className='u-item-form-name'>商家：</View>
                <View className='u-item-form-val flex-1'>乔治</View>
              </View>
              <View className='u-item-form'>
                <View className='u-item-form-name'>发型师：</View>
                <View className='u-item-form-val flex-1'>Tony</View>
              </View>
              <View className='u-item-form'>
                <View className='u-item-form-name'>时间：</View>
                <View className='u-item-form-val flex-1'>2020年03月03日 10:00</View>
              </View>
              <View className='u-item-form'>
                <View className='u-item-form-name'>项目：</View>
                <View className='u-item-form-val flex-1'>洗剪吹</View>
              </View>
            </View>
          )
        }
      </View>
    )
  }

  renderUser() {
    return (
      <View className='p-'>
        
      </View>
    )
  }

  render () {
    return (
      <View className='p-page'>
        <View className='p-contain'>
          {
            {
              0: this.renderBusinessList(),
              1: this.renderOrderList(),
              2: this.renderUser()
            }[this.state.current]
          }
        </View>
        <AtTabBar
          fixed
          color='#888888'
          selectedColor='#EC8140'
          backgroundColor='#FAFAFA'
          tabList={[
            { title: '主页', iconType: 'home', },
            { title: '预约', iconType: 'clock' },
            { title: '我的', iconType: 'user' }
          ]}
          onClick={this.onClickTabBar.bind(this)}
          current={this.state.current}
        />
      </View>
    )
  }
}
