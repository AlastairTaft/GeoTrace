import React, { useState } from 'react'
import { SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native'
import Divider from './../components/Divider'


function Item({ title, style }) {
  return (
    <View style={styles.item}>
      <Text style={[styles.title, style]}>{title}</Text>
    </View>
  );
}

var DATA = [...Array(15)].map((foo, index) => {
  return {
    id: index + '',
    title: index + '',
    value: index,
  }
})

DATA.splice(0, 0, {
  id: 'topSpacer',
  title: '',
  value: null,
})
DATA.push({
  id: 'bottomSpacer',
  title: '',
  value: null,
})

const ITEM_HEIGHT = 80

function DaysSelectControl(props) {

  var [selectedIndex, setSelectedIndex] = useState(
    DATA.findIndex(dto => props.value == dto.value) || 0
  )

  if (!props.height)
    throw new Error(`'DaysSelectControl' requires a height to compute where to
      position the divider lines.`.replace(/\s+/g, ' ' ))

  return (
    <View style={[styles.container, props.style]}>
      <FlatList
        data={DATA}
        renderItem={({ item, index }) => {
          if (item.id == 'topSpacer' || item.id == 'bottomSpacer'){
            var spacerHeight = ((props.height) / 2)  - ITEM_HEIGHT
            return <View style={[styles.topSpacer, { height: spacerHeight }]} />
          }
          return <Item 
            title={item.title} 
            style={selectedIndex == index ? styles.selectedItem : undefined}
          />
        }}
        keyExtractor={item => item.id}
        onScroll={e => {
          var yOffset = e.nativeEvent.contentOffset.y + 40
          var index = Math.round((yOffset - yOffset % 80) / 80)
          var newIndex = index + 1
          if (DATA[newIndex] && newIndex != selectedIndex){
            setSelectedIndex(newIndex)
            if (props.onChange)
              props.onChange(DATA[newIndex].value)
          }
        }}
        snapToInterval={80}
      />
      <View style={styles.dividerAnchor}>
        <View style={styles.dividerAnchorInner}>
          <Divider style={styles.dividerTop} />
          <Divider style={styles.dividerBottom} />
        </View>
      </View>
    </View>
  );
}

export default DaysSelectControl

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  item: {
    height: 70,
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItem: {
    //fontSize: 72,
    color: '#172150',
  },
  title: {
    fontSize: 36,
    color: '#17215064',
  },
  dividerAnchor: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: 1,
  },
  dividerAnchorInner: {
    position: 'relative',
    height: 1,
  },
  dividerTop: {
    position: 'absolute',
    top: -40,
    left: -150,
    width: 300,
  },
  dividerBottom: {
    position: 'absolute',
    bottom: -40,
    left: -150,
    width: 300,
  },
  topSpacer: {
  },
  bottomSpacer: {
  },
});
