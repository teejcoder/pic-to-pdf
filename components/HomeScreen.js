import React from 'react';
import { Button, View, Text, Pressable } from 'react-native';
import { styles } from '../app.style';

const HomeScreen = ({navigation}) => {

  return (
    <View style={styles.container}>
      <View>
          <Text>Welcome to Pic-To-Pdf</Text>
      </View>
      <View>
        <Pressable
          style={styles.button}
          title="Go to camera" 
          onPress={() => navigation.navigate('Camera')}
        >
          <Text>Open Camera</Text>
        </Pressable>

      </View>
    </View>

  );
}

export default HomeScreen