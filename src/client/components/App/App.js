import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as phases from '../../constants/Phases';

import { colorClickBox, smashCrystal } from '../../actions';

import s from './App.scss';

require('../base.css');

import classNames from 'classnames';

import 'babel-polyfill';

class App extends Component {

  static propTypes = {
    phase: PropTypes.string.isRequired,
    boxes: PropTypes.array.isRequired,
    colorClickBox: PropTypes.func.isRequired,
    smashCrystal: PropTypes.func.isRequired,
  }

  render() {
    const { phase, boxes } = this.props;

    return (
      <div className={ s.root }>
        {
          phase === phases.SMASH &&
          <div
            className={ s.crystal }
            onClick = { this.props.smashCrystal.bind(this) }
          />
        }
        {
          phase === phases.COLOR &&
          boxes.map((box, index) =>
            <div
              key = { index }
              className = {
                classNames({
                  [s[box.position]]: true,
                  [s.clicked]: box.clicked,
                })
              }
              onClick = { this.props.colorClickBox.bind(this, index) }
            />
          )
        }
        {
          this.props.phase === phases.COLOR &&
          <div className={ s.center } />
        }
      </div>
    );
  }
}

/* eslint-disable no-undef */
export default connect(
  state => ({
    boxes: state.boxes,
    phase: state.phase,
  }),
  {
    colorClickBox,
    smashCrystal,
  }
)(App);
