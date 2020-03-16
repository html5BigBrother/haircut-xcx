import Taro, { Component } from '@tarojs/taro'
import { View, Button, Input } from '@tarojs/components'
import { AtMessage } from 'taro-ui'
import './staff_add.styl'

import { getUserInfo } from '../../../utils/util'
import validate from '../../../utils/validate'
import cloudRequest from '../../../utils/request_cloud'

import HalfScreenLayout from '../../../components/half-screen-layout/half-screen-layout'

export default class UserEdit extends Component {

  constructor (props) {
    super(props)
    this.state = {
      layoutShow: false,
      businessId: '',
      staffList: [],
      addInfo: {
        name: '',
        rank: '',
        price: ''
      }
    }
  }

  componentWillMount () { }

  componentDidMount () {
    const businessId = getUserInfo().id
    this.setState({ businessId })
    this.getStaffList(businessId)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '添加员工',
  }

  async getStaffList(id) {
    const businessId = id || this.state.businessId
    const res = await cloudRequest({ name: 'getBarbers', data: { businessId } })
    if (!res || res.code !== 'success') return
    this.setState({ staffList: res.data || [] })
  }

  onChangeShow(layoutShow) {
    this.setState({ layoutShow })
  }

  onChangeInput(valueName, e) {
    let { addInfo } = this.state
    addInfo[valueName] = e.detail.value
    this.setState({ addInfo })
  }

  async onClickAdd() {
    const { name, rank, price } = this.state.addInfo
    const data = {
      name,
      rank,
      price: Number(price),
      businessId: this.state.businessId
    }
    const vRes = validate([
      { type: 'vEmpty', value: name, msg: '请输入员工姓名' },
      { type: 'vEmpty', value: rank, msg: '请输入员工职位' },
      { type: 'vEmpty', value: price, msg: '请输入员工价位' },
    ])
    if (vRes !== true) {
      Taro.atMessage({ 'message': vRes, 'type': 'error', })
      return
    }

    Taro.showLoading({ title: '加载中', mask: true })
    const res = await cloudRequest({ name: 'barberRegiste', data })
    Taro.hideLoading()
    if (!res || res.code !== 'success') return
    Taro.atMessage({ 'message': '登记成功', 'type': 'success', })
    this.setState({ addInfo: {} })
    this.getStaffList()
  }

  render () {
    const { staffList, layoutShow, addInfo } = this.state
    return (
      <View className='p-page'>
        <AtMessage />
        <View className='p-contain'>
          <View className='p-staff-list'>
            <View className='u-staff-head'>
              <View className='flex-1 u-item-name'>姓名</View>
              <View className='flex-1'>职位</View>
              <View className='u-item-price'>价位</View>
            </View>
            {
              staffList.map((item, index) => 
                <View className='u-item' key={index}>
                  <View className='flex-1 u-item-name'>{item.name}</View>
                  <View className='flex-1'>{item.rank}</View>
                  <View className='u-item-price'>{item.price}</View>
                </View>
              )
            }
          </View>
          <View className='p-bottom-btn'>
            <Button className='btn-style btn-purple btn-large btn-circle-44' hoverClass='btn-hover' onClick={this.onChangeShow.bind(this, true)}>添加员工</Button>
          </View>
        </View>
        <HalfScreenLayout
          show={layoutShow}
          title='添加员工'
          footer
          onChangeShow={this.onChangeShow.bind(this)}
          renderFooter={
            <Button className='btn-style btn-purple btn-large btn-circle-44' hoverClass='btn-hover' onClick={this.onClickAdd.bind(this)}>确认</Button>
          }
        >
          <View className='p-form'>
            <View className='u-item'>
              <View className='u-name'>姓名</View>
              <Input className='u-input' placeholder='请输入姓名' placeholderClass='color-888' maxLength='20' value={addInfo.name} onBlur={this.onChangeInput.bind(this, 'name')} />
            </View>
            <View className='u-item'>
              <View className='u-name'>职位</View>
              <Input className='u-input' placeholder='请输入职位' placeholderClass='color-888' maxLength='20' value={addInfo.rank} onBlur={this.onChangeInput.bind(this, 'rank')} />
            </View>
            <View className='u-item'>
              <View className='u-name'>价位</View>
              <Input type='number' className='u-input' placeholder='请输入价位' placeholderClass='color-888' maxLength='20' value={addInfo.price} onBlur={this.onChangeInput.bind(this, 'price')} />
            </View>
          </View>
        </HalfScreenLayout>
      </View>
    )
  }
}
