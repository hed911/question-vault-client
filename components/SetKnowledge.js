import { View, Text } from 'react-native'
import { Dialog, Button, RadioButton } from 'react-native-paper'

import React, { } from 'react'

export default SetKnoledge = ({visible, knowledge, onValueUpdated, onConfirmed, onCancelled}) => {
  return (
    <Dialog visible={visible} onDismiss={onCancelled}>
      <Dialog.Title>Choose an option</Dialog.Title>
      <Dialog.Content>
        <RadioButton.Group onValueChange={onValueUpdated} value={knowledge}>
        <View>
          <Text>I know the answer!</Text>
          <RadioButton value={true} />
        </View>
        <View>
          <Text>I don't know the answer</Text>
          <RadioButton value={false} />
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
