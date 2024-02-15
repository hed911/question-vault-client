import AsyncStorage from '@react-native-async-storage/async-storage'

export default QuestionRepo = () => {
  const byCategory = async (categoryId) => {
    const data = JSON.parse(await AsyncStorage.getItem('questions'))
    return data[categoryId.toString()] || []
  }

  const sessionData = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('session_questions'))
    return data || []
  }

  const updateBulk = async data => {
    await AsyncStorage.setItem('questions', JSON.stringify(data))
  }

  const insertSessionData = async data => {
    await AsyncStorage.setItem('session_questions', JSON.stringify(data))
  }

  const updateDificulty = async (id, value) => {
    const data = JSON.parse(await AsyncStorage.getItem('questions'))
    const sessionData = JSON.parse(await AsyncStorage.getItem('session_questions'))

    const newData = await findAndUpdateAttributeInData({
      data,
      id,
      key: 'dificulty_level',
      value
    })
    const newSessionData = await findAndUpdateSessionAttributeInData({
      data: sessionData,
      id,
      key: 'dificulty_level',
      value
    })
    //console.log(`11111: ${data}`)
    //console.log(`22222: ${newSessionData}`)
    await AsyncStorage.setItem('questions', JSON.stringify(newData))
    //console.log("8")
    await AsyncStorage.setItem('session_questions', JSON.stringify(newSessionData))
    //console.log("9")
  }

  const findAndUpdateAttributeInData = async ({data, id, key, value}) => {
    for (const categoriaId in data) {
      const possibleObject = data[categoriaId].find(e => e.id === id)
      if (possibleObject) {
        possibleObject[key] = value
        return data
      }
    }
    return data
  }

  const findAndUpdateSessionAttributeInData = async ({data, id, key, value}) => {
    const possibleObject = data.find(e => e.id === id)
    if (possibleObject) {
      possibleObject[key] = value
      return data
    }
    return data
  }

  const updateKnowledge = async (id, value) => {
    const data = JSON.parse(await AsyncStorage.getItem('questions'))
    const sessionData = JSON.parse(await AsyncStorage.getItem('session_questions'))

    const newData = await findAndUpdateAttributeInData({
      data,
      id,
      key: 'answer_known',
      value
    })
    const newSessionData = await findAndUpdateSessionAttributeInData({
      data: sessionData,
      id,
      key: 'answer_known',
      value
    })

    await AsyncStorage.setItem('questions', JSON.stringify(newData))
    await AsyncStorage.setItem('session_questions', JSON.stringify(newSessionData))
  }

  return { 
    byCategory,
    updateBulk,
    insertSessionData,
    sessionData,
    updateDificulty,
    updateKnowledge
  }
}