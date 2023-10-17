import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Button,
  Share,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImageManipulator from 'expo-image-manipulator';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

const WINDOW_HEIGHT = Dimensions.get("window").height;

const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.uri;
      if (source) {
        await cameraRef.current.pausePreview();
  
        // Crop the captured image
        const croppedImageUri = await cropPicture(data.uri, {
          originX: 0,
          originY: 0,
          width: data.width,
          height: data.height,
        });
  
        // Set the cropped image as the captured image
        setCapturedImage({ uri: croppedImageUri });
  
        setIsPreview(true);
        console.log("picture source", source);
      }
    }
  };
  const cropPicture = async (imageUri, cropData) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ crop: cropData }], // Specify the cropping data
        { compress: 1, format: ImageManipulator.SaveFormat.PDF } // You can choose the format you prefer
      );
  
      // `manipulatedImage.uri` now contains the cropped image URI
      return manipulatedImage.uri;
    } catch (error) {
      console.error('Error cropping image:', error);
      throw error;
    }
  };
  

  const shareImage = async () => {
    try {
      if (!capturedImage) {
        // Handle the case where there is no captured image
        return;
      }

      // Convert the captured image to a PDF
      const pdfName = 'isPreview.pdf';
      const pdfPath = `${FileSystem.cacheDirectory}${pdfName}`;

      const { uri } = capturedImage;
      const htmlContent = `<html><body><img src="${uri}" /></body></html>`;
      const options = { html: htmlContent, width: 595, height: 842 }; // PDF dimensions (A4)

      const { uri: pdfUri } = await Print.printToFileAsync(options, pdfPath);

      // Share the PDF
      const result = await Share.share({
        url: pdfUri,
        title: 'Pic to PDF',
        message: 'Take a picture -> export to PDF instantly',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with an activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };


  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType((prevCameraType) =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const cancelPreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
  };

  const renderCancelPreviewButton = () => (
    <TouchableOpacity onPress={cancelPreview} style={styles.closeButton}>
      <View style={[styles.closeCross, { transform: [{ rotate: "45deg" }] }]} />
      <View
        style={[styles.closeCross, { transform: [{ rotate: "-45deg" }] }]}
      />
    </TouchableOpacity>
  );

  const renderCropButton = () => {
    <TouchableOpacity onPress={cropPicture} style={styles.cropButton}>
      <Text>Crop</Text>
  </TouchableOpacity>
  };


  const renderCaptureControl = () => (
    <View style={styles.control}>
      <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
        <Text style={styles.text}>{"Flip"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={!isCameraReady}
        onPress={takePicture}
        style={styles.capture}
      />
    </View>
  );

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.container}
        type={cameraType}
        onCameraReady={onCameraReady}
        onMountError={(error) => {
          console.log("camera error", error);
        }}
      />
      {isPreview && renderCancelPreviewButton()}
      {isPreview && renderCropButton()}
      {isPreview ? (
      <Image source={{ uri: isPreview.uri }} style={styles.media} />
        ) : (
        !isPreview && renderCaptureControl()
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    position: "absolute",
    top: 35,
    left: 15,
    height: closeButtonSize,
    width: closeButtonSize,
    borderRadius: Math.floor(closeButtonSize / 2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c4c5c4",
    opacity: 0.7,
    zIndex: 2,
  },
  media: {
    ...StyleSheet.absoluteFillObject,
  },
  closeCross: {
    width: "68%",
    height: 1,
    backgroundColor: "black",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    margin: 64,
  },
  cropButton: {
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
    backgroundColor: 'lime',
    justifyContent: 'center',
    alignItems: 'center'
  },
  shareButton: {
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
    backgroundColor: 'cyan',
    justifyContent: 'center',
    alignItems: 'center',
  },
  control: {
    position: "absolute",
    flexDirection: "row",
    bottom: 38,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  capture: {
    backgroundColor: "#f5f6f5",
    borderRadius: 5,
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
  },
  recordIndicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 25,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    opacity: 0.7,
  },
  recordTitle: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
  },
  recordDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
    backgroundColor: "#ff0000",
    marginHorizontal: 5,
  },
  text: {
    color: "#000",

  },
});