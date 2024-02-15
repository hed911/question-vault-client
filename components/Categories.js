import { TouchableWithoutFeedback, StyleSheet, FlatList, View, Text } from 'react-native'
import CategoryRepo from "../persistence/category_repo"
import QuestionRepo from "../persistence/question_repo"
import ConfigRepo from "../persistence/config_repo"
import { shuffle } from '../logic/array_methods'

import React, { useState, useEffect } from 'react'

export default Categories = ({ navigation }) => {
  const [data, setData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      setData(await CategoryRepo().all())
    }
  
    fetchData() 
  }, [])

  const prepareData = async (id) => {
    const rawData = await QuestionRepo().byCategory(id)
    return shuffle(rawData)
  }

  const goToQuestions = async id => {
    ConfigRepo().setAttributes({
      currentCounter: 0,
      currentCategoryId: id
    })
    const questionsData = await prepareData(id)
    QuestionRepo().insertSessionData(questionsData)
    navigation.navigate('Questions', {})
  }

  return (
    <View style={[styles.container]}>
      <FlatList
        data={data}
        renderItem={({item}) => (

          <TouchableWithoutFeedback onPress={ () => goToQuestions(item.id) }>
            <View>
              <Text style={styles.item}>{item.name}</Text>
            </View>
          </TouchableWithoutFeedback>

        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    padding: 20,
    fontSize: 30,
    height: 50
  }
})
