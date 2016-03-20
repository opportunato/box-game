import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

import { click } from '../../actions';
import { Motion, spring } from 'react-motion';

import { range } from 'lodash';

import s from './App.scss';

import * as phases from '../../constants/Phases';
import * as objects from '../../constants/Objects';

class Rock extends Component {

  static propTypes = {
    click: PropTypes.func.isRequired,
    phase: PropTypes.string.isRequired,
    smashClicks: PropTypes.number.isRequired,
    rockCracked: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = { x: 0, hide: false };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.phase !== phases.SMASH && this.props.phase === phases.SMASH) {
      setTimeout(() => {
        this.setState({ hide: true });
      }, 1000);
    }
  }

  getRockStyles() {
    return {
      x: spring(this.state.x, { stifness: 300, damping: 2 }),
    };
  }

  getCrackStyles(index) {
    const { phase } = this.props;

    const crackCoords = [
      { x: -500, y: -500 },
      { x: -500, y: 500 },
      { x: 600, y: 600 },
      { x: 1000, y: 0 },
      { x: 0, y: -500 },
    ];

    return {
      _x: spring(phase === phases.SMASH ? 0 : crackCoords[index].x, { stifness: 70 }),
      _y: spring(phase === phases.SMASH ? 0 : crackCoords[index].y, { stifness: 70 }),
    };
  }

  click() {
    if (this.props.phase !== phases.SMASH) return;
    this.setState({ x: 50 });
    setTimeout(() => {
      this.setState({ x: 0 });
    }, 100);
    this.props.click({ object: objects.ROCK });
  }

  render() {
    const { phase, smashClicks, rockCracked } = this.props;

    if (this.state.hide || this.props.phase !== phases.SMASH) return null;

    return (
      <Motion style = { this.getRockStyles() }>
        {({ x }) =>
          <div
            className={
              classNames({
                [s.rock]: true,
                [s[`clicked-${smashClicks}`]]: true,
              })
            }
            style = {{
              backgroundImage: phase === phases.SMASH ? null : 'none',
              transform: `translate3d(${x}px, 0, 0)`,
            }}
            onClick = { this.click.bind(this) }
          >
            {
              range(0, 5).map(index =>
                <Motion key = { index } style = { this.getCrackStyles(index) }>
                  {({ _x, _y }) =>
                    <div
                      className = { s.crack }
                      style = {{
                        opacity: rockCracked ? 1 : 0,
                        backgroundImage: `url(${require(`./rock/cracks/${index}.png`)})`,
                        transform: `translate3d(${_x}px, ${_y}px, 0)`,
                      }}
                    />
                  }
                </Motion>
              )
            }
          </div>
        }
      </Motion>
    );
  }

}

export default connect(
  state => ({
    phase: state.phase,
    smashClicks: state.smashClicks,
    rockCracked: state.rockCracked,
  }),
  { click }
)(Rock);
