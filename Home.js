import { StyleSheet, View, Text } from 'react-native'
import DataSyncer from "./logic/data_syncer"
import Icon from 'react-native-vector-icons/FontAwesome'

import React, { useState } from 'react'

export default Home = ({ navigation }) => {
  const [isBusy, setIsBusy] = useState(false)

  const fetchData = async () => {
    if (isBusy) {
      return
    }

    setIsBusy(true)
    const dataSyncer = DataSyncer()
    await dataSyncer.start()
    setIsBusy(false)
  }

  const goToCategories = () => {
    if (isBusy) {
      return
    }
    navigation.navigate('Categories', {})
  }

  const goToQuestions = () => {
    if (isBusy) {
      return
    }
    navigation.navigate('Questions', {})
  }

  const goToNewStudySession = () => {
    if (isBusy) {
      return
    }
    navigation.navigate('NewStudySession', {})
  }

  return (
      <View
        style={[
          styles.container,
          {
            flexDirection: 'column'
          },
        ]}>
        
        <View onTouchStart={goToQuestions} style={[styles.navigationBox, {backgroundColor: '#244cb5'}]}>
          <Text style={[styles.options]}>
            <Icon name="reply" size={34} color="white" style={{padding: 10}} />
            Resume
          </Text>
        </View>
        <View onTouchStart={fetchData} style={[styles.navigationBox, {backgroundColor: '#2856c9'}]}>
          <Text style={[styles.options, {fontSize: 40}]}>
            <Icon name="refresh" size={34} color="white" />
            { isBusy ? "Fetching data ..." : "Fetch Data" }
          </Text>
        </View>
        <View onTouchStart={goToCategories} style={[styles.navigationBox, {backgroundColor: '#2f5ed4'}]}>
          <Text style={[styles.options]}>
            <Icon name="file-text-o" size={34} color="white" />
            Manual Mode
          </Text>
        </View>
        <View onTouchStart={goToNewStudySession} style={[styles.navigationBox, {backgroundColor: '#3564db'}]}>
          <Text style={[styles.options]}>
            <Icon name="gears" size={34} color="white" />
            Study Session
          </Text>
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  navigationBox: {
    height: '100%',
    justifyContent: 'center',
    flex: 1
  },
  options: {
    textAlign: 'center',
    fontSize: 36,
    color: 'white'
  }
})
