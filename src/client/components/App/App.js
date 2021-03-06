import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as phases from '../../constants/Phases';
import * as objects from '../../constants/Objects';

import { next, click, mouseMove } from '../../actions';

import s from './App.scss';

import Rock from './Rock';
import Box from './Box';
import SpriteAnimation from './SpriteAnimation';

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
    showLense: PropTypes.bool.isRequired,
    click: PropTypes.func.isRequired,
    mouseMove: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
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
      inventory,
      plantClicked,
      lenseCoords,
      jinnSize,
      dialog,
      showLense,
    } = this.props;

    return (
      <div
        className={ s.root }
        onMouseMove={ this.lenseMove.bind(this) }
        onClick={this.clickDialog.bind(this)}
      >
        <div className = { s.inventory }>
          {
            map(inventory.glyphs, (item, index) =>
              <div
                key = { `glyph-${index}` }
                className = {
                  classNames({
                    [s.visible]: item,
                  })
                }
                style = {{
                  backgroundImage: `url(${require(`./inventory/glyph-0${+index + 1}.png`)})`
                }}
                onClick = { this.click.bind(this, { object: objects.GLIPH, index }) }
              />
            )
          }
          {
            inventory.seedsNumber > 0 &&
            <div
              className = { s['inventory-seed'] }
              style = {{
                backgroundImage: `url(${require(`./inventory/seed.png`)})`
              }}
            >
              { inventory.seedsNumber } x
            </div>
          }
        </div>
        <Box />
        {
          phase === phases.GROWTH && !plantClicked &&
          <div
            className = { s.plant }
            onClick = { this.click.bind(this, { object: objects.PLANT }) }
          />
        }
        {
          [phases.SMASH, phases.BOX, phases.SOUND, phases.LENSE].indexOf(phase) === -1 &&
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
              ((phase === phases.JINN && jinnSize > 0) ||
              (phase === phases.DIALOG && dialog)) &&
              <div
                style = {{
                  backgroundImage: `url(${require(`./jinn/jinn-0${clamp(jinnSize, 4)}.png`)})`
                }}
                className = { s.jinn }
              />
            }
            {
              phase === phases.DIALOG && !dialog &&
              <SpriteAnimation
                className = { s['jinn-disappear'] }
                steps = { 11 }
                spriteSize = { 186 }
                onEnd = { this.props.next.bind(this) }
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
          ((phase === phases.DIALOG && showLense) ||
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
    showLense: state.showLense,
  }),
  {
    click,
    mouseMove,
    next,
  }
)(App);
