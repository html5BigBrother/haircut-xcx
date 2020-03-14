import Taro, { Component } from '@tarojs/taro'
import { View, Button, Input, Picker } from '@tarojs/components'
import { AtMessage } from 'taro-ui'
import './login.styl'

import validate from '../../../utils/validate'
import { showModal, redirectTo } from '../../../utils/util'
import cloudRequest from '../../../utils/request_cloud'

export default class Login extends Component {

  constructor (props) {
    super(props)
    this.state = {
      regionValue: [],
      rangeTime: ['9:00', '10:00', '11:00'],
      startTime: '', // 营业开始时间
      endTime: '', // 营业截止时间
      name: '', // 商户美国昵称
      phone: '', // 商户手机号
      address: '', // 商户地址
    }
  }

  config = {
    navigationBarTitleText: '创建商户',
  }

  onChangeInput(valueName, e) {
    this.setState({ [`${valueName}`]: e.detail.value })
  }

  onChangeRegion(e) {
    const regionValue = e.detail.value
    this.setState({ regionValue })
  }

  onChangeStartTime(e) {
    const startTime = this.state.rangeTime[e.detail.value]
    this.setState({ startTime })
  }

  onChangeEndTime(e) {
    const endTime = this.state.rangeTime[e.detail.value]
    this.setState({ endTime })
  }

  async onClickCreate() {
    const { name, regionValue, address, phone, startTime, endTime  } = this.state
    const data = {
      name,
      phone,
      regions: regionValue,
      address,
      openingTime: startTime,
      closingTime: endTime
    }
    validate.methods['vEndTime'] = (v) => {
      const endIndex = this.state.rangeTime.indexOf(v)
      const startIndex = this.state.rangeTime.indexOf(this.state.startTime)
      return endIndex > startIndex
    }
    const vRes = validate([
      { type: 'vEmpty', value: name, msg: '请输入商家名称' },
      { type: 'vArrEmpty', value: regionValue, msg: '请选择省市区' },
      { type: 'vEmpty', value: address, msg: '请输入地址' },
      { type: 'vEmpty', value: phone, msg: '请输入联系方式' },
      { type: 'vTel', value: phone, msg: '手机号码格式有误' },
      { type: 'vEmpty', value: startTime, msg: '请选择营业起始时间' },
      { type: 'vEmpty', value: endTime, msg: '请选择营业截止时间' },
      { type: 'vEndTime', value: endTime, msg: '营业截止时间不能早于起始时间' },
    ])
    if (vRes !== true) {
      Taro.atMessage({ 'message': vRes, 'type': 'error', })
      return
    }
    
    const res = await cloudRequest({ name: 'businessRegiste', data })
    if (res.code !== 'success') return

    if(await showModal({
      title: '创建完成',
      content: '前往「员工管理」页面编辑您的员工',
      showCancel: false,
      confirmText: '前往',
      confirmColor: '#7B8FFF'
    })) redirectTo('/pages/business/index/index', { current: 1 })
  }

  render () {
    const { regionValue, startTime, rangeTime, endTime } = this.state
    return (
      <View className='p-page'>
        <AtMessage />
        <View className='p-contain'>
          <View className='p-form'>
            <View className='u-item'>
              <View className='u-name'>商家名称</View>
              <Input className='u-input' placeholder='请输入名称' placeholderClass='color-888' maxLength='20' onBlur={this.onChangeInput.bind(this, 'name')} />
            </View>
            <View className='u-item'>
              <View className='u-name'>省市区</View>
                <Picker className={`u-input ${!regionValue[0] && 'color-888'}`} mode='region' onChange={this.onChangeRegion.bind(this)}>{regionValue.length > 0 ? regionValue.join(' ') : '请选择省市区'}</Picker>
            </View>
            <View className='u-item'>
              <View className='u-name'>地址</View>
              <Input className='u-input' placeholder='请输入详细地址' placeholderClass='color-888' maxLength='30' onBlur={this.onChangeInput.bind(this, 'address')} />
            </View>
            <View className='u-item'>
              <View className='u-name'>联系方式</View>
              <Input className='u-input' placeholder='请输入电话' type='number' placeholderClass='color-888' maxLength='11' onBlur={this.onChangeInput.bind(this, 'phone')} />
            </View>
            <View className='u-item'>
              <View className='u-name'>营业起始</View>
              <Picker className={`u-input ${!startTime && 'color-888'}`} mode='selector' range={rangeTime} onChange={this.onChangeStartTime.bind(this)}>{startTime || '请选择营业起始时间'}</Picker>
            </View>
            <View className='u-item'>
              <View className='u-name'>营业截止</View>
              <Picker className={`u-input ${!endTime && 'color-888'}`} mode='selector' range={rangeTime} onChange={this.onChangeEndTime.bind(this)}>{endTime || '请选择营业截止时间'}</Picker>
            </View>
          </View>
          <View className='u-foot'>
            <Button className='btn-style btn-purple btn-large btn-circle-44 u-btn' hoverClass='btn-hover' onClick={this.onClickCreate}>完成</Button>
          </View>
        </View>
      </View>
    )
  }
}
