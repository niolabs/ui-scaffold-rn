import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Divider } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import AnalogClock from 'react-native-clock-analog';
import TimerMixin from 'react-timer-mixin';

import { withPubkeeper } from '../providers/pubkeeper';

class Page extends Component {
  state = { currentTime: new Date(), historicalTime: [], brewedTime: new Date(), historicalBrewedTime: [] };

  componentDidMount = () => {
    const { pkClient } = this.props;

    SplashScreen.hide();

    this.fakeTime();

    this.timer = TimerMixin.setInterval(() => this.socket.send(JSON.stringify(new Date())), 1000);

    if (pkClient) {
      pkClient.addPatron('ui_scaffold.example_brew', patron => patron.on('message', this.writeDataToState));
      pkClient.addBrewer('ui_scaffold.example_brew2', brewer => this.brewer = brewer);
      pkClient.addPatron('ui_scaffold.example_brew2', patron => patron.on('message', this.writeDataToState2));
    } else {
      console.log('no pkClient');
    }
  };

  fakeTime = () => {
    this.socket = new WebSocket('wss://echo.websocket.org/');
    this.socket.onopen = () => this.socket.send(new Date().toGMTString());
    this.socket.onmessage = ({ data }) => this.setState({ currentTime: new Date(data) });
  };

  writeDataToState = (data) => {
    const { historicalTime } = this.state;
    const json = new TextDecoder().decode(data);
    const { time } = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
    const currentTime = new Date(time);
    historicalTime.unshift(currentTime.toLocaleString());
    historicalTime.splice(6, 1);
    this.setState({ currentTime, historicalTime });
  };

  writeDataToState2 = (data) => {
    const { historicalBrewedTime } = this.state;
    const json = new TextDecoder().decode(data);
    const { newBrewedTime } = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
    const brewedTime = new Date(newBrewedTime);
    historicalBrewedTime.unshift(brewedTime.toLocaleString());
    historicalBrewedTime.splice(4, 1);
    this.setState({ brewedTime, historicalBrewedTime });
  };

  brewCurrentTimestamp = () => {
    if (this.brewer) {
      this.brewer.brewJSON([{ newBrewedTime: new Date() }]);
    }
  };

  render = () => {
    const { currentTime, historicalTime, brewedTime, historicalBrewedTime, hours, minutes } = this.state;

    return (
      <View style={styles.topRow}>
        <View>
          <Text>UI Scaffold / Pubkeeper Demo</Text>
          <Text>Sending signals to and receiving signals from nio services using the Pubkeeper javascript client.</Text>
          <Divider />
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.rowCol}>
            <Text>The Pubkeeper Provider is a HoC that uses React&apos;s Context API to:</Text>
            <Text>- Connect to the Pubkeeper Server</Text>
            <Text>- Publish the time every second to ui_scaffold.example_brew</Text>
            <Text>- Inject the connected pkClient via the withPubkeeper() method</Text>
            <Divider />
            <AnalogClock
              colorClock="#fff"
              colorNumber="#333"
              colorCenter="#dd3b4c"
              colorHour="#333"
              colorMinutes="#333"
              hour={currentTime.getHours()}
              minutes={currentTime.getMinutes()}
            />
          </View>
          <View style={styles.rowCol}>
            <Text>The left side uses the pkClient to:</Text>
            <Text>- Create a Patron of ui_scaffold.example_brew</Text>
            <Text>- Assign inbound signals on that topic to an event handler writeDataToState</Text>
            <Text>- Update the Clock and historical array based on updated local state</Text>
            <Divider />
            <ScrollView style={[styles.scrollView, { height: 160 }]}>
              {historicalTime && historicalTime.map(h => (<Text key={h}>{h}</Text>))}
            </ScrollView>
          </View>
          <View style={styles.rowCol}>
            <Text>The right side uses the pkClient to:</Text>
            <Text>- Create a new Brewer and new Patron for topic ui_scaffold.example_brew2</Text>
            <Text>- Brew the current time when you click the button</Text>
            <Text>- Assign inbound signals on that topic to an event handler writeDataToState2</Text>
            <Divider />
            <TouchableOpacity onPress={this.brewCurrentTimestamp} style={styles.brewButton}>
              <Text style={{color:'#fff'}}>Brew Current Time</Text>
            </TouchableOpacity>
            <ScrollView style={[styles.scrollView, { height: 110, marginTop: 14 }]}>
              {historicalBrewedTime && historicalBrewedTime.map((h, i) => (<Text key={i}>{h}</Text>))}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  };
}


const styles = StyleSheet.create({
  topRow: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
  },
  bottomRow: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  rowCol: {
    flex: .3,
  },
  scrollView: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e6e9ee',
    borderRadius: 4,
    padding: 10,
  },
  brewButton: {
    padding: 3,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#403b8a',
    height: 20,
    borderRadius: 10,
  },
});

export default withPubkeeper(Page);
