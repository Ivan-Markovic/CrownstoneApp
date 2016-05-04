import React, {
  Component,
  CameraRoll,
  Dimensions,
  Image,
  PixelRatio,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  View
} from 'react-native';

import { Processing } from '../components/Processing';
import { TopBar } from '../components/Topbar';
import Camera from 'react-native-camera';
var Icon = require('react-native-vector-icons/Ionicons');
var Actions = require('react-native-router-flux').Actions;
import { styles, colors} from '../styles'


export class PictureView extends Component {
  constructor(props) {
    super();
    this.state = {
      camera: Camera.constants.Type.back,
      flash:Camera.constants.FlashMode.auto,
      pictureTaken: false
    }
  }

  takePicture() {
    this.camera.capture()
      .then((data) => {Actions.pop(); Actions.picturePreview({image:data, selectCallback:this.props.selectCallback})})
      .catch(err => console.error(err));
    this.setState({ pictureTaken: true });
  }

  switchCamera() {
    if (this.state.camera === Camera.constants.Type.front) {
      this.setState({camera: Camera.constants.Type.back})
    }
    else {
      this.setState({camera: Camera.constants.Type.front})
    }
  }

  toggleFlash() {
    if (this.state.flash === Camera.constants.FlashMode.on) {
      this.setState({flash: Camera.constants.FlashMode.off})
    }
    else if (this.state.flash === Camera.constants.FlashMode.off) {
      this.setState({flash: Camera.constants.FlashMode.auto})
    }
    else {
      this.setState({flash: Camera.constants.FlashMode.on})
    }
  }

  getFlashState() {
    if (this.state.camera === Camera.constants.Type.front) {
      return "Front camera has no flash"
    }
    else if (this.state.flash === Camera.constants.FlashMode.on) {
      return "on";
    }
    else if (this.state.flash === Camera.constants.FlashMode.auto) {
      return "auto";
    }
    else {
      return "off";
    }
  }


  render() {
    return (
      <View style={{flex:1}}>
        <TopBar title="Take A Picture" left="Cancel" leftAction={Actions.pop} notBack={true} />
        <Camera
          ref={(cam) => {this.camera = cam;}}
          type={this.state.camera}
          style={cameraStyle.preview}
          captureAudio={false}
          flashMode={this.state.flash}
          aspect={Camera.constants.Aspect.fill}>
          <TouchableOpacity onPress={this.toggleFlash.bind(this)} style={{position:'absolute',top:20,left:20}}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={cameraStyle.button}>
              <Icon name={'ios-bolt'} size={38} color={'white'} style={cameraStyle.buttonIcon}/>
            </View>
            <Text style={{backgroundColor:'transparent', padding:4, color:'#ffff00'}}>{this.getFlashState()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.switchCamera.bind(this)} style={[cameraStyle.button,{position:'absolute',top:20,right:20}]} >
            <Icon name={'ios-reverse-camera'} size={38} color={'white'} style={cameraStyle.buttonIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={[cameraStyle.snapButton,{bottom:20}]}>
            <Icon name={'ios-camera'} size={50} color={'white'} style={cameraStyle.buttonIcon} />
          </TouchableOpacity>
        </Camera>
        <Processing visible={this.state.pictureTaken}>
          <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text style={styles.menuText}>Processing</Text>
          </View>
        </Processing>
      </View>
    );
  }
}

const cameraStyle = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  button:{
    width:46,
    height:46,
    backgroundColor:'rgba(0,0,0,0.3)',
    borderRadius:23,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:2,
    borderColor:'white'
  },
  buttonIcon:{
    backgroundColor:'transparent',
    position:'relative',
    top:1
  },
  snapButton:{
    width:60,
    height:60,
    backgroundColor:'rgba(0,0,0,0.3)',
    borderRadius:30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:2,
    borderColor:'white'
  },
});