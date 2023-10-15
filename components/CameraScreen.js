import React, { useEffect, useState } from 'react'
import { View, Pressable, Text } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { ImageManipulator } from 'expo-image-manipulator';
import { styles } from '../app.style';

const CameraScreen = () => {
    const [cameraPermission, setCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);


    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(status === 'granted');
      })();
    }, []);
  
    const takePicture = async () => {
      if (camera) {
        const photo = await camera.takePictureAsync();
        setCapturedImage(photo);
        
        const croppedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ crop: { originX: 0, originY: 0, width: 200, height: 200 } }], // Adjust the crop parameters as needed
          { compress: 1, format: ImageManipulator.SaveFormat.PDF }
        );
        
        setCapturedImage(croppedImage);
      }
    };
  
    const saveToCameraRoll = async () => {
      if (capturedImage) {
        const asset = await MediaLibrary.createAssetAsync(capturedImage.uri);
        await MediaLibrary.createAlbumAsync('YourAlbumName', asset, false);
      }
    };
  
    const sharePDF = async () => {

      if (capturedImage) {
        const pdfUri = await convertToPDF();
        if (pdfUri) {
          Sharing.shareAsync(pdfUri);
        }
      }
    };
  
    const deletePicture = () => {
      if (capturedImage) {
        setCapturedImage(null);
      }
    };
  
    if (cameraPermission === null) {
      return <View />;
    }
  
    if (cameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    
  return (
    <View style={styles.camera}>
    {capturedImage ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, flex: 2 }}>Image Captured!</Text>

        {/* SAVE TO CAMERA ROLL BUTTON */}
        <Pressable onPress={saveToCameraRoll} style={styles.button}>
          <Text>Save to Camera Roll</Text>
        </Pressable>

        {/* SHARE AS PDF BUTTON */}
        <Pressable onPress={sharePDF} style={styles.button}>
          <Text>Share as PDF</Text>
        </Pressable>

        {/* BACK BUTTON */}
        <Pressable onPress={deletePicture} style={styles.button}>
          <Text>Delete Pic</Text>
        </Pressable>
      </View>
    ) : (
        <Camera             
          style={styles.captureButtonContainer}
          type={Camera.Constants.Type.back}
          ref={(ref) => setCamera(ref)}
        >
          <Pressable onPress={takePicture} style={styles.captureButton}>
            <Text>+</Text>
          </Pressable>
        </Camera>
    )}
  </View>
  )
}

export default CameraScreen