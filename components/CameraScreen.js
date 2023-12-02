import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  SafeAreaView,
  Share,
  Image,
  Pressable,
} from "react-native";
import { Camera } from "expo-camera";
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 

import * as ImageManipulator from 'expo-image-manipulator';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';

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

  const renderCaptureControl = () => (
    <View style={styles.control}>
      <Pressable disabled={!isCameraReady} onPress={switchCamera} style={styles.flipCamera}>
          <MaterialIcons name="flip-camera-ios" size={24} color="white" />
      </Pressable>
      <Pressable
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
    <Pressable onPress={cancelPreview} style={styles.closeButton}>
      <View style={[styles.closeCross, { transform: [{ rotate: "45deg" }] }]} />
      <View
        style={[styles.closeCross, { transform: [{ rotate: "-45deg" }] }]}
      />
    </Pressable>
  );

  const renderCropButton = () => (
    <Pressable
      onPress={() => cropPicture()}
      style={styles.cropButton}
    >
      <Feather name="crop" size={24} color="black" />
    </Pressable>
  );
  
  const renderShareButton = () => (
    <Pressable 
      onPress={() => shareImage()}
      style={styles.shareButton}
    >
      <Feather name="share" size={24} color="black" />
    </Pressable>
  );

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 1, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.uri;
  
      if (source) {
        await cameraRef.current.pausePreview();
        setIsPreview(true);
        try {
          setCapturedImage(source);
        } catch (error) {
          console.error('Error cropping image:', error);
        }
      }
    }
  };

  // problem with cropPicture here - Error cropping image: [TypeError: The "uri" argument must be a string]
  const cropPicture = async ({imageUri, cropData}) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        capturedImage,
        [{ crop: cropData }], // Specify the cropping data
        { compress: 1, format: ImageManipulator.SaveFormat.PNG } // You can choose the format you prefer
      );
      // `manipulatedImage.uri` now contains the cropped image URI
      return manipulatedImage.uri;
    } catch (error) {
      console.error('Error cropping image:', error);
      console.log('error in imageUri', imageUri)
    }
  };

  const shareImage = async () => {
    try {
      if (!capturedImage) {
        alert('No captured image');
        return;
      }
  
      // Share the image to Facebook
      const result = await Share.shareAsync({
        url: capturedImage,
        title: 'Pic to PDF',
        mimeType: 'image/jpeg', // Adjust the mimeType based on your image type
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
  
      // Reset capturedImage state after sharing
      setCapturedImage(null);
    } catch (error) {
      alert(error.message);
    }
  };
  

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

      {isPreview ? (
      <Image source={{ uri: isPreview.uri }} style={styles.media} />
        ) : (
        !isPreview && renderCaptureControl()
      )}
      <View style={styles.buttonContainer}>
        {isPreview && renderCropButton()}
        {isPreview && renderShareButton()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    margin: 16,
  },
  cropButton: {
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
    backgroundColor: 'cyan',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
    backgroundColor: 'lime',
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
    borderRadius: Math.floor(captureSize / 2),
    width: captureSize,
    height: captureSize,
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
  },
  flipCamera: {
    alignSelf: "left",
    position: "absolute",
    left: 50, // Adjust this value to control the distance from the left
    bottom: 30, // Adjust this value to control the distance from the bottom
    padding: 10,
    borderWidth: 2,
    borderColor: "white", // Change this to your desired border color
    borderRadius: Math.floor(captureSize / 2),
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