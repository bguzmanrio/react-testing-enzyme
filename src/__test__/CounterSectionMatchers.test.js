import React, { Component } from 'react';
import { shallow, mount, render } from 'enzyme';

import CounterSection from '../components/CounterSection';

let wrapper;
const basicProps = {
  color: "blue",
  title: "Testing",
  text: "This is a basic testing component!",
  isPrimary: true,
  interval: 100
};

const Content = () => <div>content</div>;

describe('Counter Section', () => {
  describe('Rendering testing', () => {
    beforeEach(() => {
      wrapper = shallow(
        <CounterSection {...basicProps} />
      );
    });
    it('Must have a Title component', () => {
      expect(wrapper.find('Title')).toBePresent();
    });
    it('Must display a Counter', () => {
      expect(wrapper.find('Counter')).toBePresent();
    });
    it('Must render the text', () => {
      expect(wrapper).toIncludeText(basicProps.text);
    });
  });

  describe('Children rendering', () => {
    beforeEach(() => {
      wrapper = mount(
        <CounterSection {...basicProps}>
          <Content />
        </CounterSection>
      );
    });
    it('Must render the children', () => {
      expect(wrapper).toContainReact(<Content />);
    });
  });

  describe('IsPrimary testing', () => {
    it('Must have the primary class', () => {
      wrapper = shallow(<CounterSection {...basicProps} />);
      expect(wrapper.find('Counter')).toHaveClassName('primary');
    });
    it('Must have the secondary class', () => {
      wrapper = shallow(<CounterSection {...basicProps} isPrimary={false}/>);
      const Counter = wrapper.find('Counter');
      expect(Counter).not.toHaveClassName('primary');
      expect(Counter).toHaveClassName('secondary');
    });
  });

  describe('Props testing', () => {
    beforeEach(() => {
      wrapper = shallow(<CounterSection {...basicProps} />);
    });

    it('Must have a Title with the color and the title text', () => {
      const Title = wrapper.find('Title');
      expect(Title).toBePresent();
      expect(Title).toHaveProp('color', basicProps.color);
      expect(Title).toHaveProp('text', basicProps.title);
    });

    it('Must have a Counter with the color and the title text', () => {
      const Counter = wrapper.find('Counter');
      expect(Counter).toBePresent();
      expect(Counter).toHaveProp('counter', wrapper.state().counter);
    });
  });

  describe('State testing', () => {
    beforeEach(() => {
      wrapper = shallow(<CounterSection {...basicProps} />);
    });

    it('Must have a stop button when is playing', () => {
      const Button = wrapper.find('button');
      expect(Button).toHaveText('Stop');
    });

    it('Must Toggle the button text when the state changes', () => {
      let Button = wrapper.find('button');
      expect(Button).toHaveText('Stop');

      wrapper.setState({isPlaying: false});

      Button = wrapper.find('button');
      expect(Button).toHaveText('Play');
    });

    it('Must have the state synchronized with the Counter component props', () => {
      const newCount = 200;

      let Counter = wrapper.find('Counter');
      expect(Counter).toBePresent();
      expect(Counter).toHaveProp('counter', wrapper.state().counter);

      wrapper.setState({counter: newCount});

      Counter = wrapper.find('Counter');
      expect(Counter).toBePresent();
      expect(Counter).toHaveProp('counter', newCount);
    });

    it('Must update the state each interval', done => {
      const nIntervals = 2;
      setTimeout(() => {
        expect(wrapper).toHaveState('counter', nIntervals);
        done();
      }, (nIntervals * basicProps.interval) + 10)
    });

    it('Must not update the state if it is not playing', () => {
      const nIntervals = 2;
      wrapper.setState({isPlaying: false});
      setTimeout(() => {
        expect(wrapper).toHaveState('counter', 0);
        done();
      }, (nIntervals * basicProps.interval) + 10)
    });
  });

  describe('Interaction testing', () => {
    beforeEach(() => {
      wrapper = shallow(<CounterSection {...basicProps} />);
    });

    it('Must toggle the state when clicking the button', () => {
      let Button = wrapper.find('button');
      expect(wrapper).toHaveState('isPlaying', true);
      expect(Button).toHaveText('Stop');

      Button.simulate('click');

      Button = wrapper.find('button');
      expect(wrapper).toHaveState('isPlaying', false);
      expect(Button).toHaveText('Play');
    });
  });

  describe('Callback testing', () => {
    let onUpdate;
    beforeEach(() => {
      onUpdate = jest.fn();
      wrapper = shallow(
        <CounterSection {...basicProps} onUpdate={onUpdate}/>
      );
    });

    it('Must call onUpdate after the button has been clicked', () => {
      expect(wrapper).toHaveState('isPlaying', true);
      wrapper.find('button').simulate('click');
      expect(wrapper).toHaveState('isPlaying', false);
      expect(onUpdate).toHaveBeenCalledWith(wrapper.state());
    });

    it('Must call the onUpdate after each interval', done => {
      const nIntervals = 1;
      setTimeout(() => {
        expect(onUpdate).toHaveBeenCalledTimes(nIntervals);
        done();
      }, (nIntervals * basicProps.interval) + 10)
    });

  });
});
