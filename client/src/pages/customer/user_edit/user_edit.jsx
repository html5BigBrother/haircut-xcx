import Taro, { Component } from '@tarojs/taro'
import { View, Button, Input } from '@tarojs/components'
import { AtMessage } from 'taro-ui'
import './user_edit.styl'

import validate from '../../../utils/validate'
import { reLaunch } from '../../../utils/util'
import cloudRequest from '../../../utils/request_cloud'

export default class UserEdit extends Component {

  constructor (props) {
    super(props)
    this.state = {
      name: '',
      type: ''
    }
  }

  componentDidMount () {
    this.setState({
      name: this.$router.params.name,
      type: this.$router.params.type
    })
  }

  config = {
    navigationBarTitleText: '我的',
  }

  onChangeInput(e) {
    this.setState({ name: e.detail.value })
  }

  // 确认修改
  async onClickSure() {
    const { name, type } = this.state
    const data = { [type]: name }

    const vRes = validate([
      { type: 'vEmpty', value: name, msg: '内容不能为空' },
    ])
    if (vRes !== true) {
      Taro.atMessage({ 'message': vRes, 'type': 'error', })
      return
    }

    Taro.showLoading({ title: '加载中', mask: true })
    const res = await cloudRequest({ name: 'modifyCustomer', data })
    Taro.hideLoading()
    if (!res || res.code !== 'success') return

    // Taro.atMessage({ 'message': '修改成功', 'type': 'success', })

    reLaunch('/pages/customer/index/index', { current: 2 })
  }

  render () {
    return (
      <View className='p-page'>
        <AtMessage />
        <View className='p-contain'>
          <View className='p-operation-list'>
            <View className='u-item'>
              <Input className='flex-1' placeholderClass='color-888' maxLength='20' value={this.state.name} placeholder='请输入姓名' onBlur={this.onChangeInput.bind(this)} />
            </View>
          </View>
          <View className='p-bottom-btn'>
            <Button className='btn-style btn-orange btn-large btn-circle-44' hoverClass='btn-hover' onClick={this.onClickSure.bind(this)}>确认</Button>
          </View>
        </View>
      </View>
    )
  }
}
