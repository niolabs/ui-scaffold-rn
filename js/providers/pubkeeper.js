import React from 'react';
import { PubkeeperClient, WebSocketBrew } from '@pubkeeper/browser-client';

import config from '../config';

const PubkeeperContext = React.createContext();

export class PubkeeperProvider extends React.Component {
  componentDidMount = async () => {
    this.pkClient = await new PubkeeperClient({
      server: `${config.PK_SECURE ? 'wss' : 'ws'}://${config.PK_HOST}:${config.PK_PORT}/ws`,
      jwt: config.PK_JWT,
      brews: [new WebSocketBrew({ brewerConfig: { hostname: config.WS_HOST, port: config.WS_PORT, secure: config.WS_SECURE } })],
    }).connect();
    // TODO: This never happens... but basic websockets work. (See home.js)
    this.setState({ connected: true });
  };

  render = () => {
    const { children } = this.props;
    return (
      <PubkeeperContext.Provider value={this.pkClient}>
        {children}
      </PubkeeperContext.Provider>
    );
  };
}

export const withPubkeeper = Component => props => (
  <PubkeeperContext.Consumer>
    {pkClient => <Component {...props} pkClient={pkClient} />}
  </PubkeeperContext.Consumer>
);
