import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Icon } from 'react-native-elements';

import Home from './screens/home';

const navIcon = (focused, name) => (<Icon name={name} type="material" color={focused ? '#fff' : '#9C82E0'} />);

const TabNavigator = createMaterialBottomTabNavigator({
  Home: { screen: Home, navigationOptions: { tabBarLabel: 'Home', tabBarIcon: ({ focused }) => navIcon(focused, 'home') }},
}, {
  initialRouteName: 'Home',
  activeColor: '#fff',
  inactiveColor: '#ccc',
  barStyle: { backgroundColor: '#3cafda' },
});

export default createAppContainer(TabNavigator);
