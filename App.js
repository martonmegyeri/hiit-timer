import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

// Screens
import HomeScreen from './src/screens/Home';
import TimerScreen from './src/screens/Timer';

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Timer: {
      screen: TimerScreen
    }
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      header: null
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);

const App = () => (
  <AppContainer />
);

export default App;
