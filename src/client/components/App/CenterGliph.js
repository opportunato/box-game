import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { range } from 'lodash';

import s from './App.scss';

import * as phases from '../../constants/Phases';

class CenterGliph extends Component {

  static propTypes = {
    phase: PropTypes.string.isRequired,
    corners: PropTypes.array.isRequired,
  }

  render() {
    const { phase, corners } = this.props;
    const cornersClicked = corners.filter(corner => corner.clicked).length;

    if (phase !== phases.BOX) return null;

    return (
      <div className = { s['center-gliph'] }>
        {
          range(0, cornersClicked).map(index =>
            <div
              key = { index }
              style = {{
                backgroundImage: `url(${require(`./center-gliph/${index}.png`)})`,
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
  }),
)(CenterGliph);
