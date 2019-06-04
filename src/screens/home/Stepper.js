import React, { Component } from 'react';
import { View, Text, TextInput, Image, TouchableNativeFeedback, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import colors from '../../style/colors';
import imagePositive from '../../assets/images/positive.png';
import imageNegative from '../../assets/images/negative.png';
import Button from './stepper/Button';

class Stepper extends Component {
  intervalCounter = 0;
  intervalMilliseconds = 200;

  increase= () => {
    if (this.props.value >= 100) return;
    this.props.setValue(this.props.value + 1);
  }

  increasePress = () => {
    this.pressInterval = setInterval(() => {
      this.increase();
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

  decrease = () => {
    if (this.props.value <= 1) return;
    this.props.setValue(this.props.value - 1);
  }

  decreasePress = () => {
    this.pressInterval = setInterval(() => {
      this.decrease();
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

  setTextValue = (text) => {
    if (parseInt(text, 10) > 100) this.props.setValue(100);
    else this.props.setValue(parseInt(text, 10));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerInner}>
          <Text style={styles.title}>{this.props.title}</Text>
        </View>
        <View style={styles.containerInner}>
          <Button
            icon={imageNegative}
            onPress={this.decrease}
            onPressIn={this.decreasePress}
            onPressOut={this.onPressOut}
          />
          <View style={styles.content}>
            <TextInput
              onChangeText={(text) => this.setTextValue(text)}
              value={this.props.value ? this.props.value.toString() : ''}
              style={styles.text}
              selectionColor={colors.primary}
              keyboardType="numeric"
            />
          </View>
          <Button
            icon={imagePositive}
            onPress={this.increase}
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
  text: {
    height: 50,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.white
  }
});

Stepper.propTypes = {
  value: PropTypes.number.isRequired,
  setValue: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default Stepper;
