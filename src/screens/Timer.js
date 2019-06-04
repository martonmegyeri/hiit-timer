import React, { Component } from 'react';
import { View, Text, Alert, StatusBar, Animated, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Sound from 'react-native-sound';
import BackgroundTimer from 'react-native-background-timer';
import NavigationBar from 'react-native-navbar-color';

import colors from '../style/colors';
import LoaderBar from './timer/LoaderBar';
import FormattedTime from './timer/FormattedTime';
import Button from '../components/Button';
import beepSound from '../assets/audio/beep.mp3';
import beepLongSound from '../assets/audio/beep-long.mp3';
import imagePlay from '../assets/images/play.png';
import imagePause from '../assets/images/pause.png';
import imageClose from '../assets/images/close.png';

class Timer extends Component {
  constructor(props) {
    super(props);

    Sound.setCategory('Playback');
    this.beep = this.readAudio(beepSound);
    this.beepLong = this.readAudio(beepLongSound);
    this.nextAt = 0;
    this.delay = 0;
    this.rounds = props.navigation.getParam('rounds');
    this.preparationInterval = 6;
    this.workInterval = props.navigation.getParam('work');
    this.restInterval = props.navigation.getParam('rest');
    this.animatedColor = new Animated.Value(0);

    this.state = {
      timer: this.preparationInterval,
      isPaused: false,
      isWork: false,
      isRest: false,
      round: 0,
      remainingWorkRounds: this.rounds
    };
  }

  componentDidMount() {
    this.tick();
    NavigationBar.setColor(colors.yellowDark);
  }

  componentWillUnmount() {
    this.setState({ isPaused: true });
  }

  tick = () => {
    // If timer is paused, return
    if (this.state.isPaused) return;

    // If timer was paused, then delay the next tick with the previous tick's remaining time
    BackgroundTimer.setTimeout(() => {
      if (!this.nextAt) {
        this.nextAt = new Date().getTime();
      }

      this.nextAt += 1000;
      this.delay = 0;

      this.setState(state => {
        // If the current round is ended
        if (state.timer === 1) {
          let newTimer = 0;
          let isWork = false;
          let isRest = false;
          const newRound = state.round + 1;
          let newRemainingWorkRounds = state.remainingWorkRounds;

          // If new round is rest
          // and rest round's interval is bigger than zero (there is rest round),
          if (newRound % 2 === 0 && this.restInterval > 0) {
            newTimer = this.restInterval;
            isRest = true;
            // If new round is rest, then the current work round is completed so
            // decrement the remaining work round's counter
            newRemainingWorkRounds--;
            // Animate background color
            Animated.timing(this.animatedColor, {
              toValue: 1,
              duration: 200
            }).start();
            NavigationBar.setColor(colors.primaryDark);
          } else {
            // If new round is work
            newTimer = this.workInterval;
            isWork = true;
            // If round not the 0th one (it's the first 5 seconds when the timer starts),
            // and rest round's interval is zero (there is NO rest round),
            // decrement the work round's counter before every new round
            if (state.round !== 0 && this.restInterval === 0) newRemainingWorkRounds--;
            // Animate background color
            Animated.timing(this.animatedColor, {
              toValue: 2,
              duration: 200
            }).start();
            NavigationBar.setColor(colors.accentDark);
          }

          // Return the new state
          return {
            timer: newTimer,
            round: newRound,
            isWork,
            isRest,
            remainingWorkRounds: newRemainingWorkRounds
          };
        } else { // if the corrent round is not ended yet then just increment the counter
          return { timer: state.timer - 1 };
        }
      }, () => {
        // After state is set
        if (this.state.timer <= 3) {
          if (this.state.remainingWorkRounds > 0) { // If whole timer is not ended yet
            this.playBeep();
          } else { // If timer is ended play 'beep' sound three times
            this.playBeep(false, () => {
              this.playBeep(false, () => {
                this.playBeep();
              });
            });
          }
        } else if (this.state.isRest && this.state.timer === this.restInterval) {
          if (this.state.remainingWorkRounds > 0) { // If whole timer is not ended yet
            // If work round is ended play 'long beep' sound
            this.playBeep(true);
          } else { // If timer is ended play 'beep' sound three times
            this.playBeep(false, () => {
              this.playBeep(false, () => {
                this.playBeep();
              });
            });
          }
        } else if (this.state.isWork && this.state.timer === this.workInterval) {
          // If rest round is ended play 'long beep' sound
          this.playBeep(true);
        }

        // If there is remaining work round, call this whole 'tick' function again
        if (this.state.remainingWorkRounds > 0) {
          BackgroundTimer.setTimeout(() => {
            this.tick();
          }, this.nextAt - new Date().getTime());
        }
      });
    }, this.delay);
  }

  pauseTimer = () => {
    const that = this;
    if (this.state.isPaused) {
      this.setState({ isPaused: false }, () => {
        that.nextAt = 0;
        that.tick();
      });
    } else {
      this.setState({ isPaused: true });
      this.delay = this.nextAt - new Date().getTime();
    }
    this.beepLong.play((success) => {
      if (!success) {
        this.showAlert('Playback failed due to audio decoding errors');
      }
    });
  };

  playBeep = (long = false, callback) => {
    let whatToPlay = this.beep;
    if (long) whatToPlay = this.beepLong;
    whatToPlay.play((success) => {
      if (!success) {
        this.showAlert('Playback failed due to audio decoding errors');
        this.pauseTimer();
      }
      if (callback) callback();
    });
  };

  readAudio = (file) => {
    return new Sound(file, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        this.showAlert('Failed to load the sound');
      }
    });
  };

  showAlert = (message) => {
    Alert.alert(
      'Error',
      message,
      [{ text: 'OK', onPress: () => this.props.navigation.navigate('Home') }],
      { cancelable: false },
    );
  };

  render() {
    let colorScheme = 'yellow';
    if (this.state.isWork) colorScheme = 'accent';
    if (this.state.isRest) colorScheme = 'primary';

    let workOrRestText = 'GET READY';
    if (this.state.isWork) workOrRestText = 'WORK';
    else if (this.state.isRest) workOrRestText = 'REST';

    const onButtonPress = this.state.remainingWorkRounds > 0
      ? this.pauseTimer
      : () => this.props.navigation.navigate('Home');
    let buttonIcon = imagePause;
    if (this.state.isPaused) buttonIcon = imagePlay;
    else if (!this.state.isPaused && this.state.remainingWorkRounds === 0) buttonIcon = imageClose;

    return (
      <Animated.View
        style={[styles.container, {
          backgroundColor: this.animatedColor.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [colors.yellow, colors.primary, colors.accent]
          })
        }]}
      >
        <StatusBar
          barStyle="light-content"
          animated
          backgroundColor={colors[`${colorScheme}Dark`]}
        />

        <View style={styles.content}>
          {this.state.remainingWorkRounds > 0 ? (
            <View>
              <Text style={styles.round}>{this.state.remainingWorkRounds}</Text>
              <View>
                <FormattedTime time={this.state.timer} paused={this.state.isPaused} />
                <LoaderBar
                  isWork={this.state.isWork}
                  isRest={this.state.isRest}
                  isPaused={this.state.isPaused}
                  preparationInterval={this.preparationInterval - 1}
                  workInterval={this.workInterval}
                  restInterval={this.restInterval}
                />
              </View>
              <Text style={styles.roundTitle}>{workOrRestText}</Text>
            </View>
          ) : (
            <Text style={styles.endedText}>GREAT WORK!</Text>
          )}
        </View>

        <Button
          onPress={onButtonPress}
          icon={buttonIcon}
          iconTintColor={colors[colorScheme]}
          backgroundColor={colors.white}
          pressedBackgroundColor={colors[`${colorScheme}Light`]}
        />

      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  round: {
    fontSize: 35,
    color: colors.white,
    opacity: 0.3,
    textAlign: 'center',
    fontWeight: '700'
  },
  roundTitle: {
    fontSize: 35,
    color: colors.white,
    opacity: 0.3,
    textAlign: 'center',
    fontWeight: '700'
  },
  endedText: {
    fontSize: 35,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '700'
  }
});

Timer.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default Timer;
