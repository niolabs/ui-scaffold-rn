import React, {Component} from 'react';

import AppContainer from './js/nav';
import { PubkeeperProvider } from './js/providers/pubkeeper';

export default class App extends Component {
  render = () => <PubkeeperProvider><AppContainer /></PubkeeperProvider>;
}
