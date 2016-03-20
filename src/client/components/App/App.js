import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as phases from '../../constants/Phases';
import * as objects from '../../constants/Objects';

import { click, mouseMove } from '../../actions';

import s from './App.scss';

import Rock from './Rock';
import Box from './Box';

require('../base.css');

import classNames from 'classnames';

import 'babel-polyfill';

import { map, clamp } from 'lodash';

class App extends Component {

  static propTypes = {
    phase: PropTypes.string.isRequired,
    corners: PropTypes.array.isRequired,
    hatches: PropTypes.array.isRequired,
    seeds: PropTypes.array.isRequired,
    plantClicked: PropTypes.bool.isRequired,
    click: PropTypes.func.isRequired,
    mouseMove: PropTypes.func.isRequired,
    inventory: PropTypes.object.isRequired,
    lenseCoords: PropTypes.object.isRequired,
    jinnSize: PropTypes.number.isRequired,
    dialog: PropTypes.object,
  }

  click(options, e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.click(options);
  }

  clickDialog(e) {
    if (this.props.phase !== phases.DIALOG || !this.props.dialog) return;
    e.preventDefault();

    this.props.click({ object: objects.TEXT, });
  }

  lenseMove(e) {
    if (this.props.phase !== phases.LENSE) return;

    const { pageX, pageY } = e;

    this.props.mouseMove({
      object: objects.LENSE,
      coords: {
        x: pageX,
        y: pageY,
      }
    });
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
    const {
      phase,
      seeds,
      hatches,
      inventory,
      plantClicked,
      lenseCoords,
      jinnSize,
      dialog,
    } = this.props;

    return (
      <div
        className={ s.root }
        onMouseMove={ this.lenseMove.bind(this) }
        onClick={this.clickDialog.bind(this)}
      >
        <Box />
        {
          [phases.CATCH, phases.PLANT].indexOf(phase) > -1 &&
          <div className = { s['box-placeholder'] }>
            {
              [
                'top-left',
                'bottom-right',
                'bottom-left',
                'top-right',
              ].map((position, index) =>
                <div
                  key = { position }
                  className = {
                    classNames({
                      [s.corner]: true,
                      [s[position]]: true,
                    })
                  }
                >
                  <div
                    clicked = { hatches[index].clicked }
                    className = { s.hatch }
                    onClick = { this.props.click.bind(this, { object: objects.HATCH, index }) }
                  />
                </div>
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
          </div>
        }
        <div className = { s.inventory }>
          {
            map(inventory.gliphs, (item, index) =>
              item ?
              <div
                key = { `gliph-${index}` }
                style = {{
                  backgroundImage: `url(${require(`./inventory/gliph-0${+index + 1}.png`)})`
                }}
                onClick = { this.click.bind(this, { object: objects.GLIPH, index }) }
              /> : null
            )
          }
          {
            inventory.seedsNumber > 0 &&
            <div
              style = {{
                backgroundImage: `url(${require(`./inventory/seed.png`)})`
              }}
            />
          }
        </div>
        {
          phase === phases.GROWTH && !plantClicked &&
          <div
            className = { s.plant }
            onClick = { this.click.bind(this, { object: objects.PLANT }) }
          />
        }
        {
          [phases.SMASH, phases.BOX, phases.SOUND].indexOf(phase) === -1 &&
          dialog &&
          <div
            className = { s.center + ' ' + s.separate }
          >
            {
              phase === phases.GROWTH && plantClicked &&
              <div
                className = { s.flower }
                onClick = { this.click.bind(this, { object: objects.FLOWER }) }
              />
            }
            {
              (phase === phases.JINN ||
              (phase === phases.DIALOG && dialog)) &&
              <div
                style = {{
                  backgroundImage: `url(${require(`./jinn/jinn-0${clamp(jinnSize, 4)}.png`)})`
                }}
                className = { s.jinn }
              />
            }
          </div>
        }
        {
          phase === phases.DIALOG && dialog &&
          <div className = { s['dialog-speech'] }>
            { dialog.text }
          </div>
        }
        {
          phase === phases.DIALOG && (dialog || {}).options &&
          <div className = { s['dialog-options'] }>
            {
              (dialog.options || []).map((option, index) =>
                <div
                  key = { index }
                  onClick = { this.click.bind(this, { object: objects.OPTION, index }) }
                >
                  { option.text }
                </div>
              )
            }
          </div>
        }
        {
          ((phase === phases.DIALOG && !dialog) ||
            phase === phases.LENSE) &&
          <div
            className = {classNames({
              [s.lense]: true,
              [s.big]: phase === phases.LENSE,
            })}
            style = {{
              left: lenseCoords.x,
              top: lenseCoords.y,
            }}
            onClick = { this.click.bind(this, { object: objects.LENSE }) }
          />
        }
        <Rock />
      </div>
    );
  }
}

/* eslint-disable no-undef */
export default connect(
  state => ({
    corners: state.corners,
    seeds: state.seeds,
    hatches: state.hatches,
    phase: state.phase,
    gliphIndex: state.gliphIndex,
    jinnSize: state.jinnSize,
    inventory: state.inventory,
    plantClicked: state.plantClicked,
    dialog: state.dialog,
    lenseCoords: state.lenseCoords,
  }),
  {
    click,
    mouseMove
  }
)(App);
