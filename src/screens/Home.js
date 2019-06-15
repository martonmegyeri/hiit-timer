import React, { useState, useEffect } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
import NavigationBar from 'react-native-navbar-color';

import colors from '../style/colors';
import Button from '../components/Button';
import Stepper from './home/Stepper';
import TimeStepper from './home/TimeStepper';
import imagePlay from '../assets/images/play.png';

const Home = ({ navigation }) => {
  const [rounds, setRounds] = useState(0);
  const [work, setWork] = useState(0);
  const [rest, setRest] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDefaults();

    NavigationBar.setColor(colors.primaryDark);
    navigation.addListener('willFocus', () => {
      NavigationBar.setColor(colors.primaryDark);
    });
  }, []);

  useEffect(() => {
    saveValues();
  }, [work, rest, rounds]);

  const loadDefaults = async () => {
    try {
      const loadedRounds = await AsyncStorage.getItem('rounds') || 3;
      setRounds(parseInt(loadedRounds, 10));
      const loadedWork = await AsyncStorage.getItem('work') || 60;
      setWork(parseInt(loadedWork, 10));
      const loadedRest = await AsyncStorage.getItem('rest') || 30;
      setRest(parseInt(loadedRest, 10));
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const saveValues = async () => {
    try {
      await AsyncStorage.setItem('rounds', rounds.toString());
      await AsyncStorage.setItem('work', work.toString());
      await AsyncStorage.setItem('rest', rest.toString());
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primaryDark}
      />
      {!loading && (
        <>
          <View style={styles.containerInner}>
            <Stepper
              value={rounds}
              setValue={setRounds}
              title="ROUNDS"
            />

            <TimeStepper
              value={work}
              setValue={setWork}
              title="WORK"
            />

            <TimeStepper
              value={rest}
              setValue={setRest}
              title="REST"
            />
          </View>
          <Button
            onPress={() => navigation.navigate('Timer', {
              rounds,
              work,
              rest
            })}
            icon={imagePlay}
            disabled={work === 0 || rounds < 1}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary
  },
  containerInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

Home.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default Home;
