import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtIcon, AtDivider, AtFloatLayout } from 'taro-ui'
import './bussiness_detail.styl'

// import { navigateTo } from '../../../utils/util'

import icon_logo from '../../../static/imgs/icon.jpg'

import HalfScreenLayout from '../../../components/half-screen-layout/half-screen-layout'

export default class BussinessDetail extends Component {

  constructor (props) {
    super(props)
    this.state = {
      layoutShow: false,
      goodsList: [
        { name: '桥主' },
        { name: '主力' },
        { name: '哈尼' },
        { name: '三地' }
      ]
    }
  }

  componentWillMount () { }

  componentDidMount () {
    Taro.setNavigationBarTitle({ title: this.$router.params.businessName })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '快预约',
  }

  onClickPhone() {
    Taro.makePhoneCall({ phoneNumber: '15757179448' })
  }

  onClickDialogShow() {
    this.onChangeShow(true)
  }

  onChangeShow(layoutShow) {
    this.setState({ layoutShow })
  }

  renderBusiness() {
    return (
      <View className='p-section-business'>
        <View className='u-title'>乔治快乐洗发水</View>
        <View className='u-img-list'>
          <Image className='u-img' src={icon_logo}></Image>
          <Image className='u-img' src={icon_logo}></Image>
          <Image className='u-img' src={icon_logo}></Image>
        </View>
        <View className='u-detail-list'>
          <View className='u-detail-item'>
            <AtIcon value='map-pin' color='#888' size={16}></AtIcon>
            <View className='u-detail-item-value'>蜀山街道22号</View>
            <AtIcon value='phone' color='#4BCD6F' size={24} onClick={this.onClickPhone}></AtIcon>
          </View>
          <View className='u-detail-item'>
            <AtIcon value='clock' color='#888' size={16}></AtIcon>
            <View className='u-detail-item-value'>营业时间 09:00-21:00</View>
          </View>
        </View>
      </View>
    )
  }

  renderGoods() {
    const { goodsList } = this.state
    return (
      <View className='p-section-goods'>
        <View className='u-title'>发型师</View>
        <View className='list-style-sheet1'>
          {
            goodsList.map((item) =>
              <View className='sheet1-item-wrap' key={item.id}>
                <View className='sheet1-item'>
                  <Image className='sheet1-item-image' style={`width: ${Taro.pxTransform(88)}; height: ${Taro.pxTransform(88)};`} src={icon_logo}></Image>
                  <View className='sheet1-item-content'>
                    <View className='sheet1-item-text-1'>
                      <Text style={`margin-right: ${Taro.pxTransform(12)};`}>Tony</Text>
                      <AtIcon value='check-circle' color='#30CB9B' size={14}></AtIcon>
                    </View>
                    <View className='sheet1-item-text-2'><Text decode>发型总监&emsp;洗剪吹￥100起</Text></View>
                    <View className='sheet1-item-text-2'>今日体温：<Text className='color-g'>36.5℃</Text></View>
                  </View>
                  <View>
                    <Button className='btn-style btn-orange u-btn' hoverClass='btn-hover' onClick={this.onClickDialogShow.bind(this, item)}>预约</Button>
                  </View>
                </View>
              </View>
            )
          }
        </View>
      </View>
    )
  }
  
  renderOrderDetail() {
    return (
      <View className='p-order-detail'>
        <View className='u-order-head'>
          <View className='u-head-title'>
            <View className='text-style-1'>Tony</View>
            <View className='u-title-icon'><AtIcon value='check-circle' color='#30CB9B' size={14}></AtIcon></View>
            <View className='text-style-2'>近7日体温</View>
          </View>
        </View>
      </View>
    )
  }

  render () {
    const { layoutShow } = this.state
    return (
      <View className='p-page'>
        <View className='p-contain'>
          { this.renderBusiness() }
          { this.renderGoods() }
          {/* <AtFloatLayout isOpened>范德萨范德萨的法萨芬的三法术范德萨</AtFloatLayout> */}
          <HalfScreenLayout show={layoutShow} onChangeShow={this.onChangeShow.bind(this)}>
            { this.renderOrderDetail() }
          </HalfScreenLayout>
        </View>
      </View>
    )
  }
}
