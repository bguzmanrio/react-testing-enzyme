import React from 'react';
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
      expect(wrapper.find('Title').exists()).toEqual(true);
    });
    it('Must display a Counter', () => {
      expect(wrapper.find('Counter').exists()).toEqual(true);
    });
    it('Must render the text', () => {
      expect(wrapper.text().includes(basicProps.text)).toEqual(true);
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
      expect(wrapper.contains(Content)).toEqual(true);
    });
  });

  describe('IsPrimary testing', () => {
    it('Must have the primary class', () => {
      wrapper = shallow(<CounterSection {...basicProps} />);
      const Counter = wrapper.find('Counter');
      expect(Counter.hasClass('primary')).toEqual(true);
    });
    it('Must have the secondary class', () => {
      wrapper = shallow(<CounterSection {...basicProps} isPrimary={false}/>);
      const Counter = wrapper.find('Counter');
      expect(Counter.hasClass('primary')).toEqual(false);
      expect(Counter.hasClass('secondary')).toEqual(true);
    });
  });

  describe('Props testing', () => {
    beforeEach(() => {
      wrapper = shallow(<CounterSection {...basicProps} />);
    });

    it('Must have a Title with the color and the title text', () => {
      const Title = wrapper.find('Title');
      expect(Title.exists()).toEqual(true);
      expect(Title.prop('color')).toEqual(basicProps.color);
      expect(Title.prop('text')).toEqual(basicProps.title);
    });

    it('Must have a Counter with the color and the title text', () => {
      const Counter = wrapper.find('Counter');
      expect(Counter.exists()).toEqual(true);
      expect(Counter.prop('counter')).toEqual(wrapper.state().counter);
    });
  });

  describe('State testing', () => {
    beforeEach(() => {
      wrapper = shallow(<CounterSection {...basicProps} />);
    });

    it('Must have a stop button when is playing', () => {
      const Button = wrapper.find('button');
      expect(Button.text()).toEqual('Stop');
    });

    it('Must Toggle the button text when the state changes', () => {
      let Button = wrapper.find('button');
      expect(Button.text()).toEqual('Stop');

      wrapper.setState({isPlaying: false});

      Button = wrapper.find('button');
      expect(Button.text()).toEqual('Play');
    });

    it('Must have the state synchronized with the Counter component props', () => {
      const newCount = 200;

      let Counter = wrapper.find('Counter');
      expect(Counter.exists()).toEqual(true);
      expect(Counter.prop('counter')).toEqual(wrapper.state().counter);

      wrapper.setState({counter: newCount});

      Counter = wrapper.find('Counter');
      expect(Counter.exists()).toEqual(true);
      expect(Counter.prop('counter')).toEqual(newCount);
    });

    it('Must update the state each interval', done => {
      const nIntervals = 2;
      setTimeout(() => {
        expect(wrapper.state().counter).toEqual(nIntervals);
        done();
      }, (nIntervals * basicProps.interval) + 10)
    });

    it('Must not update the state if it is not playing', () => {
      const nIntervals = 2;
      wrapper.setState({isPlaying: false});
      setTimeout(() => {
        expect(wrapper.state().counter).toEqual(0);
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
      expect(wrapper.state().isPlaying).toEqual(true);
      expect(Button.text()).toEqual('Stop');

      Button.simulate('click');

      Button = wrapper.find('button');
      expect(wrapper.state().isPlaying).toEqual(false);
      expect(Button.text()).toEqual('Play');
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
      expect(wrapper.state().isPlaying).toEqual(true);
      wrapper.find('button').simulate('click');
      expect(wrapper.state().isPlaying).toEqual(false);
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
