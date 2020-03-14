import Taro, { Component } from '@tarojs/taro'
import { View, Button, Input } from '@tarojs/components'
import './staff_add.styl'

import HalfScreenLayout from '../../../components/half-screen-layout/half-screen-layout'

export default class UserEdit extends Component {

  constructor (props) {
    super(props)
    this.state = {
      layoutShow: false,
      staffList: [
        { name: 'Tony', type: '总监', price: '100' },
        { name: 'Jack', type: '经理', price: '50' },
      ]
    }
  }

  componentWillMount () { }

  componentDidMount () {}

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '添加员工',
  }

  onChangeShow(layoutShow) {
    this.setState({ layoutShow })
  }

  render () {
    const { staffList, layoutShow } = this.state
    return (
      <View className='p-page'>
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
                  <View className='flex-1'>{item.type}</View>
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
          onChangeShow={this.onChangeShow.bind(this)}
          renderFooter={
            <Button className='btn-style btn-purple btn-large btn-circle-44' hoverClass='btn-hover' onClick={this.onChangeShow.bind(this, true)}>确认</Button>
          }
        >
          <View className='p-form'>
            <View className='u-item'>
              <View className='u-name'>姓名</View>
              <Input className='u-input' placeholder='请输入姓名' placeholderClass='color-888' maxLength='20' onBlur={this.onChangeInput.bind(this, 'name')} />
            </View>
            <View className='u-item'>
              <View className='u-name'>职位</View>
              <Input className='u-input' placeholder='请输入职位' placeholderClass='color-888' maxLength='20' onBlur={this.onChangeInput.bind(this, 'name')} />
            </View>
            <View className='u-item'>
              <View className='u-name'>价位</View>
              <Input className='u-input' placeholder='请输入价位' placeholderClass='color-888' maxLength='20' onBlur={this.onChangeInput.bind(this, 'name')} />
            </View>
          </View>
        </HalfScreenLayout>
      </View>
    )
  }
}
