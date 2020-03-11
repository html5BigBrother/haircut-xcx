import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtTabBar, AtIcon, AtDivider, AtAvatar } from 'taro-ui'
import './index.styl'

import { navigateTo } from '../../../utils/util'

import icon_logo from '../../../static/imgs/icon.jpg'
import icon_nouser from '../../../static/imgs/icon_nouser.svg'

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

  componentDidMount () {
    let current = this.$router.params.current ? Number(this.$router.params.current) : 0
    this.setState({
      current
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '快预约',
  }

  onClickTabBar(value) {
    this.setState({
      current: value
    })
  }

  // 前往商户详情页
  onClickToBusinessDetail() {
    navigateTo('/pages/customer/bussiness_detail/bussiness_detail', { businessName: '乔治爱不释手' })
  }

  // 修改姓名
  onClickToUserEdit() {
    navigateTo('/pages/customer/user_edit/user_edit', { name: 'hahah' })
  }

  // 退出
  onClickQuit() {}

  // 商家类表dom
  renderBusinessList() {
    const { businessList } = this.state
    return (
      <View className='p-section-business'>
        <View className='u-title'>商家列表</View>
        <View className='list-style-sheet1 p-list-business'>
          {
            businessList.map((item) =>
              <View className='sheet1-item-wrap' key={item.id} hoverClass='view-hover' onClick={this.onClickToBusinessDetail}>
                <View className='sheet1-item'>
                  <Image className='sheet1-item-image' src={icon_logo}></Image>
                  <View className='sheet1-item-content'>
                    <View className='sheet1-item-text-1'>
                      <Text style={`margin-right: ${Taro.pxTransform(12)};`}>item.name</Text>
                      <AtIcon value='check-circle' color='#30CB9B' size={14}></AtIcon>
                    </View>
                    <View className='sheet1-item-text-2'>滨江区星光大道B座2楼</View>
                    <View className='sheet1-item-text-2'>营业时间 09:00-21:00</View>
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

  // 预约记录dom
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

  // 我的dom
  renderUser() {
    return (
      <View className='p-section-user'>
        <View className='p-user-detail'>
          <AtAvatar
            size='large'
            circle
            openData={
              {
                type: 'userAvatarUrl',
                'default-avatar': icon_nouser
              }
            }
          >
          </AtAvatar>
          <View className='u-detail-info'>
            <View className='u-detail-name'>严天宇</View>
            <View className='u-detail-phone'>电话：15757179448</View>
          </View>
        </View>
        <View className='p-operation-list'>
          <View className='u-item' hoverClass='view-hover' onClick={this.onClickToUserEdit}>
            <View className='u-item-name'>姓名</View>
            <View className='u-item-value'>ZP</View>
            <AtIcon value='chevron-right' size='14' color='#888'></AtIcon>
          </View>
        </View>
        <View className='p-bottom-btn'>
          <Button className='btn-style btn-default btn-large btn-circle-44 u-btn' hoverClass='btn-hover' onClick={this.onClickQuit}>退出登录</Button>
        </View>
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
          className='p-tab-bar'
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
