import { Camera, CameraType } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../app.style';

export default function CameraScreen() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    requestPermission();
  }, []);

  if (permission === null) {
    return <Text>Loading...</Text>;
  }

  if (permission && permission.granted) {
    return (
      <View style={styles.container}>
        <Camera style={styles.camera} type={type}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  } else {
    return <Text>Camera permission not granted.</Text>;
  }
}

function toggleCameraType() {
  setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
}


// import React, { useEffect, useState } from 'react'
// import { View, Pressable, Text, Image } from 'react-native';
// import { Camera, CameraType } from 'expo-camera';
// import * as MediaLibrary from 'expo-media-library';
// import * as Sharing from 'expo-sharing';
// import * as Print from 'expo-print';
// import { ImageManipulator } from 'expo-image-manipulator';
// import { styles } from '../app.style';

// const CameraScreen = () => {
//   const [type, setType] = useState(CameraType.back);
//   const [camera, setCamera] = useState(null);
//   const [capturedImage, setCapturedImage] = useState(null);


//   const requestCameraPermission = async () => {
//     const { status } = await Camera.requestCameraPermissionsAsync();
//     if (status === 'granted') {
//       {toggleCameraType}
//     } else {
//       alert('Camera permission not granted.');
//     }
//   };

//   const toggleCameraType = () => {
//     setType((current) =>
//       current === CameraType.back ? CameraType.front : CameraType.back
//     );
//   };

//   const takePicture = async () => {
//     if (camera) {
//       const photo = await camera.takePictureAsync();

//       const croppedImage = await ImageManipulator.manipulateAsync(
//         photo.uri,
//         [{ crop: { originX: 0, originY: 0, width: 800, height: 800 } }],
//         { compress: 1, format: ImageManipulator.SaveFormat.PDF }
//       );

//       setCapturedImage(croppedImage);
//     } else{
//       alert('error in takePicture function')
//     }
//   };

//     const editPicture = async () => {
//       if (capturedImage) {
//         // Define the resizing options
//         const resizedImage = await ImageManipulator.manipulateAsync(
//           capturedImage.uri,

//           { compress: 1, format: ImageManipulator.SaveFormat.PDF }
//         );
    
//         // Define the cropping options
//         const croppedImage = await ImageManipulator.manipulateAsync(
//           resizedImage.uri,

//           { compress: 1, format: ImageManipulator.SaveFormat.PDF }
//         );
//       } else {
//         alert('error in croppedImage function')
//       }
//         // Update the state with the edited image
//         setCapturedImage(croppedImage);

//     };
  
//     const saveToCameraRoll = async () => {
//       if (capturedImage) {
//         const asset = await MediaLibrary.createAssetAsync(capturedImage.uri);
//         await MediaLibrary.createAlbumAsync('YourAlbumName', asset, false);
//       }
//     };
  
//     const sharePDF = async () => {

//       if (capturedImage) {
//         const pdfUri = await convertToPDF();
//         if (pdfUri) {
//           Sharing.shareAsync(pdfUri);
//         }
//       }
//     };
  
//     const deletePicture = () => {
//       if (capturedImage) {
//         setCapturedImage(null);
//       }
//     };
  
//     if (cameraPermission === null) {
//       return <View />;
//     }
  
//     if (cameraPermission === false) {
//       return <Text>No access to camera</Text>;
//     }
    
//   return (
//     <View style={styles.camera}>
//     {capturedImage ? (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        
//         {/* SAVE TO CAMERA ROLL BUTTON */}
//         <Pressable onPress={saveToCameraRoll} style={styles.button}>
//           <Text>Save to Camera Roll</Text>
//         </Pressable>

//         {/* SHARE AS PDF BUTTON */}
//         <Pressable onPress={sharePDF} style={styles.button}>
//           <Text>Share as PDF</Text>
//         </Pressable>

//         {/* BACK BUTTON */}
//         <Pressable onPress={deletePicture} style={styles.button}>
//           <Text>Delete Pic</Text>
//         </Pressable>


//       </View>
//     ) : (
//         <Camera             
//           style={styles.captureButtonContainer}
//           type={type}
//           ref={(ref) => setCamera(ref)}
//         >
//           <Pressable onPress={takePicture} style={styles.captureButton}>
//             <Text>+</Text>
//           </Pressable>
//         </Camera>
//     )}
//   </View>
//   )
// }

// export default CameraScreen