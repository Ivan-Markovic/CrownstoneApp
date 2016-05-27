import React, { Component } from 'react'
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
var Actions = require('react-native-router-flux').Actions;

var Icon = require('react-native-vector-icons/Ionicons');
import { Background } from './../components/Background'
import { styles, colors } from './../styles'
import { setupStyle } from './SetupStyles'

let {width, height} = Dimensions.get("window");

export class SetupWelcome extends Component {
  constructor() {
    super();

    this.textPadding = 5;
    let totalTextHeight = 2 * 45 + 2 * this.textPadding + 27;
    let offset = height / 2 - totalTextHeight / 2;
    this.state = {
      welcome:    {x: new Animated.Value(width), y: new Animated.Value(offset)},
      to:         {x: new Animated.Value(width), y: new Animated.Value(offset + 45 + 2 * this.textPadding)},
      crownstone: {x: new Animated.Value(width), y: new Animated.Value(offset + 45 + 27 + 2*this.textPadding)},
      opacity: new Animated.Value(0)
    }
  }

  componentDidMount() {
    const {store} = this.props;
    let dt = 250;
    let start = 250;
    let welcomeTime = 1000;
    let fadeDelay = 400;
    let topOffset = 35;

    store.dispatch({type: 'APP_UPDATE', data: {doFirstTimeSetup: false}});
    setTimeout(() => {Animated.spring(this.state.welcome.x,   {toValue: 0, friction:8, tension:40}).start();},start);
    setTimeout(() => {Animated.spring(this.state.to.x,        {toValue: 0, friction:8, tension:40}).start();},start + dt);
    setTimeout(() => {Animated.spring(this.state.crownstone.x,{toValue: 0, friction:8, tension:40}).start();},start + 2*dt);
    setTimeout(() => {
      Animated.spring(this.state.welcome.y,   {toValue: topOffset, friction:8, tension:20}).start();
      Animated.spring(this.state.to.y,        {toValue: topOffset + 45 + 2 * this.textPadding, friction:8, tension:20}).start();
      Animated.spring(this.state.crownstone.y,{toValue: topOffset + 45 + 27 + 2 * this.textPadding, friction:8, tension:20}).start();
    },start + 2*dt + welcomeTime);
    setTimeout(() => {Animated.timing(this.state.opacity, {toValue: 1, duration:250}).start();},start + 2*dt + welcomeTime + fadeDelay);
  }


  render() {
    return (
      <Background hideInterface={true} background={require('../../images/setupBackground.png')}>
        <View style={styles.shadedStatusBar} />
        <Animated.Text style={[setupStyle.h0, {position:'absolute', left:this.state.welcome.x,    top:this.state.welcome.y}]}>WELCOME</Animated.Text>
        <Animated.Text style={[setupStyle.h3, {position:'absolute', left:this.state.to.x,         top:this.state.to.y, fontStyle:'italic', }]}>to</Animated.Text>
        <Animated.Text style={[setupStyle.h0, {position:'absolute', left:this.state.crownstone.x, top:this.state.crownstone.y}]}>CROWNSTONE</Animated.Text>
        <Animated.View style={{opacity:this.state.opacity, flex:1, marginTop:170, flexDirection:'column'}}>
          <View style={setupStyle.lineDistance} />
          <Text style={setupStyle.text}>Do you want to setup your own Crownstones? If you want to join an existing group, you can skip this step.</Text>
          <View style={setupStyle.lineDistance} />
          <Text style={setupStyle.text}>You can always add Crownstones, Groups and Rooms later through the settings menu.</Text>
          <View style={{flex:1}} />
          <View style={setupStyle.buttonContainer}>
            <TouchableOpacity onPress={() => {Actions.tabBar()}} >
              <View style={{paddingLeft:20, flexDirection:'row', height:30}}>
                <Icon name="ios-remove-circle-outline" size={30} color={'#fff'} style={{position:'relative', top:-2, paddingRight:8}} />
                <Text style={[setupStyle.buttonText,{fontWeight:'300'}]}>Skip</Text>
              </View>
            </TouchableOpacity>
            <View style={{flex:1}} />
            <TouchableOpacity onPress={() => {Actions.setupAddGroup()}} >
              <View style={{paddingRight:20, flexDirection:'row', height:30}}>
                <Text style={[setupStyle.buttonText]}>Start setup</Text>
                <Icon name="ios-arrow-forward" size={30} color={'#fff'} style={{position:'relative', top:-2, paddingLeft:8}} />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Background>
    )
  }
}