import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    captureButtonContainer: {
      backgroundColor: 'transparent',
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    captureButton: {
      backgroundColor: '#fff',
      borderRadius: 50,
      padding: 20,
      paddingHorizontal: 30,
      alignSelf: 'flex-end',
      marginBottom: 20,
    },
    button: {
      padding: 10,
      margin: 10,
      backgroundColor: 'cyan',
      borderRadius: 5,
      borderColor: 'black',
      alignItems: 'center',
    },
  });
  