import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as phases from '../../constants/Phases';
import * as objects from '../../constants/Objects';

import { click, mouseMove } from '../../actions';

import s from './App.scss';

require('../base.css');

import classNames from 'classnames';

import 'babel-polyfill';

class App extends Component {

  static propTypes = {
    phase: PropTypes.string.isRequired,
    corners: PropTypes.array.isRequired,
    seeds: PropTypes.array.isRequired,
    boxCenterClicked: PropTypes.bool.isRequired,
    click: PropTypes.func.isRequired,
    mouseMove: PropTypes.func.isRequired,
    smashClicks: PropTypes.number.isRequired,
    glowCoords: PropTypes.object.isRequired,
  }

  click(options, e) {
    e.preventDefault();

    this.props.click(options);
  }

  mouseMove(e) {
    const { pageX, pageY } = e;
    const container = this.refs.gliph;

    this.props.mouseMove({
      object: objects.GLIPH,
      coords: {
        x: pageX - (window.innerWidth - container.offsetWidth) / 2,
        y: pageY - (window.innerHeight - container.offsetHeight) / 2,
      }
    });
  }

  render() {
    const { phase, seeds, corners, smashClicks, boxCenterClicked, glowCoords } = this.props;

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
          [phases.BOX, phases.SOUND].indexOf(phase) > -1 &&
          <div
            className = { s.box }
          >
            {
              corners.map((corner, index) =>
                <button
                  key = { index }
                  className = {
                    classNames({
                      [s['corner-spot']]: true,
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
            {
              phase === phases.SOUND &&
              <div
                className = { s.glow }
                style = {{
                  left: glowCoords.x,
                  top: glowCoords.y,
                }}
              />
            }
            {
              phase === phases.SOUND &&
              <div
                ref = "gliph"
                className = { s.gliph }
                onMouseMove = { this.mouseMove.bind(this) }
              />
            }
          </div>
        }
        {
          phase === phases.CATCH &&
          <div className = { s['box-placeholder'] }>
            {
              [
                'top-left',
                'bottom-right',
                'bottom-left',
                'top-right',
              ].map(position =>
                <div
                  key = { position }
                  className = {
                    classNames({
                      [s.corner]: true,
                      [s[position]]: true,
                    })
                  }
                />
              )
            }
            {
              seeds.map((seed, index) =>
                <div
                  key = { seed.position }
                  className = {
                    classNames({
                      [s.seed]: true,
                      [s.clicked]: seed.clicked,
                      [s[seed.position]]: true,
                    })
                  }
                  onClick = { this.click.bind(this, { object: objects.SEED, index }) }
                />
              )
            }
            <div className = { s.center } />
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
    seeds: state.seeds,
    phase: state.phase,
    smashClicks: state.smashClicks,
    glowCoords: state.glowCoords,
    boxCenterClicked: state.boxCenterClicked,
  }),
  {
    click,
    mouseMove
  }
)(App);
