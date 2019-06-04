import React, { Component } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import PropTypes from 'prop-types';

import colors from '../../style/colors';

class FormattedTime extends Component {
  animatedOpacity = new Animated.Value(1);

  componentDidUpdate() {
    if (this.props.paused) {
      this.animation = Animated.loop(
        Animated.sequence([
          Animated.timing(this.animatedOpacity, {
            toValue: 0.3,
            duration: 0
          }),
          Animated.delay(500),
          Animated.timing(this.animatedOpacity, {
            toValue: 1,
            duration: 0
          }),
          Animated.delay(500)
        ])
      );
      this.animation.start();
    } else if (this.animation) {
      this.animation.stop();
      this.animatedOpacity.setValue(1);
    }
  }

  render() {
    const sec = this.props.time % 60;
    const min = Math.floor(this.props.time / 60);
    const formatted = `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;

    return (
      <View>
        <Animated.Text style={[styles.time, { opacity: this.animatedOpacity }]}>
          {formatted}
        </Animated.Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  time: {
    fontSize: 85,
    color: colors.white,
    textAlign: 'center'
  }
});

FormattedTime.propTypes = {
  time: PropTypes.number.isRequired,
  paused: PropTypes.bool
};

FormattedTime.defaultProps = {
  paused: false
};

export default FormattedTime;
