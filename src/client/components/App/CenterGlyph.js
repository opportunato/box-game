import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

import { range } from 'lodash';

import s from './App.scss';

import * as phases from '../../constants/Phases';

class CenterGlyph extends Component {

  static propTypes = {
    phase: PropTypes.string.isRequired,
    corners: PropTypes.array.isRequired,
    boxCenterClicked: PropTypes.bool.isRequired,
  }

  render() {
    const { phase, corners, boxCenterClicked } = this.props;
    const cornersClicked = corners.filter(corner => corner.clicked).length;

    if (phase !== phases.BOX) return null;

    return (
      <div className = { s['center-glyph'] }>
        {
          range(0, 5).map(index =>
            <div
              key = { index }
              className = {
                classNames({
                  [s.visible]: boxCenterClicked && index <= cornersClicked,
                  [s[`step-${index}`]]: true,
                })
              }
              style = {{
                backgroundImage: `url(${require(`./center-glyph/${index}.png`)})`,
              }}
            />
          )
        }
      </div>
    );
  }

}

export default connect(
  state => ({
    phase: state.phase,
    corners: state.corners,
    boxCenterClicked: state.boxCenterClicked,
  }),
)(CenterGlyph);
