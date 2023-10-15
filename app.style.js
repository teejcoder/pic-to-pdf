import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    camera: {
      flex: 1,
    }, 
    captureButtonContainer: {
      backgroundColor: 'transparent',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      paddingBottom: 50,
    },
    captureButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 50,
      padding: 20,
      width: 80,
      height: 80,
    },
    button: {
      width: 250,
      height: 50,
      padding: 10,
      margin: 10,
      backgroundColor: 'cyan',
      borderRadius: 25,
      borderColor: 'black',
      alignItems: 'center',
      justifyContent: 'center'
    },
  });
  