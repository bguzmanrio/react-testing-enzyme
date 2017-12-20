import React from 'react';

const Counter = props => (
  <div className={`counter ${props.className}`}>{props.counter} seconds</div>
);

export default Counter;
