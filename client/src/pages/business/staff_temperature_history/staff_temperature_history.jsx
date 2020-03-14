import Taro, { Component } from '@tarojs/taro'
import { View, Button, Input } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './staff_temperature_history.styl'

export default class UserEdit extends Component {

  constructor (props) {
    super(props)
    this.state = {
      dateList: [
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

  componentWillMount () { }

  componentDidMount () {}

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '体温登记',
  }

  onChangeActive(index) {
    const { dateList } = this.state
    dateList[index].active = !dateList[index].active
    this.setState({ dateList })
  }

  onClickHideAll() {
    const { dateList } = this.state
    dateList.forEach((item) => {
      item.active = false
    })
    this.setState({ dateList })
  }

  render () {
    const { dateList } = this.state
    return (
      <View className='p-page'>
        <View className='p-contain'>
          <View className='p-list'>
            <View className='u-head'>
              <View className='flex-1 u-title'>历史记录</View>
              <View className='color-888' onClick={this.onClickHideAll.bind(this)}>全部收起</View>
            </View>
            {
              dateList.map((item, index) =>
                <View className='accordion-wrap' key={item.date}>
                  <View className='accordion-head' hoverClass='view-hover'  onClick={this.onChangeActive.bind(this, index)}>
                    <View className='accordion-content'>
                      <View className='flex-1 u-title'>{item.date}</View>
                    </View>
                    <AtIcon className={`accordion-chevron ${item.active && 'active'}`} value='chevron-down' size='14' color='#888'></AtIcon>
                  </View>
                  <View className={`accordion-list ${item.active && 'active'}`}>
                    {
                      item.itemList.map((item2) =>
                        <View className='accordion-item' key={item2.name}>
                          <View className='flex-1'>{item2.name}</View>
                          <View className={`color-g ${item2.price > 38 && 'color-r'}`}>{item2.price}</View>
                        </View>
                      )
                    }
                  </View>
                </View>
              )
            }
          </View>
        </View>
      </View>
    )
  }
}
