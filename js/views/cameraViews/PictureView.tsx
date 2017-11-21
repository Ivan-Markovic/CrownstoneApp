import * as React from 'react'; import { Component } from 'react';
import {
  CameraRoll,
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  View
} from 'react-native';

import { CameraKitCamera, CameraKitCameraScreen } from 'react-native-camera-kit';
const Actions = require('react-native-router-flux').Actions;
import { styles, colors, screenWidth, screenHeight } from '../styles'
import { LOG } from '../../logging/Log'
import { SessionMemory } from '../../util/SessionMemory'

export class PictureView extends Component<any, any> {
  cameraView;

  componentDidMount() {
    // should be front
    if (this.props.initialView !== 'back' && SessionMemory.cameraSide !== 'front') {
      setTimeout(() => {
        this.cameraView.camera.changeCamera();
        SessionMemory.cameraSide = 'front';
      }, 150);
    }
    // should be back
    else if (this.props.initialView === 'back' && SessionMemory.cameraSide !== 'back') {
      setTimeout(() => {
        this.cameraView.camera.changeCamera();
        SessionMemory.cameraSide = 'back';
      }, 150);
    }
  }

  onBottomButtonPressed(event) {
    if (event.type === 'left') {
      Actions.pop();
    }
    else if (event.type === 'right') {
      this.props.selectCallback(event.captureImages[0].uri);
      Actions.pop();
    }
    else {

    }
  }


  render() {
    // somehow the camera does not take full screen size.
    return (
      <View style={{flex:1, width: screenWidth, height: screenHeight}}>
        <View style={{width: screenWidth, height: 10, backgroundColor: colors.black.hex }} />
        <CameraKitCameraScreen
          ref={(cam) => this.cameraView = cam}
          cameraOptions={{
            flashMode: 'auto',
            focusMode: 'on',
            zoomMode: 'on',
            ratioOverlay:'1:1',            // optional, ratio overlay on the camera and crop the image seamlessly
            ratioOverlayColor: colors.black.rgba(0.7)
          }}
          allowCaptureRetake={true}
          actions={{
            rightButtonText: 'Done',
            leftButtonText: 'Cancel',
            leftCaptureRetakeButtonText:'Retry',
            rightCaptureRetakeButtonText:'Select'
          }}
          onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
          flashImages={{
            on: require('../../images/camera/flashOn.png'),
            off: require('../../images/camera/flashOff.png'),
            auto: require('../../images/camera/flashAuto.png')
          }}
          cameraFlipImage={require('../../images/camera/cameraFlipIcon.png')}
          captureButtonImage={require('../../images/camera/cameraButton.png')}
        />
      </View>
    );
  }
}
