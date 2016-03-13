import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

import { click } from '../../actions';
import { Motion, spring } from 'react-motion';

import s from './App.scss';

import * as objects from '../../constants/Objects';

class Rock extends Component {

  static propTypes = {
    click: PropTypes.func.isRequired,
    smashClicks: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      x: 0,
    }
  }

  getStyles() {
    return {
      x: spring(this.state.x, { stifness: 300, damping: 2 }),
    };
  }

  click() {
    this.setState({ x: 50 });
    setTimeout(() => {
      this.setState({ x: 0 });
    }, 100);
    this.props.click({ object: objects.ROCK });
  }

  render() {
    const { smashClicks } = this.props;

    return (
      <Motion style = { this.getStyles() }>
        {({ x }) =>
          <div
            className={
              classNames({
                [s.rock]: true,
                [s[`clicked-${smashClicks}`]]: true,
              })
            }
            style = {{
              transform: `translate3d(${x}px, 0, 0)`,
            }}
            onClick = { this.click.bind(this) }
          />
        }
      </Motion>
    );
  }

}

export default connect(
  state => ({
    smashClicks: state.smashClicks,
  }),
  { click }
)(Rock);
