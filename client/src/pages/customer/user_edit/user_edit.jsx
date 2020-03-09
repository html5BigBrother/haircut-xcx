import Taro, { Component } from '@tarojs/taro'
import { View, Button, Input } from '@tarojs/components'
import './user_edit.styl'

import { reLaunch } from '../../../utils/util'

export default class UserEdit extends Component {

  constructor (props) {
    super(props)
    this.state = { name: '' }
  }

  componentWillMount () { }

  componentDidMount () {
    console.log(this.$router.params)
    this.setState({
      name: this.$router.params.name
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '快预约',
  }


  // 确认修改
  onClickSure() {
    // if () {}
    reLaunch('/pages/customer/index/index', { current: 2 })
  }

  render () {
    return (
      <View className='p-page'>
        <View className='p-contain'>
          <View className='p-operation-list'>
            <View className='u-item' onClick={this.onClickToUserEdit}>
              <Input className='flex-1' value={this.state.name} placeholder='请输入姓名' />
            </View>
          </View>
          <View className='p-bottom-btn'>
            <Button className='btn-style btn-orange u-btn' hoverClass='btn-hover' onClick={this.onClickSure}>确认</Button>
          </View>
        </View>
      </View>
    )
  }
}
