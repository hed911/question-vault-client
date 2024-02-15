import AsyncStorage from '@react-native-async-storage/async-storage'

export default CategoryRepo = () => {
  const all = async () => {
    return JSON.parse(await AsyncStorage.getItem('categories'))
  }

  const find = async (id) => {
    const records = JSON.parse(await AsyncStorage.getItem('categories'))
    return records.find( c => c.id === id)
  }

  const updateBulk = async data => {
    await AsyncStorage.setItem('categories', JSON.stringify(data))
  }

  return { all, find, updateBulk }
}