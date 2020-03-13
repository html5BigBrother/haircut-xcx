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


  // 修改姓名
  onClickToUserEdit() {
    navigateTo('/pages/business/user_edit/user_edit', { name: 'hahah', type: '1' })
  }

  // 退出
  onClickQuit() {}


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
                <View className='u-item-form-name'>客户：</View>
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
          <Image className='u-image-business' src={icon_logo} />
          <View className='u-detail-info'>
            <View className='u-detail-name'>严天宇</View>
            <View className='u-detail-phone'>
              <Image className='u-icon-1' src={icon_logo} />
              <Text className='u-text-over'>浙江省杭州市滨江区江南大道…</Text>
            </View>
            <View className='u-detail-phone'>
              <Image className='u-icon-2' src={icon_logo} />
              <Text decode>09:00-21:00&emsp;</Text>
              <Image className='u-icon-3' src={icon_logo} />
              <Text>15000000000</Text>
            </View>
          </View>
        </View>
        <View className='p-operation-list'>
          <View className='u-item' hoverClass='view-hover' onClick={this.onClickToUserEdit}>
            <View className='u-item-name'>商户名称</View>
            <View className='u-item-value'>乔治</View>
            <AtIcon value='chevron-right' size='14' color='#888'></AtIcon>
          </View>
          <View className='u-item' hoverClass='view-hover' onClick={this.onClickToUserEdit}>
            <View className='u-item-name'>地址</View>
            <View className='u-item-value'>浙江省杭州市滨江区江南大范德萨范德萨放大</View>
            <AtIcon value='chevron-right' size='14' color='#888'></AtIcon>
          </View>
          <View className='u-item' hoverClass='view-hover' onClick={this.onClickToUserEdit}>
            <View className='u-item-name'>营业时间</View>
            <View className='u-item-value'>09:00-21:00</View>
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
              0: '1',
              1: '2',
              2: this.renderOrderList(),
              3: this.renderUser()
            }[this.state.current]
          }
        </View>
        <AtTabBar
          fixed
          className='p-tab-bar'
          color='#888888'
          selectedColor='#7B8FFF'
          backgroundColor='#FAFAFA'
          tabList={[
            { title: '主页', iconType: 'home', },
            { title: '员工管理', iconType: 'clock' },
            { title: '预约记录', iconType: 'clock' },
            { title: '我的', iconType: 'user' }
          ]}
          onClick={this.onClickTabBar.bind(this)}
          current={this.state.current}
        />
      </View>
    )
  }
}