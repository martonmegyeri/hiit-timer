import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import PropTypes from 'prop-types';

import colors from '../../style/colors';

class LoaderBar extends Component {
  constructor() {
    super();

    this.state = {
      percentage: 0
    };
    this.animatedScale = new Animated.Value(0);
    this.animatedScale.addListener(({ value }) => {
      this.setState({ percentage: Math.round(value * 100) });
    });
  }

  componentDidMount() {
    this.playAnimation(this.props.preparationInterval);
  }

  componentDidUpdate(prevProps) {
    const { isWork, isRest, isPaused, workInterval, restInterval } = this.props;
    const { percentage } = this.state;

    if (prevProps.isWork !== isWork || prevProps.isRest !== isRest) {
      const duration = isWork ? workInterval : restInterval;
      this.playAnimation(duration);
    }

    if (prevProps.isPaused !== isPaused) {
      if (isPaused) {
        /* this.animatedScale.stopAnimation(value => {
          this.animatedScale.setValue(value);
          console.log(value);
        }); */
        this.animatedScale.setValue(percentage / 100);
      } else {
        const duration = isWork ? workInterval : restInterval;
        this.playAnimation(duration - (duration * (percentage / 100)));
      }
    }
  }

  componentWillUnmount() {
    this.animatedScale.removeAllListeners();
  }

  playAnimation = (duration) => {
    Animated.timing(this.animatedScale, {
      toValue: 1,
      duration: duration * 1000,
      easing: Easing.linear
    }).start(() => {
      Animated.timing(this.animatedScale, {
        toValue: 0,
        duration: 0
      }).start();
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.bar}>
          <Animated.View
            style={[styles.loader, {
              width: this.animatedScale.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              })
            }]}
          />
        </View>
        <View style={styles.data}>
          <Text style={styles.dataText}>PROGRESS</Text>
          <Text style={styles.dataText}>{this.state.percentage}%</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20
  },
  bar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
    height: 4
  },
  loader: {
    backgroundColor: colors.white,
    height: '100%'
  },
  data: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dataText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    opacity: 0.3
  }
});

LoaderBar.propTypes = {
  isWork: PropTypes.bool.isRequired,
  isRest: PropTypes.bool.isRequired,
  isPaused: PropTypes.bool.isRequired,
  preparationInterval: PropTypes.number.isRequired,
  workInterval: PropTypes.number.isRequired,
  restInterval: PropTypes.number.isRequired
};

export default LoaderBar;
