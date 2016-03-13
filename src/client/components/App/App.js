import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as phases from '../../constants/Phases';
import * as objects from '../../constants/Objects';

import { click } from '../../actions';

import s from './App.scss';

require('../base.css');

import classNames from 'classnames';

import 'babel-polyfill';

class App extends Component {

  static propTypes = {
    phase: PropTypes.string.isRequired,
    corners: PropTypes.array.isRequired,
    boxCenterClicked: PropTypes.bool.isRequired,
    click: PropTypes.func.isRequired,
    smashClicks: PropTypes.number.isRequired,
  }

  click(options, e) {
    e.preventDefault();

    this.props.click(options);
  }

  render() {
    const { phase, corners, smashClicks, boxCenterClicked } = this.props;

    return (
      <div className={ s.root }>
        {
          phase === phases.SMASH &&
          <div
            className={
              classNames({
                [s.rock]: true,
                [s[`clicked-${smashClicks}`]]: true,
              })
            }
            onClick = { this.click.bind(this, { object: objects.ROCK }) }
          />
        }
        {
          phase === phases.BOX &&
          <div
            className = { s.box }
          >
            {
              corners.map((corner, index) =>
                <button
                  key = { index }
                  className = {
                    classNames({
                      [s.corner]: true,
                      [s[corner.position]]: true,
                      [s.clicked]: corner.clicked,
                      [s.clickable]: boxCenterClicked,
                    })
                  }
                  onClick = { this.click.bind(this, { object: objects.BOX_CORNER, index }) }
                />
              )
            }
            <button
              className = { s.center }
              onClick = { this.click.bind(this, { object: objects.BOX_CENTER }) }
            />
          </div>
        }
      </div>
    );
  }
}

/* eslint-disable no-undef */
export default connect(
  state => ({
    corners: state.corners,
    phase: state.phase,
    smashClicks: state.smashClicks,
    boxCenterClicked: state.boxCenterClicked,
  }),
  {
    click,
  }
)(App);
