import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, Input } from '@tarojs/components'
import { AtTabBar, AtIcon, AtFloatLayout, AtCalendar } from 'taro-ui'
import './index.styl'

import { navigateTo } from '../../../utils/util'

import icon_logo from '../../../static/imgs/icon.jpg'

import HalfScreenLayout from '../../../components/half-screen-layout/half-screen-layout'
import CheckList from '../../../components/check-list/check-list'

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
      ],
      indexInfo: {
        layoutShow: false,
        isOpenedDate: false,
        isOpenedTime: false,
        currentDate: '',
        currentTime: '',
        checkList: [
          { value: '9:00', disabled: false, checked: false },
          { value: '9:00', disabled: false, checked: false },
          { value: '9:00', disabled: false, checked: false },
          { value: '9:00', disabled: false, checked: false },
          { value: '9:00', disabled: false, checked: false },
        ],
        checkList2: [
          { value: '9:00', disabled: false, checked: false },
          { value: '9:00', disabled: false, checked: false },
          { value: '9:00', disabled: false, checked: false },
          { value: '9:00', disabled: false, checked: false },
          { value: '9:00', disabled: false, checked: false },
        ],
        staffOrderList: [
          {
            date: '2020-03-21',
            active: true,
            itemList: [
              { name: 'Json', price: '36.5' },
              { name: 'Tony', price: '36.5' },
              { name: 'Jck', price: '36.5' }
            ]
          },
          {
            date: '2020-03-21',
            active: false,
            itemList: [
              { name: 'Json', price: '36.5' },
              { name: 'Tony', price: '36.5' },
              { name: 'Jck', price: '36.5' }
            ]
          },
        ]
      }
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

  //添加员工
  onClickStaffAdd() {
    navigateTo('/pages/business/staff_add/staff_add')
  }

  // 体温管理
  onClickStaffTemperature() {
    navigateTo('/pages/business/staff_temperature/staff_temperature')
  }

  // 修改姓名
  onClickToUserEdit() {
    navigateTo('/pages/business/user_edit/user_edit', { name: 'hahah', type: '1' })
  }

  // 主页预约
  onClickAppoint(item, e) {
    e.stopPropagation()
    this.onChangeShow(true)
  }

  // 退出
  onClickQuit() {}

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
    indexInfo.currentTime = option.checkList.filter(item => item.checked)[0] || ''
    indexInfo.isOpenedTime = false
    this.setState({ indexInfo })
  }
  onChangeCheckList2(option) {
    const { indexInfo } = this.state
    indexInfo.checkList2 = option.checkList
    this.setState({ indexInfo })
  }

  onSelectDate(e) {
    let { indexInfo } = this.state
    indexInfo.currentDate = e.value.start
    indexInfo.isOpenedDate = false
    this.setState({ indexInfo })
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
          <View className='sheet2-item-wrap' hoverClass='view-hover' onClick={this.onChangeIsOpenedTime.bind(this, true)}>
            <View className='sheet2-item' style='border-bottom: 0;'>
              <View className='sheet2-item-name'>选择时间</View>
                <View className='p-margin-r-20'>{indexInfo.currentTime}</View>
              <AtIcon value='chevron-right' size='14' color='#888'></AtIcon>
            </View>
          </View>
        </View>
        <View className='p-staff-order-list'>
          {
            indexInfo.staffOrderList.map((item, index) =>
              <View className='accordion-wrap' key={item.id}>
                <View className='accordion-head' hoverClass='view-hover' onClick={this.onChangeActive.bind(this, index)}>
                  <View className='accordion-content'>
                    <View className='u-text-1'>{item.date}</View>
                    <View className='u-point-purple'></View>
                    <View className='u-text-2'>已约3</View>
                    <View className='u-point-green'></View>
                    <View className='u-text-2'>剩余2</View>
                    <Button className='btn-style btn-purple-o u-btn' hoverClass='btn-hover' onClick={this.onClickAppoint.bind(this, item)}>预约</Button>
                  </View>
                  <AtIcon className={`accordion-chevron ${item.active && 'active'}`} value='chevron-down' size='14' color='#888'></AtIcon>
                </View>
                <View className={`accordion-list ${item.active && 'active'}`}>
                  {
                    item.itemList.map((item2) =>
                      <View className='accordion-item' key={item2.id}>
                        <View className='accordion-content'>
                          <View className='u-item-text u-width-20'>1</View>
                          <View className='u-item-text u-width-112'>范德萨范德萨范德萨</View>
                          <View className='u-item-text u-width-186'>15757179448</View>
                          <View className='u-item-text flex-1'>洗剪吹</View>
                        </View>
                        <View className='color-r'>删除</View>
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
          onChangeShow={this.onChangeShow.bind(this)}
          renderFooter={
            <Button className='btn-style btn-purple btn-large btn-circle-44' hoverClass='btn-hover' onClick={this.onChangeShow.bind(this, false)}>立即预约</Button>
          }
        >
          <View className='p-form'>
            <View className='u-item'>
              <View className='u-name'>老师</View>
              <Text className='u-input'>Tony</Text>
            </View>
            <View className='u-item'>
              <View className='u-name'>日期</View>
              <Text className='u-input'>Tony</Text>
            </View>
            <View className='u-item'>
              <View className='u-name'>时间</View>
              <Text className='u-input'>Tony</Text>
            </View>
            <View className='u-project'>
              <View className='u-project-name'>项目</View>
              <CheckList checkedBgColor='#7B8FFF' checkList={indexInfo.checkList} onSelectedCheck={this.onChangeCheckList2.bind(this)} />
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