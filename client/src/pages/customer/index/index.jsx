import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtTabBar, AtIcon, AtDivider, AtAvatar } from 'taro-ui'
import './index.styl'

import { navigateTo, reLaunch, getUserInfo, clearUserInfo, showModal } from '../../../utils/util'
import cloudRequest from '../../../utils/request_cloud'
import { businessImgs } from '../../../utils/enums'

import icon_save from '../../../static/imgs/icon_save.svg'
import icon_nouser from '../../../static/imgs/icon_nouser.svg'
import tabbar_index_customer from '../../../static/imgs/tabbar_index_customer.svg'
import tabbar_index_customer_on from '../../../static/imgs/tabbar_index_customer_on.svg'
import tabbar_order_customer from '../../../static/imgs/tabbar_order_customer.svg'
import tabbar_order_customer_on from '../../../static/imgs/tabbar_order_customer_on.svg'
import tabbar_user_customer from '../../../static/imgs/tabbar_user_customer.svg'
import tabbar_user_customer_on from '../../../static/imgs/tabbar_user_customer_on.svg'

export default class Index extends Component {

  constructor (props) {
    super(props)
    this.state = {
      customerId: '',
      current: 0,
      indexInfo: {
        hasLoad: false,
        businessList: [],
      },
      orderInfo: {
        hasLoad: false,
        orderList: []
      },
      userInfo: {
        hasLoad: false,
        name: '',
        phone: '',
      }
    }
  }

  componentDidMount () {
    const customerId = getUserInfo().id
    let current = this.$router.params.current ? Number(this.$router.params.current) : 0
    this.setState({
      customerId,
      current
    })
    this.switchInfo(current)
  }

  // 下拉刷新
  async onPullDownRefresh() {
    await this.switchInfo(this.state.current)
    Taro.stopPullDownRefresh()
  }

  config = {
    navigationBarTitleText: '快预约',
    enablePullDownRefresh: true
  }

  async switchInfo(current) {
    switch (current) {
      case 0:
        await this.getIndexInfo()
        break
      case 1:
        await this.getOrderInfo()
        break
      case 2:
        await this.getUserInfo()
        break
    }
  }

  hasLoad(current) {
    const { indexInfo, orderInfo, userInfo } = this.state
    switch (current) {
      case 0:
        return indexInfo.hasLoad
      case 1:
        return orderInfo.hasLoad
      case 2:
        return userInfo.hasLoad
    }
  }

  // 查询商家列表
  async getIndexInfo() {
    const { indexInfo } = this.state
    Taro.showLoading({ title: '加载中', mask: true })
    const res = await cloudRequest({ name: 'getBusinessList', data: { pageSize: 20 } })
    Taro.hideLoading()
    if (!res || res.code !== 'success') return

    indexInfo.businessList = res.data.pageList

    indexInfo.hasLoad = true

    this.setState({ indexInfo })
  }

  // 查询预约记录
  async getOrderInfo(cb) {
    const { customerId, orderInfo } = this.state
    Taro.showLoading({ title: '加载中', mask: true })
    const res = await cloudRequest({ name: 'getSubscribes', data: { customerId: customerId || getUserInfo().id } })
    Taro.hideLoading()
    if (!res || res.code !== 'success') return

    orderInfo.orderList = res.data || []

    orderInfo.hasLoad = true

    if (cb) cb(orderInfo)
    else this.setState({ orderInfo })
  }

  // 查询 我的信息
  async getUserInfo() {
    Taro.showLoading({ title: '加载中', mask: true })
    const res = await cloudRequest({ name: 'getCustomerDetail', data: { customerId: this.state.customerId || getUserInfo().id } })
    Taro.hideLoading()
    if (!res || res.code !== 'success') return

    const { name, phone } = res.data
    const userInfo = {
      name,
      phone,
    }

    userInfo.hasLoad = true

    this.setState({ userInfo })
    return userInfo
  }

  onClickTabBar(value) {
    this.setState({
      current: value
    })
    if (!this.hasLoad(value)) this.switchInfo(value)
  }

  // 前往商户详情页
  onClickToBusinessDetail(item) {
    navigateTo('/pages/customer/bussiness_detail/bussiness_detail', { businessName: item.name, businessId: item._id })
  }

  // 修改姓名
  onClickToUserEdit(type) {
    navigateTo('/pages/customer/user_edit/user_edit', { name: this.state.userInfo[type], type: type })
  }

  // 退出
  async onClickQuit() {
    if (await showModal({ content: '确定退出吗？' })) {
      clearUserInfo()
      reLaunch('/pages/common/index/index')
    }
  }

  // 商家类表dom
  renderBusinessList() {
    const { indexInfo } = this.state
    return (
      <View className='p-section-business'>
        <View className='u-title'>商家列表</View>
        <View className='list-style-sheet1 p-list-business'>
          {
            indexInfo.businessList.map((item) =>
              <View className='sheet1-item-wrap' key={item._id} hoverClass='view-hover' onClick={this.onClickToBusinessDetail.bind(this, item)}>
                <View className='sheet1-item'>
                  <Image className='sheet1-item-image' src={businessImgs[Math.floor(Math.random() * businessImgs.length)]}></Image>
                  <View className='sheet1-item-content'>
                    <View className='sheet1-item-text-1'>
                      <Text style={`margin-right: ${Taro.pxTransform(12)};`}>{item.name}</Text>
                      <Image className='icon_save' src={icon_save} />
                    </View>
                    <View className='sheet1-item-text-2'>{item.regions[2] + item.address}</View>
                    <View className='sheet1-item-text-2'>营业时间 {`${item.openingTime}-${item.closingTime}`}</View>
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
    const { orderInfo } = this.state
    return (
      <View className='p-section-order'>
        {
          orderInfo.orderList.map((item) =>
            <View className='p-item-card' key={item._id}>
              <View className='u-item-form'>
                <View className='u-item-form-name'>流水号：</View>
                <View className='u-item-form-val flex-1'>{item.serialNumber}</View>
                <View className={item.status === 'success' ? 'color-b' : 'color-r'}>{item.status === 'success' ? '已预约': '已取消'}</View>
              </View>
              <View className='u-item-form'>
                <View className='u-item-form-name'>商家：</View>
                <View className='u-item-form-val flex-1'>{item.businessName}</View>
              </View>
              <View className='u-item-form'>
                <View className='u-item-form-name'>发型师：</View>
                <View className='u-item-form-val flex-1'>{item.barberName}</View>
              </View>
              <View className='u-item-form'>
                <View className='u-item-form-name'>时间：</View>
                <View className='u-item-form-val flex-1'>{`${item.subscribeDate} ${item.subscribeTime}`}</View>
              </View>
              <View className='u-item-form'>
                <View className='u-item-form-name'>项目：</View>
                <View className='u-item-form-val flex-1'>{item.projects.join('、')}</View>
              </View>
            </View>
          )
        }
      </View>
    )
  }

  // 我的dom
  renderUser() {
    const { userInfo } = this.state
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
            <View className='u-detail-name'>{userInfo.name}</View>
          <View className='u-detail-phone'>电话：{userInfo.phone}</View>
          </View>
        </View>
        <View className='p-operation-list'>
          <View className='u-item' hoverClass='view-hover' onClick={this.onClickToUserEdit.bind(this, 'name')}>
            <View className='u-item-name'>姓名</View>
            <View className='u-item-value'>{userInfo.name}</View>
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
            { title: '主页', image: tabbar_index_customer, selectedImage: tabbar_index_customer_on },
            { title: '预约', image: tabbar_order_customer, selectedImage: tabbar_order_customer_on },
            { title: '我的', image: tabbar_user_customer, selectedImage: tabbar_user_customer_on }
          ]}
          onClick={this.onClickTabBar.bind(this)}
          current={this.state.current}
        />
      </View>
    )
  }
}
