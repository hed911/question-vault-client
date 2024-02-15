import AsyncStorage from '@react-native-async-storage/async-storage'

export default ConfigRepo = () => {
  const getData = async () => {
    return JSON.parse(await AsyncStorage.getItem('config') || '{}')
  }

  const setAttribute = async ({key, value}) => {
    const data = getData()
    data[key] = value
    await AsyncStorage.setItem('config', JSON.stringify(data))
  }

  const setAttributes = async data => {
    await AsyncStorage.setItem('config', JSON.stringify(data))
  }

  const getAttribute = async key => {
    return getData()[key]
  }

  return { getData, setAttribute, setAttributes, getAttribute }
}