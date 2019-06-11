import React, { useRef } from 'react';
import { View, Image, TouchableWithoutFeedback, StyleSheet, Animated } from 'react-native';
import PropTypes from 'prop-types';

import colors from '../../../style/colors';

const Button = ({ icon, onPress, onPressIn, onPressOut }) => {
  const animatedColor = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    onPressIn();
    Animated.timing(animatedColor, {
      toValue: 1,
      duration: 200
    }).start();
  };

  const handlePressOut = () => {
    onPressOut();
    Animated.timing(animatedColor, {
      toValue: 0,
      duration: 200
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[styles.buttonContainer, {
          backgroundColor: animatedColor.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.2)']
          })
        }]}
      >
        <Animated.View
          style={[styles.button, {
            backgroundColor: animatedColor.interpolate({
              inputRange: [0, 1],
              outputRange: [colors.white, colors.primaryLight]
            }),
            elevation: animatedColor.interpolate({
              inputRange: [0, 1],
              outputRange: [5, 2]
            })
          }]}
        >
          <Image source={icon} style={styles.buttonIcon} />
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: colors.white
  },
  buttonIcon: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
    tintColor: colors.primaryDark
  }
});

Button.propTypes = {
  icon: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  onPressIn: PropTypes.func.isRequired,
  onPressOut: PropTypes.func.isRequired
};

export default Button;
