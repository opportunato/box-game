import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

import { click, mouseMove } from '../../actions';
import { Motion, spring } from 'react-motion';

import { range } from 'lodash';

import CenterGliph from './CenterGliph';

import s from './App.scss';

import * as phases from '../../constants/Phases';
import * as objects from '../../constants/Objects';

class Box extends Component {

  static propTypes = {
    click: PropTypes.func.isRequired,
    mouseMove: PropTypes.func.isRequired,
    phase: PropTypes.string.isRequired,
    gliphIndex: PropTypes.number.isRequired,
    glow: PropTypes.object.isRequired,
    corners: PropTypes.array.isRequired,
    boxCenterClicked: PropTypes.bool.isRequired,
  }

  clickCorner(index) {
    this.props.click({ object: objects.BOX_CORNER, index });
  }

  clickCenter() {
    this.props.click({ object: objects.BOX_CENTER });
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
    const { boxCenterClicked, corners, phase, glow, gliphIndex } = this.props;

    if ([phases.BOX, phases.SOUND].indexOf(phase) === -1) return null;

    return (
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
              onClick = { this.clickCorner.bind(this, index) }
            />
          )
        }
        <button
          className = { s.center }
          onClick = { this.clickCenter.bind(this) }
        />
        {
          phase === phases.SOUND &&
          <div
            className = { s.glow }
            style = {{
              left: glow.coords.x,
              top: glow.coords.y,
              opacity: glow.opacity,
              backgroundImage: `url(${require(`./box/glow-0${gliphIndex + 1}.png`)})`
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
    );
  }

}

export default connect(
  state => ({
    phase: state.phase,
    corners: state.corners,
    glow: state.glow,
    gliphIndex: state.gliphIndex,
    boxCenterClicked: state.boxCenterClicked,
  }),
  { click, mouseMove }
)(Box);
