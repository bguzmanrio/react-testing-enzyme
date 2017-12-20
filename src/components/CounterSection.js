import React, { Component } from 'react';

import Title from './Title';
import Counter from './Counter';

import './counterSection.css';

class CounterSection extends Component {
  static defaultProps = {
    interval: 1000
  };

  state = {
    counter: 0,
    isPlaying: true
  };

  updateState = (newState) => {
    this.setState(newState, () => {
      this.props.onUpdate && this.props.onUpdate(this.state);
    });
  };

  togglePlay = () => {
    this.updateState({
      isPlaying: !this.state.isPlaying
    });
  };

  componentDidMount = () => {
    this.interval = setInterval(() => {
      this.state.isPlaying && this.updateState({
        counter: this.state.counter + 1
      });
    }, this.props.interval);
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
    this.interval = null;
  };

  render() {
    const classNameToUse = this.props.isPrimary ? 'primary' : 'secondary';
    const { counter, isPlaying } = this.state;
    return (
      <section className="counter-section">
        <Title color={this.props.color} text={this.props.title} />
        {this.props.text}
        <Counter counter={counter} className={classNameToUse}/>
        {this.props.children && (
          <div>{this.props.children}</div>
        )}
        <button onClick={this.togglePlay}>{isPlaying ? 'Stop' : 'Play'}</button>
      </section>
    )
  }
}

export default CounterSection;
