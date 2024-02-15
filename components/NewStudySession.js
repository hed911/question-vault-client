import { ScrollView, StyleSheet, View, Text, KeyboardAvoidingViewBase } from 'react-native'
import { RadioButton, Checkbox, TextInput, Button } from 'react-native-paper'
import CategoryRepo from "../persistence/category_repo"
import StudySession from "../logic/study_session"

import React, { useState, useEffect } from 'react'

export default NewStudySession = ({ navigation }) => {
  const [questionsNumber, setQuestionsNumber] = useState("20")
  const [categories, setCategories] = useState([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
  const [dificultyLevel, setDificultyLevel] = useState('any')
  const [knowledge, setKnowledge] = useState('any')
  
  useEffect(() => {
    const fetchData = async () => {
      setCategories(await CategoryRepo().all())
    }
    fetchData() 
  }, [])

  const onCategoryPressed = category => {
    const index = selectedCategoryIds.indexOf(category.id)
    let newValues = [ ...selectedCategoryIds ]
    if (index === -1) {
      newValues.push(category.id)
    } else { 
      newValues.splice(index, 1)
    }
    setSelectedCategoryIds(newValues)
  }

  const canGenerate = selectedCategoryIds.length && questionsNumber !== ''

  const onGenerate = async () => {
    ConfigRepo().setAttributes({
      currentIndex: 0
    })
    const parsedDificultylevel = dificultyLevel === 'any' ? null : dificultyLevel
    const parsedKnowledge = knowledge === 'any' ? null : knowledge
    const session = new StudySession({
      categoryIds: selectedCategoryIds,
      questionsNumber,
      dificultyLevel: parsedDificultylevel,
      knowledge: parsedKnowledge
    })
    
    await session.create()

    navigation.navigate('Questions', {})
  }

  return (
    <View style={[styles.externalContainer]}>
      <ScrollView style={[styles.container]}>
        <View style={{ }}>
          <Text style={{fontSize: 20, color: "black", marginBottom: 10}}>New Study Session</Text>
        </View>
        <View style={{}}>
          <TextInput
            activeUnderlineColor="#244cb5"
            label="Number of questions"
            mode="outlined"
            value={questionsNumber}
            onChangeText={value => setQuestionsNumber(value.replace(/[^0-9]/g, ''))}
            style={{backgroundColor: "white"}}
          />

          <View style={{backgroundColor: "white", marginBottom: 5 }}>
            <Text style={{ margin: 5, fontSize: 15 }}>Dificulty Level:</Text>
            <RadioButton.Group
              onValueChange={ value => setDificultyLevel(value) }
              value={dificultyLevel}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton value="any" color="blue" />
                <Text>Any</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton value="easy" color="blue" />
                <Text>Easy</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton value="medium" color="blue" />
                <Text>Medium</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton value="hard" color="blue" />
                <Text>Hard</Text>
              </View>
            </RadioButton.Group>
          </View>

          <View style={{backgroundColor: "white", marginBottom: 5 }}>
            <Text style={{ margin: 5, fontSize: 15 }}>knowledge Level:</Text>
            <RadioButton.Group
              onValueChange={ value => setKnowledge(value) }
              value={knowledge}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton value="any" color="blue" />
                <Text>Any</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton value={true} color="blue" />
                <Text>Only known answers</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton value={false} color="blue" />
                <Text>Only unknown answers</Text>
              </View>
            </RadioButton.Group>
          </View>

          <View style={{backgroundColor: "white" }}>
            <Text style={{ margin: 5, fontSize: 15 }}>Categories:</Text>
            {categories.map(category => 
              <View key={category.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  status={selectedCategoryIds.includes(category.id) ? 'checked' : 'unchecked'}
                  onPress={() => onCategoryPressed(category)}
                />
                <Text>{category.name}</Text>
              </View>
            )}
          </View>
          

          

        </View>
        <View style={{ }}>
          <View>
            <Button mode="contained" onPress={onGenerate} disabled={!canGenerate}>
              Generate
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  externalContainer: {
    flex: 1,
    backgroundColor: "white"
  },
  progressIndicator: {
    fontSize: 18,
    textAlign: "center",
    color: "white",
    padding: 8
  },
  progressExternalContainer: {
    backgroundColor: 'white',
    borderRadius: 15
  },
  container: {
    flex: 1,
    margin: 20
  },
  item: {
    padding: 20,
    fontSize: 30,
    height: 50
  },
  realButton: {
    backgroundColor:'#242696',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  loginText: {
    color:'#fff',
    textAlign:'center',
    padding : 10
  }
})
