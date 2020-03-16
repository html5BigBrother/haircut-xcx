import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, Input } from '@tarojs/components'
import { AtTabBar, AtIcon, AtFloatLayout, AtCalendar, AtAvatar, AtMessage } from 'taro-ui'
import './index.styl'

import validate from '../../../utils/validate'
import { navigateTo, reLaunch, getUserInfo, clearUserInfo, showModal } from '../../../utils/util'
import { businessHours, businessProjects } from '../../../utils/enums'
import cloudRequest from '../../../utils/request_cloud'

import icon_map from '../../../static/imgs/icon_map.svg'
import icon_clock from '../../../static/imgs/icon_clock.svg'
import icon_phone_1 from '../../../static/imgs/icon_phone_1.svg'
import icon_nouser from '../../../static/imgs/icon_nouser.svg'
import tabbar_index_business from '../../../static/imgs/tabbar_index_business.svg'
import tabbar_index_business_on from '../../../static/imgs/tabbar_index_business_on.svg'
import tabbar_manager_business from '../../../static/imgs/tabbar_manager_business.svg'
import tabbar_manager_business_on from '../../../static/imgs/tabbar_manager_business_on.svg'
import tabbar_order_business from '../../../static/imgs/tabbar_order_business.svg'
import tabbar_order_business_on from '../../../static/imgs/tabbar_order_business_on.svg'
import tabbar_user_business from '../../../static/imgs/tabbar_user_business.svg'
import tabbar_user_business_on from '../../../static/imgs/tabbar_user_business_on.svg'

import HalfScreenLayout from '../../../components/half-screen-layout/half-screen-layout'
import CheckList from '../../../components/check-list/check-list'

export default class Index extends Component {

  constructor (props) {
    super(props)
    this.state = {
      businessId: '',
      current: 0,
      indexInfo: {
        hasLoad: false,
        layoutShow: false,
        isOpenedDate: false,
        isOpenedTime: false,
        currentDate: '',
        currentTime: '',
        currentName: '',
        currentCustomerName: '',
        currentCustomerPhone: '',
        currentBarberId: '',

        checkList: [],
        checkList2: [],
        staffOrderList: [],
      },
      staffInfo: {
        hasLoad: false,
        staffList: []
      },
      orderInfo: {
        hasLoad: false,
        orderList: []
      },
      userInfo: {
        hasLoad: false,
      }
    }
  }

  componentWillMount () { }

  componentDidMount () {
    const businessId = getUserInfo().id
    let current = this.$router.params.current ? Number(this.$router.params.current) : 0
    this.setState({
      businessId,
      current
    })
    this.switchInfo(current)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

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
        await this.getStaffInfo()
        break
      case 2:
        await this.getOrderInfo()
        break
      case 3:
        await this.getUserInfo()
        break
    }
  }

  hasLoad(current) {
    const { indexInfo, staffInfo, orderInfo, userInfo } = this.state
    switch (current) {
      case 0:
        return indexInfo.hasLoad
      case 1:
        return staffInfo.hasLoad
      case 2:
        return orderInfo.hasLoad
      case 3:
        return userInfo.hasLoad
    }
  }

  async getIndexInfo() {
    const { userInfo } = this.state
    const indexInfo = {
      layoutShow: false,
      isOpenedDate: false,
      isOpenedTime: false,
      currentDate: '',
      currentTime: '',
      currentName: '',
      currentCustomerName: '',
      currentCustomerPhone: '',
      currentBarberId: '',

      checkList: [],
      checkList2: [],
      staffOrderList: [],
    }

    await this.getStaffInfo()

    await this.getOrderInfo()

    // 根据营业时间筛选可选时间
    const userInfoNewest = userInfo.hasLoad ? userInfo : await this.getUserInfo()
    const businessHoursFilter = businessHours.slice(businessHours.indexOf(userInfoNewest.openingTime), businessHours.indexOf(userInfoNewest.closingTime) + 1)

    indexInfo.checkList = businessHoursFilter.map(item => {
      return {
        value: item,
        disabled: false,
        checked: false
      }
    })
    indexInfo.checkList2 = businessProjects.map(item => {
      return {
        value: item,
        disabled: false,
        checked: false
      }
    })

    indexInfo.hasLoad = true

    this.setState({ indexInfo })
  }

  async getStaffInfo() {
    const { businessId, staffInfo } = this.state
    Taro.showLoading({ title: '加载中', mask: true })
    const res = await cloudRequest({ name: 'getBarbers', data: { businessId: businessId || getUserInfo().id } })
    Taro.hideLoading()
    if (!res || res.code !== 'success') return

    staffInfo.staffList = res.data || []

    staffInfo.hasLoad = true

    this.setState({ staffInfo })
  }

  async getOrderInfo(cb) {
    const { businessId, orderInfo } = this.state
    Taro.showLoading({ title: '加载中', mask: true })
    const res = await cloudRequest({ name: 'getSubscribes', data: { businessId: businessId || getUserInfo().id } })
    Taro.hideLoading()
    if (!res || res.code !== 'success') return

    orderInfo.orderList = res.data || []

    orderInfo.hasLoad = true

    if (cb) cb(orderInfo)
    else this.setState({ orderInfo })
  }

  async getUserInfo() {
    Taro.showLoading({ title: '加载中', mask: true })
    const res = await cloudRequest({ name: 'getBusinessDetail', data: { businessId: this.state.businessId || getUserInfo().id } })
    Taro.hideLoading()
    if (!res || res.code !== 'success') return

    const { name, openingTime, closingTime, phone, regions, address } = res.data
    const regionsFilter = regions[0] === regions[1] ? regions.slice(1) : regions
    const userInfo = {
      name,
      openingTime,
      closingTime,
      phone,
      regions,
      address,
      businessTime: `${openingTime}-${closingTime}`,
      fullAddress: regionsFilter.join('') + address
    }

    userInfo.hasLoad = true

    this.setState({ userInfo })
    return userInfo
  }

  // 重组主页显示数据
  reformStaffOrderList(options) {
    const indexInfo = options.indexInfo || this.state.indexInfo
    const staffInfo = options.staffInfo || this.state.staffInfo
    const orderInfo = options.orderInfo || this.state.orderInfo

    // 筛选显示数据
    const currentDate = indexInfo.currentDate
    const currentTime = indexInfo.currentTime
    const orderListFilter = orderInfo.orderList.filter(item => item.subscribeDate === currentDate && item.subscribeTime === currentTime && item.status === 'success')
    indexInfo.staffOrderList = staffInfo.staffList.map(item => {
      const orderList = orderListFilter.filter(item2 => item2.barberId === item._id)
      return {
        active: true,
        name: item.name,
        barberId: item._id,
        canSubscribe: item.canSubscribe,
        orderList
      }
    })
    this.setState({ indexInfo, staffInfo, orderInfo })
  }

  onClickTabBar(value) {
    this.setState({
      current: value
    })
    if (!this.hasLoad(value)) this.switchInfo(value)
  }

  //添加员工
  onClickStaffAdd() {
    navigateTo('/pages/business/staff_add/staff_add')
  }

  // 体温管理
  onClickStaffTemperature() {
    navigateTo('/pages/business/staff_temperature/staff_temperature')
  }

  // 修改我的信息
  onClickToUserEdit(type) {
    const { userInfo } = this.state
    if (type === 'businessTime') navigateTo('/pages/business/user_edit_time/user_edit_time', { openingTime: userInfo.openingTime, closingTime: userInfo.closingTime })
    else if (type === 'fullAddress') navigateTo('/pages/business/user_edit_address/user_edit_address', { regions: JSON.stringify(userInfo.regions), address: userInfo.address })
    else navigateTo('/pages/business/user_edit/user_edit', { name: this.state.userInfo[type], type: type })
  }

  // 主页预约
  onClickAppoint(item, e) {
    e.stopPropagation()
    const { indexInfo } = this.state

    // 初始化
    indexInfo.currentCustomerName = ''
    indexInfo.currentCustomerPhone = ''
    indexInfo.checkList2.forEach(item2 => { item2.checked = false })

    indexInfo.currentName = item.name
    indexInfo.currentBarberId = item.barberId
    this.setState({ indexInfo })

    this.onChangeShow(true)
  }

  // 确认预约
  async onClickAppointSure() {
    const { businessId, indexInfo } = this.state
    const projects = indexInfo.checkList2.filter(item => item.checked).map(item => item.value)
    const data = {
      customerName: indexInfo.currentCustomerName,
      customerPhone: indexInfo.currentCustomerPhone,
      businessId,
      barberId: indexInfo.currentBarberId,
      subscribeDate: indexInfo.currentDate,
      subscribeTime: indexInfo.currentTime,
      projects,
      type: 'agent'
    }

    const vRes = validate([
      { type: 'vEmpty', value: indexInfo.currentCustomerName, msg: '请输入手机号码' },
      { type: 'vEmpty', value: indexInfo.currentCustomerPhone, msg: '请输入手机号码' },
      { type: 'vTel', value: indexInfo.currentCustomerPhone, msg: '手机号码格式有误' },
    ])

    if (vRes !== true) {
      Taro.atMessage({ 'message': vRes, 'type': 'error', })
      return
    }

    Taro.showLoading({ title: '加载中', mask: true })
    const res = await cloudRequest({ name: 'subscribe', data })
    Taro.hideLoading()
    if (!res || res.code !== 'success') return

    Taro.atMessage({ 'message': '登记成功', 'type': 'success', })
    this.onChangeShow(false)
    this.getOrderInfo((orderInfo) => {
      this.reformStaffOrderList({ orderInfo })
    })
  }

  // 删除预约
  async onClickDelOrder(item) {
    const data = {
      subscribeId: item._id,
      cancelerType: 'business'
    }
    if (!(await showModal({ content: '确认删除吗？' }))) return

    Taro.showLoading({ title: '正在删除', mask: true })
    const res = await cloudRequest({ name: 'cancelSubscribe', data })
    Taro.hideLoading()
    if (!res || res.code !== 'success') return

    Taro.atMessage({ 'message': '已删除预约', 'type': 'success', })

    this.getOrderInfo((orderInfo) => {
      this.reformStaffOrderList({ orderInfo })
    })
  }

  // 退出
  async onClickQuit() {
    if (await showModal({ content: '确定退出吗？' })) {
      clearUserInfo()
      reLaunch('/pages/common/index/index')
    }
  }

  onChangeShow(layoutShow) {
    const { indexInfo } = this.state
    indexInfo.layoutShow = layoutShow
    this.setState({ indexInfo })
  }

  onChangeActive(index) {
    const { indexInfo } = this.state
    let staffOrderList = indexInfo.staffOrderList
    staffOrderList[index].active = !staffOrderList[index].active
    this.setState({ indexInfo })
  }

  onChangeIsOpenedDate(isOpenedDate) {
    const { indexInfo } = this.state
    indexInfo.isOpenedDate = isOpenedDate
    this.setState({ indexInfo })
  }

  onChangeIsOpenedTime(isOpenedTime) {
    const { indexInfo } = this.state
    indexInfo.isOpenedTime = isOpenedTime
    this.setState({ indexInfo })
  }

  onChangeCheckList(option) {
    const { indexInfo } = this.state
    indexInfo.checkList = option.checkList
    indexInfo.currentTime = option.checkList.filter(item => item.checked)[0].value || ''
    indexInfo.isOpenedTime = false

    if (indexInfo.currentDate && indexInfo.currentTime) this.reformStaffOrderList({ indexInfo })
    else this.setState({ indexInfo })
  }
  onChangeCheckList2(option) {
    const { indexInfo } = this.state
    indexInfo.checkList2 = option.checkList
    this.setState({ indexInfo })
  }

  onChangeInput(valueName, e) {
    const { indexInfo } = this.state
    indexInfo[valueName] = e.detail.value
    this.setState({ indexInfo })
  }

  onSelectDate(e) {
    let { indexInfo } = this.state
    indexInfo.currentDate = e.value.start
    indexInfo.isOpenedDate = false

    if (indexInfo.currentDate && indexInfo.currentTime) this.reformStaffOrderList({ indexInfo })
    else this.setState({ indexInfo })
  }

  // 主页
  renderIndex() {
    const { indexInfo } = this.state
    return (
      <View className='p-section-index'>
        <View className='p-bg-line'></View>
        <View className='list-style-sheet2'>
          <View className='sheet2-item-wrap' hoverClass='view-hover' onClick={this.onChangeIsOpenedDate.bind(this, true)}>
            <View className='sheet2-item'>
              <View className='sheet2-item-name'>选择日期</View>
                <View className='p-margin-r-20'>{ indexInfo.currentDate && this.renderDate() }</View>
              <AtIcon value='chevron-right' size='14' color='#888'></AtIcon>
            </View>
          </View>
          <View className='sheet2-item-wrap' style='border-bottom: 1px solid f2f2f2;' hoverClass='view-hover' onClick={this.onChangeIsOpenedTime.bind(this, true)}>
            <View className='sheet2-item'>
              <View className='sheet2-item-name'>选择时间</View>
                <View className='p-margin-r-20'>{indexInfo.currentTime}</View>
              <AtIcon value='chevron-right' size='14' color='#888'></AtIcon>
            </View>
          </View>
        </View>
        <View className='p-staff-order-list'>
          {
            indexInfo.staffOrderList.map((item, index) =>
              <View className='accordion-wrap' key={item.barberId}>
                <View className='accordion-head' hoverClass='view-hover' onClick={this.onChangeActive.bind(this, index)}>
                  <View className='accordion-content'>
                    <View className='u-text-1'>{item.name}</View>
                    <View className='u-point-purple'></View>
                    <View className='u-text-2'>已约{item.orderList.length || 0}</View>
                    <View className='u-point-green'></View>
                    <View className='u-text-2'>剩余{5 - item.orderList.length > 0 ? 5 - item.orderList.length : 0}</View>
                    { (item.canSubscribe || item.orderList.length <= 5) && <Button className='btn-style btn-purple-o u-btn' hoverClass='btn-hover' onClick={this.onClickAppoint.bind(this, item)}>预约</Button>}
                  </View>
                  <AtIcon className={`accordion-chevron ${item.active && 'active'}`} value='chevron-down' size='14' color='#888'></AtIcon>
                </View>
                <View className={`accordion-list ${item.active && 'active'}`}>
                  {
                    item.orderList.map((item2, index2) =>
                      <View className='accordion-item' key={item2._id}>
                        <View className='accordion-content'>
                          <View className='u-item-text u-width-20'>{index2 + 1}</View>
                          <View className='u-item-text u-width-112'>{item2.customerName}</View>
                          <View className='u-item-text u-width-186'>{item2.customerPhone}</View>
                          <View className='u-item-text flex-1'>{item2.projects.join('、')}</View>
                        </View>
                        <View className='color-r' onClick={this.onClickDelOrder.bind(this, item2)}>删除</View>
                      </View>
                    )
                  }
                </View>
              </View>
            )
          }
        </View>

        <AtFloatLayout isOpened={indexInfo.isOpenedDate} onClose={this.onChangeIsOpenedDate.bind(this, false)}>
          <AtCalendar currentDate={indexInfo.currentDate} minDate={Date.now() - 1000 * 60 * 60 * 24} maxDate={Date.now() + 1000 * 60 * 60 * 24 * 60} onSelectDate={this.onSelectDate.bind(this)} />
        </AtFloatLayout>
        <AtFloatLayout isOpened={indexInfo.isOpenedTime} onClose={this.onChangeIsOpenedTime.bind(this, false)}>
          <CheckList check-list-class='check-list-class' checkedBgColor='#7B8FFF' selectSingle checkList={indexInfo.checkList} onSelectedCheck={this.onChangeCheckList.bind(this)} />
        </AtFloatLayout>
        <HalfScreenLayout
          show={indexInfo.layoutShow}
          title='预约'
          footer
          onChangeShow={this.onChangeShow.bind(this)}
          renderFooter={
            <Button className='btn-style btn-purple btn-large btn-circle-44' hoverClass='btn-hover' onClick={this.onClickAppointSure.bind(this)}>立即预约</Button>
          }
        >
          <View className='p-form'>
            <View className='u-item'>
              <View className='u-name'>老师</View>
              <Text className='u-input'>{indexInfo.currentName}</Text>
            </View>
            <View className='u-item'>
              <View className='u-name'>日期</View>
              <Text className='u-input'>{indexInfo.currentDate}</Text>
            </View>
            <View className='u-item'>
              <View className='u-name'>时间</View>
              <Text className='u-input'>{indexInfo.currentTime}</Text>
            </View>
            <View className='u-item'>
              <View className='u-name'>用户姓名</View>
              <Input type='number' className='u-input' placeholder='请输入用户姓名' placeholderClass='color-888' maxLength='11' onBlur={this.onChangeInput.bind(this, 'currentCustomerName')} />
            </View>
            <View className='u-item'>
              <View className='u-name'>用户手机</View>
              <Input type='number' className='u-input' placeholder='请输入手机号码' placeholderClass='color-888' maxLength='11' onBlur={this.onChangeInput.bind(this, 'currentCustomerPhone')} />
            </View>
            <View className='u-project'>
              <View className='u-project-name'>项目</View>
              <CheckList checkedBgColor='#7B8FFF' checkList={indexInfo.checkList2} onSelectedCheck={this.onChangeCheckList2.bind(this)} />
            </View>
          </View>
        </HalfScreenLayout>
      </View>
    )
  }

  // 员工管理
  renderStaffManage() {
    return (
      <View className='p-section-staff'>
        <View className='p-bg-line'></View>
        <View className='list-style-sheet2'>
          <View className='sheet2-item-wrap' hoverClass='view-hover' onClick={this.onClickStaffAdd}>
            <View className='sheet2-item'>
              <View className='sheet2-item-name'>添加员工</View>
              <AtIcon value='chevron-right' size='14' color='#888'></AtIcon>
            </View>
          </View>
          <View className='sheet2-item-wrap' hoverClass='view-hover' onClick={this.onClickStaffTemperature}>
            <View className='sheet2-item'>
              <View className='sheet2-item-name'>体温管理</View>
              <AtIcon value='chevron-right' size='14' color='#888'></AtIcon>
            </View>
          </View>
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
                <View className='u-item-form-name'>客户：</View>
                <View className='u-item-form-val flex-1'>{item.customerName}</View>
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
            className='u-image-business'
            size='large'
            openData={
              {
                type: 'userAvatarUrl',
                'default-avatar': icon_nouser
              }
            }
          ></AtAvatar>
          <View className='u-detail-info'>
            <View className='u-detail-name'>{userInfo.name}</View>
            <View className='u-detail-phone'>
              <Image className='u-icon-1' src={icon_map} />
              <Text className='u-text-over'>{userInfo.fullAddress}</Text>
            </View>
            <View className='u-detail-phone'>
              <Image className='u-icon-2' src={icon_clock} />
              <Text decode>{userInfo.businessTime}&emsp;</Text>
              <Image className='u-icon-3' src={icon_phone_1} />
              <Text>{userInfo.phone}</Text>
            </View>
          </View>
        </View>
        <View className='p-operation-list'>
          <View className='u-item' hoverClass='view-hover' onClick={this.onClickToUserEdit.bind(this, 'name')}>
            <View className='u-item-name'>商户名称</View>
            <View className='u-item-value'>{userInfo.name}</View>
            <AtIcon value='chevron-right' size='14' color='#888'></AtIcon>
          </View>
          <View className='u-item' hoverClass='view-hover' onClick={this.onClickToUserEdit.bind(this, 'fullAddress')}>
            <View className='u-item-name'>地址</View>
            <View className='u-item-value'>{userInfo.fullAddress}</View>
            <AtIcon value='chevron-right' size='14' color='#888'></AtIcon>
          </View>
          <View className='u-item' hoverClass='view-hover' onClick={this.onClickToUserEdit.bind(this, 'businessTime')}>
            <View className='u-item-name'>营业时间</View>
            <View className='u-item-value'>{userInfo.businessTime}</View>
            <AtIcon value='chevron-right' size='14' color='#888'></AtIcon>
          </View>
        </View>
        <View className='p-bottom-btn'>
          <Button className='btn-style btn-default btn-large btn-circle-44 u-btn' hoverClass='btn-hover' onClick={this.onClickQuit}>退出登录</Button>
        </View>
      </View>
    )
  }

  // renderDate
  renderDate() {
    const { indexInfo } = this.state
    const currentDate = indexInfo.currentDate
    const dateTranslateWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const yearMonthDay = `${new Date(currentDate).getFullYear()}年${new Date(currentDate).getMonth() + 1}月${new Date(currentDate).getDate()}日 `
    const weekDay = dateTranslateWeek[new Date(currentDate).getDay()]
    return <Text className='color-222'>{yearMonthDay}{weekDay}</Text>
  }

  render () {
    return (
      <View className='p-page'>
        <AtMessage />
        <View className='p-contain'>
          {
            {
              0: this.renderIndex(),
              1: this.renderStaffManage(),
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
            { title: '主页', image: tabbar_index_business, selectedImage: tabbar_index_business_on },
            { title: '员工管理', image: tabbar_manager_business, selectedImage: tabbar_manager_business_on },
            { title: '预约记录', image: tabbar_order_business, selectedImage: tabbar_order_business_on },
            { title: '我的', image: tabbar_user_business, selectedImage: tabbar_user_business_on }
          ]}
          onClick={this.onClickTabBar.bind(this)}
          current={this.state.current}
        />
      </View>
    )
  }
}