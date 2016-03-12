import React, { Component } from 'react';
import { connect } from 'react-redux';

import s from './App.scss';
const styles = s.locals ? s.locals : s;

require('../base.css');

import 'babel-polyfill';

class App extends Component {
  render() {
    return (
      <div className = { styles.root }>
        A good day to die
      </div>
    );
  }
}

/* eslint-disable no-undef */
export default connect(
)(App);
