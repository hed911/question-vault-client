import { StyleSheet, View, Text } from 'react-native'
import SetDificulty from './SetDificulty'
import SetKnowledge from './SetKnowledge'
import CategoryRepo from "../persistence/category_repo"
import QuestionRepo from "../persistence/question_repo"
import ConfigRepo from "../persistence/config_repo"
import { shuffle } from '../logic/array_methods'
import { ProgressBar, Dialog, Button, RadioButton } from 'react-native-paper'
import Tts from 'react-native-tts'
import { MaterialDialog } from 'react-native-material-dialog'


import React, { useState, useEffect, useRef } from 'react'

export default Questions = ({}) => {
  const questionRepo = useRef(QuestionRepo())
  const configRepo = useRef(ConfigRepo())
  const dataSyncer = useRef(DataSyncer())
  const [displaySetKnowledge, setDisplaySetKnowledge] = useState(false)
  const [displaySetDificulty, setDisplaySetDificulty] = useState(false)
  const [displayConfirmReset, setDisplayConfirmReset] = useState(false)
  const [category, setCategory] = useState(null)
  const [data, setData] = useState([])
  const [counter, setCounter] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentDificulty, setCurrentDificulty] = useState(null)
  const [currentKnowledge, setCurrentKnowledge] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setData(await questionRepo.current.sessionData())
    }
    const fetchConfig = async () => {
      const config = await configRepo.current.getData()
      if (config.currentCounter) {
        setCounter(config.currentCounter)
      }
      if (config.categoryId) {
        setCategory(await CategoryRepo().find(config.categoryId))
      }
    }

    fetchData()
    fetchConfig()
  }, [])

  useEffect(() => {
    const updateCounter = async () => {
      await configRepo.current.setAttribute({key: 'currentCounter', value: counter})
    }
    if (data.length) {
      const newIndex = Math.abs(counter) % data.length
      setCurrentIndex(newIndex)
      setCurrentDificulty(data[newIndex]?.dificulty_level)
      setCurrentKnowledge(data[newIndex]?.answer_known || false)
      updateCounter()
    }
  }, [counter])

  useEffect(() => {
    questionRepo.current.insertSessionData(data)
  }, [data])

  const onPressReset = () => {
    Tts.speak(data[currentIndex]?.query, {
      iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
      rate: 0.5,
    })
    setDisplayConfirmReset(true)
  }

  const doReset = () => {
    setCounter(0)
    setData(shuffle(data))
    setDisplayConfirmReset(false)
  }

  const onPressPrevious = () => {
    if (counter == 0) {
      setCounter(data.length - 1)
      return
    }
    setCounter(counter - 1)
  }

  const onPressNext = () => {
    setCounter(counter + 1)
  }

  const dificulty = () => {
    const level = data[currentIndex]?.dificulty_level
    const options = {
      easy: { text: "easy", color: "green" },
      medium: { text: "medium", color: "orange" },
      hard: { text: "hard", color: "red" },
    }
    return {
      text: options[level]?.text || "dificulty-not-set",
      color: options[level]?.color || "black"
    }
  }

  const knowledge = () => {
    const level = data[currentIndex]?.answer_known
    const options = {
      true: { text: "known-answer", color: "green" },
      false: { text: "unknown-answer", color: "red" }
    }
    return {
      text: options[level]?.text || "knowledge-not-set",
      color: options[level]?.color || "black"
    }
  }

  const parsePercentage = number => {
    if(!Number.isFinite(number)) {
      return 0
    }
    
    if(isNaN(number)) {
      return 0
    }

    return number
  }

  const percentage = ((currentIndex + 1) / data.length) || 0

  const updateDificulty = async () => {
    const record = data[currentIndex]
    let parsedDificulty = currentDificulty
    if (parsedDificulty === "notset") {
      parsedDificulty = null
    }
    questionRepo.current.updateDificulty(record.id, parsedDificulty)
    try {
      //await dataSyncer.current.updateDificulty(data[currentIndex]?.id, parsedDificulty)
      record.dificulty_level = parsedDificulty
      hideSetDificulty()
    } catch (ex) {
      console.log(ex)
    }
  }

  const dificultyUpdated = (newValue) => {
    setCurrentDificulty(newValue)
  }

  const openSetDificultyDialog = () => {
    setDisplaySetDificulty(true)
  }

  const hideSetDificulty = () => {
    setDisplaySetDificulty(false)
  }

  const updateKnowledge = async () => {
    const record = data[currentIndex]
    questionRepo.current.updateKnowledge(record.id, currentKnowledge)
    try {
      //await dataSyncer.current.updateKnowledge(data[currentIndex]?.id, currentKnowledge)
      record.answer_known = currentKnowledge
      hideSetKnowledge()
    } catch (ex) {
      console.log(ex)
    }
  }

  const knowledgeUpdated = newValue => {
    setCurrentKnowledge(newValue)
  }

  const openSetKnowledge = () => {
    setDisplaySetKnowledge(true)
  }

  const hideSetKnowledge = () => {
    setDisplaySetKnowledge(false)
  }

  return (
    <View style={[styles.externalContainer]}>
      <View style={[styles.container]}>
        <View style={{ flex: 0.20 }}>
          <Text style={{fontSize: 22, color: "black"}}>{category?.name || data[currentIndex]?.category?.name || 'Study Session'}</Text>
          <ProgressBar progress={parsePercentage(percentage)}  />
          <Text style={[styles.progressIndicator]}>{currentIndex + 1} / {data.length}</Text>
        </View>
        <View style={[styles.progressExternalContainer]}>
          <View style={{padding: 0}}>
            <Text style={{ fontSize: 30 }}>
              {data[currentIndex]?.query}
              {"\n\n"}
              <Text onPress={openSetDificultyDialog} style={{ fontSize: 22, color: dificulty().color }}>#{dificulty().text}</Text>
              {"\n"}
              <Text onPress={openSetKnowledge} style={{ fontSize: 22, color: knowledge().color }}>#{knowledge().text}</Text>
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", flex: 0.20}}>
          <View style={{ width: "33%"}}>
            <Button icon="arrow-left" mode="contained" onPress={onPressPrevious}>
              Previous
            </Button>
          </View>
          <View style={{ width: "33%"}}>
            <Button icon="refresh" mode="contained" onPress={onPressReset}>
              Reset
            </Button>
          </View>
          <View style={{ width: "33%"}}>
            <Button icon="arrow-right" mode="contained" onPress={onPressNext}>
              Next
            </Button>
          </View>
        </View>
      </View>

      <SetDificulty 
        visible={displaySetDificulty}
        dificultyLevel={currentDificulty}
        onValueUpdated={dificultyUpdated}
        onConfirmed={updateDificulty}
        onCancelled={hideSetDificulty}
      />

      <SetKnowledge
        visible={displaySetKnowledge}
        knowledge={currentKnowledge}
        onValueUpdated={knowledgeUpdated}
        onConfirmed={updateKnowledge}
        onCancelled={hideSetKnowledge}
      />

      <MaterialDialog
        title="Are you sure?"
        visible={displayConfirmReset}
        onOk={doReset}
        onCancel={() => setDisplayConfirmReset(false)}>
        <Text style={{}}>
          Resetting will shuffle all questions again and will start from the question number 1
        </Text>
      </MaterialDialog>
    </View>
  )
}

const styles = StyleSheet.create({
  externalContainer: {
    flex: 1,
    backgroundColor: "white"
  },
  progressIndicator: {
    fontSize: 16,
    color: "black",
    paddingTop: 8,
    paddingBottom: 8
  },
  progressExternalContainer: {
    backgroundColor: 'white',
    flex: 0.60,
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
