import * as React from 'react'; import { Component } from 'react';
import {
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  Text,
  View
} from 'react-native';
const Actions = require('react-native-router-flux').Actions;

import {styles, colors, screenWidth, screenHeight, availableScreenHeight, topBarHeight} from '../styles'
import { Background } from '../components/Background'
import * as Swiper from 'react-native-swiper';
import { Util } from "../../util/Util";
import { TopBar } from "../components/Topbar";
import { STONE_TYPES } from "../../router/store/reducers/stones";
import { eventBus } from "../../util/EventBus";
import {TutorialSphere} from "./elements/TutorialSphere";
import {TutorialGetStarted} from "./elements/TutorialGetStarted";
import {TutorialLocalization} from "./elements/TutorialLocalization";
import {Bluenet} from "../../native/libInterface/Bluenet";
import {TutorialDevices} from "./elements/TutorialDevices";
import {TutorialBehaviour} from "./elements/TutorialBehaviour";
import {LOGi} from "../../logging/Log";


Swiper.prototype.componentWillUpdate = (nextProps, nextState) => {
  eventBus.emit("setNewSwiperIndex", nextState.index);
};

export class Tutorial extends Component<any, any> {
  unsubscribeSwipeEvent : any;
  touchEndTimeout: any;
  requestedPermission;

  constructor() {
    super();

    this.requestedPermission = false;
    this.state = {swiperIndex: 0, scrolling:false};
    this.unsubscribeSwipeEvent = eventBus.on("setNewSwiperIndex", (nextIndex) => {
      if (this.state.swiperIndex !== nextIndex) {
        this.setState({swiperIndex: nextIndex, scrolling: false});
      }
    });
  }


  componentWillUnmount() {
    this.unsubscribeSwipeEvent();
    clearTimeout(this.touchEndTimeout);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.swiperIndex === 3 && this.requestedPermission === false) {
      LOGi.info("Tutorial: Requested location permission.");
      Bluenet.requestLocationPermission();
      this.requestedPermission = true;
    }
  }


  render() {
    let checkScrolling = (newState) => {
      if (this.state.scrolling !== newState) {
        this.setState({scrolling: newState});
      }
    };

    return (
      <Background image={this.props.backgrounds.detailsDark} hideTopBar={true}>
        <TopBar title={"Welcome!"} />
        <View style={{backgroundColor:colors.csOrange.hex, height:1, width:screenWidth}} />
        <Swiper style={swiperStyles.wrapper} showsPagination={true} height={screenHeight - topBarHeight}
          dot={<View style={{backgroundColor: colors.white.rgba(0.35), width: 8, height: 8,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, borderWidth:1, borderColor: colors.black.rgba(0.1)}} />}
          activeDot={<View style={{backgroundColor: colors.white.rgba(1), width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, borderWidth:1, borderColor: colors.csOrange.rgba(1)}} />}
          loop={false}
          bounces={true}
          onScrollBeginDrag={  () => { checkScrolling(true);  }}
          onTouchEnd={() => { this.touchEndTimeout = setTimeout(() => { checkScrolling(false); }, 400);  }}
        >
          { this._getContent() }
        </Swiper>
      </Background>
    )
  }


  _getContent() {
    let content = [];

    content.push(<TutorialGetStarted key="TutorialGetStarted" />);
    content.push(<TutorialSphere key="TutorialSphere" />);
    content.push(<TutorialLocalization key="TutorialLocalization" />);
    content.push(<TutorialBehaviour key="TutorialBehaviour" state={this.props.store.getState()} />);
    content.push(<TutorialDevices key="TutorialDevices" state={this.props.store.getState()} />);

    return content;
  }
}

let swiperStyles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
});

let textColor = colors.white;
export const tutorialStyle = StyleSheet.create({
  header: {
    color: textColor.hex,
    fontSize: 25,
    fontWeight:'800'
  },
  text: {
    color: textColor.hex,
    fontSize: 16,
    textAlign:'center',
    fontWeight:'500'
  },
  subText: {
    color: textColor.rgba(0.5),
    fontSize: 13,
  },
  explanation: {
    width: screenWidth,
    color: textColor.rgba(0.5),
    fontSize: 13,
    textAlign:'center'
  }
});