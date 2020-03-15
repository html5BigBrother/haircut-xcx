import Taro, { Component } from '@tarojs/taro'
import { View, Button, Input, Picker } from '@tarojs/components'
import { AtMessage } from 'taro-ui'
import './user_edit_address.styl'

import validate from '../../../utils/validate'
import { reLaunch } from '../../../utils/util'
import cloudRequest from '../../../utils/request_cloud'

export default class UserEdit extends Component {

  constructor (props) {
    super(props)
    this.state = {
      regions: [],
      address: ''
    }
  }

  componentDidMount () {
    const regions = JSON.parse(this.$router.params.regions)
    const address = this.$router.params.address
    this.setState({
      regions,
      address
    })
  }

  config = {
    navigationBarTitleText: '我的',
  }

  onChangeInput(valueName, e) {
    this.setState({ [valueName]: e.detail.value })
  }

  onChangeRegion(e) {
    const regions = e.detail.value
    this.setState({ regions })
  }

  // 确认修改
  async onClickSure() {
    const { regions, address } = this.state
    const data = { regions, address }

    validate.methods['vEndTime'] = (v) => {
      const endIndex = this.state.rangeTime.indexOf(v)
      const startIndex = this.state.rangeTime.indexOf(this.state.openingTime)
      return endIndex > startIndex
    }
    const vRes = validate([
      { type: 'vArrEmpty', value: regions, msg: '请选择省市区' },
      { type: 'vEmpty', value: address, msg: '请输入地址' },
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
    const { regions, address } = this.state
    return (
      <View className='p-page'>
        <AtMessage />
        <View className='p-contain'>
          <View className='p-operation-list'>
            <View className='u-item'>
            <Picker className={`flex-1 ${!regions[0] && 'color-888'}`} mode='region' onChange={this.onChangeRegion.bind(this)}>{regions.length > 0 ? regions.join(' ') : '请选择省市区'}</Picker>
            </View>
            <View className='u-item'>
            <Input className='u-input' placeholder='请输入详细地址' placeholderClass='color-888' maxLength='30' value={address} onBlur={this.onChangeInput.bind(this, 'address')} />
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
