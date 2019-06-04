import React, { useState, useRef, useEffect } from 'react';
import { View, Image, TouchableWithoutFeedback, StyleSheet, Animated } from 'react-native';
import PropTypes from 'prop-types';

import colors from '../style/colors';
import usePrevious from '../util/usePrevious';

const Button = ({ onPress, disabled, icon, iconTintColor, backgroundColor, pressedBackgroundColor }) => {
  const animatedColor = useRef(new Animated.Value(0)).current;
  const animatedScale = useRef(new Animated.Value(1)).current;
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const [iconNum, setIconNum] = useState(icon);
  const prevIcon = usePrevious(icon);

  useEffect(() => {
    if (prevIcon && icon !== prevIcon) {
      Animated.parallel([
        Animated.timing(animatedScale, {
          toValue: 0.75,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true
        })
      ]).start(() => {
        setIconNum(icon);
        Animated.parallel([
          Animated.timing(animatedScale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true
          }),
          Animated.timing(animatedOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true
          })
        ]).start();
      });
    }
  }, [icon]);

  const handlePressIn = () => {
    Animated.timing(animatedColor, {
      toValue: 1,
      duration: 200
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animatedColor, {
      toValue: 0,
      duration: 200
    }).start();
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled}
      >
        <Animated.View
          style={[styles.button, {
            backgroundColor: animatedColor.interpolate({
              inputRange: [0, 1],
              outputRange: disabled
                ? [pressedBackgroundColor, pressedBackgroundColor]
                : [backgroundColor, pressedBackgroundColor]
            }),
            elevation: animatedColor.interpolate({
              inputRange: [0, 1],
              outputRange: [5, 2]
            })
          }]}
        >
          <Animated.View
            style={[styles.buttonIconContainer, {
              color: disabled ? colors.accentLight : colors.white,
              opacity: animatedOpacity,
              transform: [{ scale: animatedScale }]
            }]}
          >
            <Image
              source={iconNum}
              style={[styles.buttonIcon, {
                tintColor: iconTintColor
              }]}
            />
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 50
  },
  button: {
    backgroundColor: colors.primary,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    elevation: 5
  },
  buttonIconContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonIcon: {
    width: '55%',
    height: '55%',
    resizeMode: 'contain'
  }
});

Button.propTypes = {
  onPress: PropTypes.func,
  icon: PropTypes.number.isRequired,
  iconTintColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  pressedBackgroundColor: PropTypes.string,
  disabled: PropTypes.bool
};

Button.defaultProps = {
  onPress: null,
  iconTintColor: colors.primary,
  backgroundColor: colors.white,
  pressedBackgroundColor: colors.primaryLight,
  disabled: false
};

export default Button;
