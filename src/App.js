import React, { Component } from 'react';
import CounterSection from './components/CounterSection';

import './base.css';

class App extends Component {
  render() {
    return (
      <div>
        <h2>Basic Testing</h2>
        <CounterSection
          color="blue"
          title="Testing"
          text="This is a basic testing component!"
          isPrimary
        />
        <CounterSection
          title="Testing"
          text="This is a basic testing component!"
        >
          <div>Counter children!</div>
        </CounterSection>
      </div>
    );
  }
}

export default App;
