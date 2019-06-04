import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import colors from '../../style/colors';
import imagePositive from '../../assets/images/positive.png';
import imageNegative from '../../assets/images/negative.png';
import Button from './stepper/Button';

class TimeStepper extends Component {
  constructor(props) {
    super(props);

    this.intervalCounter = 0;
    this.intervalMilliseconds = 200;
    this.rawMinutes = Math.floor(props.value / 60);
    this.rawSeconds = props.value % 60;
    this.state = {
      minutes: this.rawMinutes < 10 ? `0${this.rawMinutes}` : this.rawMinutes.toString(),
      seconds: this.rawSeconds < 10 ? `0${this.rawSeconds}` : this.rawSeconds.toString()
    };
  }

  incrementTime = (incrementValue) => {
    const parsedMinutes = parseInt(this.state.minutes, 10) ? parseInt(this.state.minutes, 10) : 0;
    const parsedSeconds = parseInt(this.state.seconds, 10) ? parseInt(this.state.seconds, 10) : 0;
    let all = (parsedMinutes * 60 + parsedSeconds);

    if (all < 5999) all += incrementValue;
    if (all < 0) return;

    const newMinutes = Math.floor(all / 60);
    const newSeconds = all % 60;

    this.setState({
      minutes: newMinutes < 10 ? `0${newMinutes}` : newMinutes.toString(),
      seconds: newSeconds < 10 ? `0${newSeconds}` : newSeconds.toString()
    }, () => this.props.setValue(all));
  };

  increasePress = () => {
    this.pressInterval = setInterval(() => {
      this.incrementTime(1);
      this.intervalCounter++;
      if (this.intervalCounter >= 5 && this.intervalCounter < 15) {
        clearInterval(this.pressInterval);
        this.intervalMilliseconds = 75;
        this.increasePress();
      } else if (this.intervalCounter >= 15) {
        clearInterval(this.pressInterval);
        this.intervalMilliseconds = 25;
        this.increasePress();
      }
    }, this.intervalMilliseconds);
  }

  decreasePress = () => {
    this.pressInterval = setInterval(() => {
      this.incrementTime(-1);
      this.intervalCounter++;
      if (this.intervalCounter >= 5 && this.intervalCounter < 15) {
        clearInterval(this.pressInterval);
        this.intervalMilliseconds = 75;
        this.decreasePress();
      } else if (this.intervalCounter >= 15) {
        clearInterval(this.pressInterval);
        this.intervalMilliseconds = 25;
        this.decreasePress();
      }
    }, this.intervalMilliseconds);
  }

  onPressOut = () => {
    clearInterval(this.pressInterval);
    this.intervalCounter = 0;
    this.intervalMilliseconds = 200;
  }

  onChangeMinutes = text => {
    if (this.containsNotAllowedChars(text)) return;
    const parsedMinutes = parseInt(text, 10) ? parseInt(text, 10) : 0;
    this.setState({ minutes: text });
    this.props.setValue(parsedMinutes * 60 + parseInt(this.state.seconds, 10));
  };

  onChangeSeconds = text => {
    if (this.containsNotAllowedChars(text)) return;
    const parsedSeconds = parseInt(text, 10) ? parseInt(text, 10) : 0;
    if (parsedSeconds > 60) return;

    this.setState({
      seconds: text
    });
    this.props.setValue(parseInt(this.state.minutes, 10) * 60 + parsedSeconds);
  };

  onSubmitEditingMinutes = () => {
    const parsedMinutes = parseInt(this.state.minutes, 10);
    if (parsedMinutes) {
      if (parsedMinutes < 10) this.setState({ minutes: `0${parsedMinutes}` });
    } else {
      this.setState({ minutes: '00' });
    }
  };

  onSubmitEditingSeconds = () => {
    const parsedSeconds = parseInt(this.state.seconds, 10);
    if (parsedSeconds) {
      if (parsedSeconds < 10) this.setState({ seconds: `0${parsedSeconds}` });
    } else {
      this.setState({ seconds: '00' });
    }
  };

  containsNotAllowedChars = (text) => {
    const notAllowed = [',', '.', '-', ' '];
    return notAllowed.some(item => text.includes(item));
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerInner}>
          <Text style={styles.title}>{this.props.title}</Text>
        </View>
        <View style={styles.containerInner}>
          <View style={styles.buttonContainer}>
            <Button
              icon={imageNegative}
              onPress={() => this.incrementTime(-1)}
              onPressIn={this.decreasePress}
              onPressOut={this.onPressOut}
            />
          </View>
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <TextInput
                value={this.state.minutes}
                onChangeText={(text) => this.onChangeMinutes(text)}
                onSubmitEditing={this.onSubmitEditingMinutes}
                selectionColor={colors.primary}
                keyboardType="numeric"
                maxLength={2}
                style={styles.text}
              />
              <Text style={styles.textDoubleDot}>:</Text>
              <TextInput
                value={this.state.seconds}
                onChangeText={(text) => this.onChangeSeconds(text)}
                onSubmitEditing={this.onSubmitEditingSeconds}
                selectionColor={colors.primary}
                keyboardType="numeric"
                maxLength={2}
                style={styles.text}
              />
            </View>
          </View>
          <Button
            icon={imagePositive}
            onPress={() => this.incrementTime(1)}
            onPressIn={this.increasePress}
            onPressOut={this.onPressOut}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 230,
    marginVertical: 5
  },
  containerInner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.white,
    opacity: 0.5
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textDoubleDot: {
    height: 40,
    color: colors.white,
    fontSize: 24
  },
  text: {
    height: 50,
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center'
  },
  buttonContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: colors.primary,
    elevation: 5
  },
  buttonIcon: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain'
  }
});

TimeStepper.propTypes = {
  value: PropTypes.number.isRequired,
  setValue: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default TimeStepper;
