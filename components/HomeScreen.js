import React from 'react';
import { Button, View, Text } from 'react-native';
import { styles } from '../app.style';

const HomeScreen = ({navigation}) => {

  return (
    <View style={styles.container}>
    <View>
        <Text>Welcome to Pic-To-Pdf</Text>
    </View>
    <View>
        <Button 
            style={styles.button}
            title="Go to camera" 
            onPress={() => navigation.navigate('Camera')} 
        />
    </View>
    </View>

  );
}

export default HomeScreen