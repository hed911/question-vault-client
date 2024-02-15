import Categories from './components/Categories'
import Questions from './components/Questions'
import NewStudySession from './components/NewStudySession'
import Home from './Home'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PaperProvider, DefaultTheme } from 'react-native-paper'

const Stack = createNativeStackNavigator()

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#244CB5",
  },
};

export default App = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{title: ''}}
          />
          <Stack.Screen name="Categories" component={Categories} options={{title: ''}} />
          <Stack.Screen name="Questions" component={Questions} options={{title: ''}} />
          <Stack.Screen name="NewStudySession" component={NewStudySession} options={{title: ''}} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}
