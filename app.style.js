import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
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
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 64,
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
  