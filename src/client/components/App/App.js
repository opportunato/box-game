import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { clickBox } from '../../actions';

import s from './App.scss';

require('../base.css');

import classNames from 'classnames';

import 'babel-polyfill';

class App extends Component {

  static propTypes = {
    boxes: PropTypes.array.isRequired,
    clickBox: PropTypes.func.isRequired,
  }

  render() {
    const { boxes } = this.props;

    return (
      <div className={ s.root }>
        {
          boxes.map((box, index) =>
            <div
              key = { index }
              className = {
                classNames({
                  [s[box.position]]: true,
                  [s.clicked]: box.clicked,
                })
              }
              onClick = { this.props.clickBox.bind(this, index) }
            />
          )
        }
        <div className={ s.center } />
      </div>
    );
  }
}

/* eslint-disable no-undef */
export default connect(
  state => ({ boxes: state.boxes }),
  { clickBox }
)(App);
