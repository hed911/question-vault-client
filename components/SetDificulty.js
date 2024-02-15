import { StyleSheet, View, Text } from 'react-native'
import { Dialog, Button, RadioButton } from 'react-native-paper'

import React, { } from 'react'

export default SetDificulty = ({visible, dificultyLevel, onValueUpdated, onConfirmed, onCancelled}) => {
  return (
    <Dialog visible={visible} onDismiss={onCancelled}>
      <Dialog.Title>Choose an option</Dialog.Title>
      <Dialog.Content>
        <RadioButton.Group onValueChange={onValueUpdated} value={dificultyLevel}>
        <View>
          <Text>Not set</Text>
          <RadioButton value={"notset"} />
        </View>
        <View>
          <Text>Easy</Text>
          <RadioButton value="easy" />
        </View>
        <View>
          <Text>Medium</Text>
          <RadioButton value="medium" />
        </View>
        <View>
          <Text>Hard</Text>
          <RadioButton value="hard" />
        </View>
        </RadioButton.Group>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onConfirmed}>OK</Button>
        <Button onPress={onCancelled}>Cancel</Button>
      </Dialog.Actions>
    </Dialog>
  )
}
