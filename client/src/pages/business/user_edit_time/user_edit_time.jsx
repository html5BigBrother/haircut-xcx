import Taro, { Component } from '@tarojs/taro'
import { View, Button, Input, Picker } from '@tarojs/components'
import { AtMessage } from 'taro-ui'
import './user_edit_time.styl'

import validate from '../../../utils/validate'
import { showModal, reLaunch, setUserInfo } from '../../../utils/util'
import { businessHours } from '../../../utils/enums'
import cloudRequest from '../../../utils/request_cloud'

export default class UserEdit extends Component {

  constructor (props) {
    super(props)
    this.state = {
      openingTime: '',
      closingTime: '',
      openingTimeIndex: '',
      closingTimeIndex: '',
      rangeTime: businessHours
    }
  }

  componentDidMount () {
    const openingTime = this.$router.params.openingTime
    const closingTime = this.$router.params.closingTime
    this.setState({
      openingTime,
      closingTime,
      openingTimeIndex: businessHours.indexOf(openingTime),
      closingTimeIndex: businessHours.indexOf(closingTime)
    })
  }

  config = {
    navigationBarTitleText: '我的',
  }

  onChangeStartTime(e) {
    const openingTime = this.state.rangeTime[e.detail.value]
    this.setState({ openingTime })
  }

  onChangeEndTime(e) {
    const closingTime = this.state.rangeTime[e.detail.value]
    this.setState({ closingTime })
  }

  // 确认修改
  async onClickSure() {
    const { openingTime, closingTime } = this.state
    const data = { openingTime, closingTime }

    validate.methods['vEndTime'] = (v) => {
      const endIndex = this.state.rangeTime.indexOf(v)
      const startIndex = this.state.rangeTime.indexOf(this.state.openingTime)
      return endIndex > startIndex
    }
    const vRes = validate([
      { type: 'vEmpty', value: openingTime, msg: '请选择营业起始时间' },
      { type: 'vEmpty', value: closingTime, msg: '请选择营业截止时间' },
      { type: 'vEndTime', value: closingTime, msg: '营业截止时间不能早于起始时间' },
    ])
    if (vRes !== true) {
      Taro.atMessage({ 'message': vRes, 'type': 'error', })
      return
    }

    Taro.showLoading({ title: '加载中', mask: true })
    const res = await cloudRequest({ name: 'modifyBusiness', data })
    Taro.hideLoading()
    if (!res || res.code !== 'success') return

    // Taro.atMessage({ 'message': '修改成功', 'type': 'success', })

    reLaunch('/pages/business/index/index', { current: 3 })
  }

  render () {
    const { rangeTime, openingTime, closingTime, openingTimeIndex, closingTimeIndex } = this.state
    return (
      <View className='p-page'>
        <AtMessage />
        <View className='p-contain'>
          <View className='p-operation-list'>
            <View className='u-item'>
              <Picker className={`flex-1 ${!openingTime && 'color-888'}`} mode='selector' range={rangeTime} value={openingTimeIndex} onChange={this.onChangeStartTime.bind(this)}>{openingTime || '请选择营业起始时间'}</Picker>
            </View>
            <View className='u-item'>
              <Picker className={`flex-1 ${!closingTime && 'color-888'}`} mode='selector' range={rangeTime} value={closingTimeIndex} onChange={this.onChangeEndTime.bind(this)}>{closingTime || '请选择营业截止时间'}</Picker>
            </View>
          </View>
          <View className='p-bottom-btn'>
            <Button className='btn-style btn-purple btn-large btn-circle-44' hoverClass='btn-hover' onClick={this.onClickSure.bind(this)}>确认</Button>
          </View>
        </View>
      </View>
    )
  }
}
